/**
 * CreatePrescriptionPage.jsx
 *
 * Implements Design Spec §12 & §13 (Create Prescription):
 * - Strict temporary data policy: everything kept in React memory only
 * - 2-column workspace on desktop with sticky A4 preview
 * - Edit / Preview tab mode below 1024px
 * - Sticky 56px action bar with Clear Form & Print Prescription
 * - Chamber selection, Patient info, Clinical notes, Repeatable medicines with Undo toast, Advice
 * - Two-layer leave guard (browser beforeunload + React Router blocker)
 * - Clear form confirmation modal
 * - Pixel-perfect native browser printing + jsPDF export fallback
 */

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";
import ChamberDropdown from "../components/chamber/ChamberDropdown";
import MedicineEntry from "../components/prescription/MedicineEntry";
import PrescriptionPreview from "../components/prescription/PrescriptionPreview";
import TextInput from "../components/ui/TextInput";
import TextareaInput from "../components/ui/TextareaInput";
import SelectInput from "../components/ui/SelectInput";
import SegmentedControl from "../components/ui/SegmentedControl";
import Button from "../components/ui/Button";
import NoticeBanner from "../components/ui/NoticeBanner";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { usePrescriptionState } from "../hooks/usePrescriptionState";
import { useLeaveGuard } from "../hooks/useLeaveGuard";
import { useToast } from "../context/ToastContext";
import * as chamberService from "../services/chamberService";
import { generatePrescriptionPDF } from "../utils/pdfExport";
import { Printer, Lock, Plus, Download } from "lucide-react";

const CreatePrescriptionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Temporary Prescription State (100% in React memory)
  const {
    state,
    setField,
    setSelectedChamberId,
    addMedicine,
    updateMedicine,
    removeMedicine,
    restoreMedicine,
    clearForm,
    hasContent,
    validate,
  } = usePrescriptionState();

  // Chambers list & loading
  const [chambers, setChambers] = useState([]);
  const [isLoadingChambers, setIsLoadingChambers] = useState(true);
  const [chamberLoadError, setChamberLoadError] = useState(false);

  // Responsive tab mode for screens < 1024px: "edit" | "preview"
  const [activeTab, setActiveTab] = useState("edit");

  // Dialogs & banners
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [leaveProceedCallback, setLeaveProceedCallback] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [hasPrintedOnce, setHasPrintedOnce] = useState(false);

  // Form container ref for error scrolling
  const formRef = useRef(null);

  // Load chambers on mount
  const loadChambers = async () => {
    setIsLoadingChambers(true);
    setChamberLoadError(false);
    try {
      const res = await chamberService.getChambers();
      const list = res?.data?.chambers || res?.chambers || [];
      setChambers(list);

      // Preselection rule per §12.3:
      // 1. URL param chamberId
      // 2. If exactly one chamber exists, preselect it
      const urlChamberId = searchParams.get("chamberId");
      if (urlChamberId && list.some((c) => c._id === urlChamberId)) {
        setSelectedChamberId(urlChamberId);
      } else if (list.length === 1) {
        setSelectedChamberId(list[0]._id);
      }
    } catch {
      setChamberLoadError(true);
    } finally {
      setIsLoadingChambers(false);
    }
  };

  useEffect(() => {
    loadChambers();
  }, []);

  // Leave guard hook: warns if form has content
  useLeaveGuard(hasContent(), (proceed, reset) => {
    setLeaveProceedCallback(() => proceed);
    setShowLeaveDialog(true);
  });

  // Selected chamber object
  const selectedChamber = chambers.find((c) => c._id === state.selectedChamberId);

  // Handle Medicine Removal with Undo Toast (8 seconds duration)
  const handleRemoveMedicine = (id, idx) => {
    const medToRemove = state.medicines.find((m) => m.id === id);
    removeMedicine(id);

    addToast({
      type: "info",
      message: `Medicine ${idx + 1} removed.`,
      duration: 8000,
      action: {
        label: "Undo",
        onClick: () => restoreMedicine(medToRemove, idx),
      },
    });
  };

  // Handle Print Action
  const handlePrint = () => {
    const errors = validate();
    setValidationErrors(errors);

    if (errors.length > 0) {
      // Scroll to form top to show error banner
      formRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!hasPrintedOnce) {
      addToast({
        type: "info",
        message:
          "In the print dialog, choose paper size A4, margins Default, and turn off Headers and footers.",
        duration: 7000,
      });
      setHasPrintedOnce(true);
    }

    // Trigger native browser print
    window.print();
  };

  // Handle Save as PDF fallback
  const handleSaveAsPDF = () => {
    const errors = validate();
    setValidationErrors(errors);

    if (errors.length > 0) {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      const pdf = generatePrescriptionPDF(state, selectedChamber);
      const safePatientName = (state.patientName || "Prescription").replace(/[^a-zA-Z0-9]/g, "_");
      pdf.save(`${safePatientName}_Prescription.pdf`);

      addToast({
        type: "success",
        message: "Prescription PDF downloaded successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        message: "Could not generate PDF. Please use Print Prescription instead.",
      });
    }
  };

  // Handle Confirm Clear Form
  const handleConfirmClear = () => {
    const currentChamberId = state.selectedChamberId;
    clearForm();
    // Keep selected chamber selected per §12.9
    setSelectedChamberId(currentChamberId);
    setShowClearDialog(false);
    setValidationErrors([]);
    addToast({
      type: "success",
      message: "Prescription cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col">
      <AppHeader />

      {/* ============================================================
          STICKY ACTION BAR (56px high, sticks at top of viewport)
          ============================================================ */}
      <div className="action-bar sticky top-0 z-30 w-full h-[56px] md:h-[56px] bg-white border-b border-[#D5DDE3]">
        <div className="max-w-[1440px] h-full mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-[20px] md:text-[24px] leading-[32px] font-semibold text-[#14232B] truncate">
            Create Prescription
          </h1>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowClearDialog(true)}
              disabled={!hasContent()}
            >
              Clear Form
            </Button>

            <Button
              variant="primary"
              onClick={handlePrint}
              icon={Printer}
              iconPosition="left"
            >
              Print Prescription
            </Button>
          </div>
        </div>
      </div>

      {/* ============================================================
          RESPONSIVE TABS (< 1024px ONLY)
          ============================================================ */}
      <div className="lg:hidden sticky top-[56px] z-20 bg-white border-b border-[#D5DDE3] px-4 py-2">
        <SegmentedControl
          options={[
            { label: "Edit Form", value: "edit" },
            { label: "Live Preview", value: "preview" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* ============================================================
          MAIN WORKSPACE (2-Column Grid on Desktop)
          ============================================================ */}
      <main id="main-content" className="flex-1 py-6 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6 items-start relative">
          {/* ============================================================
              LEFT: FORM COLUMN (560px >=1440, 520px at 1280, 460px at 1024)
              ============================================================ */}
          <div
            ref={formRef}
            className={`w-full lg:w-[460px] desktop:w-[520px] wide:w-[560px] shrink-0 space-y-6 ${
              activeTab === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            {/* 1. Permanent Temporary-Data Notice */}
            <div className="temp-data-notice">
              <NoticeBanner type="info">
                <strong>This prescription is temporary.</strong> Nothing on this
                page is saved. Patient and prescription details are cleared when you
                refresh or leave the page.
              </NoticeBanner>
            </div>

            {/* Validation Error Banner */}
            {validationErrors.length > 0 && (
              <NoticeBanner type="error">
                Complete the highlighted required fields before printing.
              </NoticeBanner>
            )}

            {/* 2. Chamber Selection Card */}
            <div className="bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6">
              <ChamberDropdown
                chambers={chambers}
                selectedChamberId={state.selectedChamberId}
                onSelectChamber={setSelectedChamberId}
                isLoading={isLoadingChambers}
                loadError={chamberLoadError}
                onRetry={loadChambers}
                error={
                  validationErrors.includes("chamber")
                    ? "Select a chamber."
                    : undefined
                }
              />
            </div>

            {/* 3. Patient Information Card */}
            <div className="bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6">
              <h2 className="text-[18px] leading-[26px] font-semibold text-[#14232B] mb-5">
                Patient Information
              </h2>

              <div className="space-y-4">
                {/* Row 1: Patient Name */}
                <TextInput
                  label="Patient name"
                  placeholder="Full name"
                  value={state.patientName}
                  onChange={(e) => setField("patientName", e.target.value)}
                  error={
                    validationErrors.includes("patientName")
                      ? "Enter the patient’s name."
                      : undefined
                  }
                  required
                  maxLength={80}
                />

                {/* Row 2: Age + Sex */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Joined Age Control */}
                  <div>
                    <label className="text-[14px] leading-[20px] font-medium text-[#14232B] flex items-center mb-1.5">
                      Age <span className="text-[#B42318] ml-1">*</span>
                    </label>
                    <div
                      className={`flex h-[44px] rounded-[6px] border bg-white overflow-hidden ${
                        validationErrors.includes("age")
                          ? "border-[#B42318]"
                          : "border-[#7D8D98]"
                      }`}
                    >
                      <input
                        type="number"
                        placeholder="Age"
                        value={state.age}
                        onChange={(e) => setField("age", e.target.value)}
                        min={0}
                        max={120}
                        className="flex-1 px-3 text-[14px] outline-none text-[#14232B] placeholder:text-[#66757F]"
                      />
                      <div className="w-[112px] border-l border-[#B7C3CC]">
                        <select
                          value={state.ageUnit}
                          onChange={(e) => setField("ageUnit", e.target.value)}
                          className="w-full h-full px-2 text-[14px] outline-none bg-white text-[#14232B] cursor-pointer"
                        >
                          <option value="Years">Years</option>
                          <option value="Months">Months</option>
                          <option value="Days">Days</option>
                        </select>
                      </div>
                    </div>
                    {validationErrors.includes("age") && (
                      <p className="text-[13px] leading-[18px] font-medium text-[#B42318] mt-1">
                        Enter the patient’s age.
                      </p>
                    )}
                  </div>

                  {/* Sex Segmented Control */}
                  <SegmentedControl
                    label="Sex"
                    options={["Male", "Female", "Other"]}
                    value={state.sex}
                    onChange={(val) => setField("sex", val)}
                    error={
                      validationErrors.includes("sex")
                        ? "Select the patient’s sex."
                        : undefined
                    }
                    required
                  />
                </div>

                {/* Row 3: Consultation Date */}
                <div className="w-full md:w-1/2">
                  <TextInput
                    label="Consultation date"
                    type="date"
                    value={state.consultationDate}
                    onChange={(e) => setField("consultationDate", e.target.value)}
                    error={
                      validationErrors.includes("consultationDate")
                        ? "Enter the consultation date."
                        : undefined
                    }
                    helperText="Printed as DD/MM/YYYY."
                    required
                  />
                </div>
              </div>
            </div>

            {/* 4. Clinical Information Card */}
            <div className="bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6">
              <h2 className="text-[18px] leading-[26px] font-semibold text-[#14232B] mb-5">
                Clinical Information
              </h2>

              <div className="space-y-4">
                <TextareaInput
                  label="Chief Complaints"
                  placeholder="For example: fever for 3 days, dry cough"
                  value={state.chiefComplaints}
                  onChange={(e) => setField("chiefComplaints", e.target.value)}
                  maxLength={1000}
                  minHeight="72px"
                  optional
                />

                <TextareaInput
                  label="Clinical Notes"
                  placeholder="History, vitals, examination findings"
                  value={state.clinicalNotes}
                  onChange={(e) => setField("clinicalNotes", e.target.value)}
                  maxLength={1000}
                  minHeight="96px"
                  optional
                />

                <TextareaInput
                  label="Diagnosis / Provisional Diagnosis"
                  placeholder="For example: acute pharyngitis"
                  value={state.diagnosis}
                  onChange={(e) => setField("diagnosis", e.target.value)}
                  maxLength={500}
                  minHeight="72px"
                  optional
                />

                <TextareaInput
                  label="Investigations"
                  placeholder="Tests advised"
                  value={state.investigations}
                  onChange={(e) => setField("investigations", e.target.value)}
                  maxLength={1000}
                  minHeight="72px"
                  optional
                />
              </div>
            </div>

            {/* 5. Medicines Card */}
            <div className="bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-[18px] leading-[26px] font-semibold text-[#14232B]">
                    Medicines
                  </h2>
                  <span className="text-[14px] text-[#5F6F7A]">
                    ({state.medicines.length})
                  </span>
                </div>

                <Button
                  variant="secondary"
                  size="small"
                  onClick={addMedicine}
                  disabled={state.medicines.length >= 20}
                  icon={Plus}
                >
                  Add Medicine
                </Button>
              </div>

              <p className="text-[13px] leading-[20px] text-[#5F6F7A] mb-5">
                Only the medicine name is required.
              </p>

              {validationErrors.includes("medicines") && (
                <div className="mb-4">
                  <NoticeBanner type="error">
                    Enter at least one medicine with a name before printing.
                  </NoticeBanner>
                </div>
              )}

              {/* Medicine Entries List */}
              <div className="space-y-4">
                {state.medicines.map((med, idx) => (
                  <MedicineEntry
                    key={med.id}
                    index={idx}
                    medicine={med}
                    totalMedicines={state.medicines.length}
                    onChange={(field, val) => updateMedicine(med.id, field, val)}
                    onRemove={() => handleRemoveMedicine(med.id, idx)}
                    error={
                      validationErrors.includes("medicines") && !med.name?.trim()
                        ? "Enter the medicine name."
                        : undefined
                    }
                  />
                ))}
              </div>

              {/* Bottom Dashed Add Button */}
              <button
                type="button"
                onClick={addMedicine}
                disabled={state.medicines.length >= 20}
                className="w-full h-[44px] mt-4 border border-dashed border-[#7D8D98] rounded-[6px]
                           text-[#0F5A78] text-[14px] font-semibold flex items-center justify-center gap-2
                           hover:bg-[#E6F0F4] transition-colors duration-120 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                <span>Add Medicine</span>
              </button>
              {state.medicines.length >= 20 && (
                <p className="text-[13px] text-[#5F6F7A] mt-2 text-center">
                  Maximum of 20 medicines reached.
                </p>
              )}
            </div>

            {/* 6. Advice and Follow-up Card */}
            <div className="bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6">
              <h2 className="text-[18px] leading-[26px] font-semibold text-[#14232B] mb-5">
                Advice and Follow-up
              </h2>

              <div className="space-y-4">
                <TextareaInput
                  label="Advice"
                  placeholder="Diet, rest, precautions"
                  value={state.advice}
                  onChange={(e) => setField("advice", e.target.value)}
                  maxLength={1000}
                  minHeight="96px"
                  optional
                />

                <TextareaInput
                  label="Follow-up Instructions"
                  placeholder="For example: review after 5 days, sooner if fever persists"
                  value={state.followUp}
                  onChange={(e) => setField("followUp", e.target.value)}
                  maxLength={300}
                  minHeight="64px"
                  optional
                />
              </div>
            </div>

            {/* Secondary Save as PDF Action */}
            <div className="pt-2 flex justify-end">
              <Button
                variant="secondary"
                onClick={handleSaveAsPDF}
                icon={Download}
                iconPosition="left"
              >
                Save as PDF
              </Button>
            </div>
          </div>

          {/* ============================================================
              RIGHT: PREVIEW COLUMN (Sticky, Fluid width)
              ============================================================ */}
          <div
            className={`w-full lg:flex-1 lg:sticky lg:top-[80px] lg:h-[calc(100vh-104px)] ${
              activeTab === "edit" ? "hidden lg:block" : "block"
            }`}
          >
            <PrescriptionPreview
              prescriptionState={state}
              selectedChamber={selectedChamber}
            />
          </div>
        </div>
      </main>

      {/* Clear Confirmation Modal */}
      <ConfirmDialog
        isOpen={showClearDialog}
        title="Clear this prescription?"
        body="All patient, clinical and medicine details will be removed. The selected chamber stays selected."
        cancelLabel="Cancel"
        confirmLabel="Clear Form"
        variant="destructive"
        onCancel={() => setShowClearDialog(false)}
        onConfirm={handleConfirmClear}
      />

      {/* Leave Page Confirmation Modal */}
      <ConfirmDialog
        isOpen={showLeaveDialog}
        title="Leave this page?"
        body="The prescription you are preparing is not saved and will be lost."
        cancelLabel="Stay on Page"
        confirmLabel="Leave Page"
        variant="destructive"
        onCancel={() => setShowLeaveDialog(false)}
        onConfirm={() => {
          setShowLeaveDialog(false);
          if (leaveProceedCallback) leaveProceedCallback();
        }}
      />
    </div>
  );
};

export default CreatePrescriptionPage;
