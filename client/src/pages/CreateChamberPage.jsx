/**
 * CreateChamberPage.jsx
 *
 * Implements Design Spec §11 (Create Chamber):
 * - Max 880px centered form
 * - 3 stacked cards: Chamber Info, Doctor Info (prefilled), Visiting Schedule (Day chips + 1-2 sessions)
 * - Discard confirmation dialog on Cancel
 * - Inline Success card replacing the form upon successful creation
 * - "Add Another Chamber" prefill continuity
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";
import TextInput from "../components/ui/TextInput";
import TextareaInput from "../components/ui/TextareaInput";
import SelectInput from "../components/ui/SelectInput";
import DayChipGroup from "../components/ui/DayChipGroup";
import Button from "../components/ui/Button";
import NoticeBanner from "../components/ui/NoticeBanner";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ChamberCard from "../components/chamber/ChamberCard";
import { useAuth } from "../context/AuthContext";
import * as chamberService from "../services/chamberService";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

// 15-minute time slots from 5:00 AM to 11:45 PM
const TIME_SLOTS = [];
for (let hour = 5; hour <= 23; hour++) {
  for (let min of [0, 15, 30, 45]) {
    const period = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    const mStr = min === 0 ? "00" : min.toString();
    TIME_SLOTS.push(`${h12}:${mStr} ${period}`);
  }
}

const CreateChamberPage = () => {
  const navigate = useNavigate();
  const { doctor } = useAuth();

  // Prefill source tracking
  const [isPrefilledFromChamber, setIsPrefilledFromChamber] = useState(false);
  const [createdChamber, setCreatedChamber] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    chamberName: "",
    address: "",
    contactNumber: "",
    doctorName: "",
    qualifications: "",
    registrationNo: "",
    visitingDays: [],
    visitingSessions: [{ from: "05:00 PM", to: "08:00 PM" }],
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // On mount: Fetch most recent chamber to prefill doctor details
  useEffect(() => {
    const loadPrefill = async () => {
      try {
        const res = await chamberService.getChambers();
        const list = res?.data?.chambers || res?.chambers || [];
        if (list.length > 0) {
          const lastChamber = list[list.length - 1];
          setFormData((prev) => ({
            ...prev,
            doctorName: lastChamber.doctorName || "",
            qualifications: lastChamber.qualifications || "",
            registrationNo: lastChamber.registrationNo || "",
          }));
          setIsPrefilledFromChamber(true);
        } else if (doctor?.fullName) {
          const cleanedName = doctor.fullName.startsWith("Dr.")
            ? doctor.fullName
            : `Dr. ${doctor.fullName}`;
          setFormData((prev) => ({
            ...prev,
            doctorName: cleanedName,
          }));
        }
      } catch {
        // Fallback to doctor name from auth context
        if (doctor?.fullName) {
          setFormData((prev) => ({
            ...prev,
            doctorName: `Dr. ${doctor.fullName.replace(/^Dr\.\s*/i, "")}`,
          }));
        }
      }
    }

    loadPrefill();
  }, [doctor]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let err = "";

    if (field === "chamberName") {
      if (!value?.trim()) err = "Enter a chamber name.";
    } else if (field === "address") {
      if (!value?.trim()) err = "Enter the chamber address.";
    } else if (field === "contactNumber") {
      const cleanNum = value?.replace(/[\s+-]/g, "");
      if (!cleanNum || cleanNum.length < 8 || cleanNum.length > 15) {
        err = "Enter a valid contact number.";
      }
    } else if (field === "doctorName") {
      if (!value?.trim()) err = "Enter the doctor’s name.";
    } else if (field === "qualifications") {
      if (!value?.trim()) err = "Enter your qualifications.";
    } else if (field === "registrationNo") {
      if (!value?.trim()) err = "Enter your registration number.";
    } else if (field === "visitingDays") {
      if (!value || value.length === 0) err = "Select at least one visiting day.";
    }

    setErrors((prev) => ({ ...prev, [field]: err }));
    return err;
  };

  const validateAll = () => {
    const nextErrors = {};
    nextErrors.chamberName = validateField("chamberName", formData.chamberName);
    nextErrors.address = validateField("address", formData.address);
    nextErrors.contactNumber = validateField("contactNumber", formData.contactNumber);
    nextErrors.doctorName = validateField("doctorName", formData.doctorName);
    nextErrors.qualifications = validateField("qualifications", formData.qualifications);
    nextErrors.registrationNo = validateField("registrationNo", formData.registrationNo);
    nextErrors.visitingDays = validateField("visitingDays", formData.visitingDays);

    setTouched({
      chamberName: true,
      address: true,
      contactNumber: true,
      doctorName: true,
      qualifications: true,
      registrationNo: true,
      visitingDays: true,
    });

    return Object.values(nextErrors).filter(Boolean);
  };

  // Visiting Session Handlers
  const addSession = () => {
    if (formData.visitingSessions.length >= 2) return;
    setFormData((prev) => ({
      ...prev,
      visitingSessions: [
        ...prev.visitingSessions,
        { from: "09:00 AM", to: "01:00 PM" },
      ],
    }));
  };

  const updateSession = (idx, field, val) => {
    setFormData((prev) => {
      const nextSessions = [...prev.visitingSessions];
      nextSessions[idx] = { ...nextSessions[idx], [field]: val };
      return { ...prev, visitingSessions: nextSessions };
    });
  };

  const removeSession = (idx) => {
    if (formData.visitingSessions.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      visitingSessions: prev.visitingSessions.filter((_, i) => i !== idx),
    }));
  };

  // Check if form is dirty for Cancel confirmation
  const isDirty =
    Boolean(formData.chamberName) ||
    Boolean(formData.address) ||
    Boolean(formData.contactNumber) ||
    formData.visitingDays.length > 0;

  const handleCancelClick = () => {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      navigate("/dashboard");
    }
  };

  // Save Chamber
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError("");

    const errs = validateAll();
    if (errs.length > 0) {
      setSaveError("Please correct the highlighted fields.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        chamberName: formData.chamberName.trim(),
        address: formData.address.trim(),
        contactNumber: formData.contactNumber.trim(),
        doctorName: formData.doctorName.trim(),
        qualifications: formData.qualifications.trim(),
        registrationNo: formData.registrationNo.trim(),
        visitingDays: formData.visitingDays,
        visitingSessions: formData.visitingSessions,
      };

      const res = await chamberService.createChamber(payload);
      const savedChamber = res?.data?.chamber || res?.chamber || payload;
      setCreatedChamber(savedChamber);
    } catch (err) {
      if (err.response?.status === 409) {
        setSaveError("You already have a chamber with this name.");
      } else {
        setSaveError("We couldn’t save this chamber. Check your connection and try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Add Another Chamber handler
  const handleAddAnother = () => {
    setCreatedChamber(null);
    setSaveError("");
    setTouched({});
    setErrors({});
    setFormData((prev) => ({
      chamberName: "",
      address: "",
      contactNumber: "",
      doctorName: prev.doctorName,
      qualifications: prev.qualifications,
      registrationNo: prev.registrationNo,
      visitingDays: [],
      visitingSessions: [{ from: "05:00 PM", to: "08:00 PM" }],
    }));
    setIsPrefilledFromChamber(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col">
      <AppHeader />

      <main id="main-content" className="flex-1 py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-[880px] mx-auto">
          {/* Back link */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-[14px] leading-[20px] font-medium text-[#0F5A78] hover:text-[#0B475F] mb-4 focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            <span>Dashboard</span>
          </Link>

          {/* ============================================================
              INLINE SUCCESS CARD (Replaces form upon success per §11.3)
              ============================================================ */}
          {createdChamber ? (
            <div className="bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6 md:p-8 space-y-6">
              <NoticeBanner type="success">
                Chamber saved. ‘{createdChamber.chamberName}’ is ready to use on
                prescriptions.
              </NoticeBanner>

              <div>
                <h3 className="text-[16px] font-semibold text-[#14232B] mb-3">
                  Saved chamber preview:
                </h3>
                <ChamberCard chamber={createdChamber} />
              </div>

              <div className="pt-4 border-t border-[#D5DDE3] flex flex-col md:flex-row items-center justify-between gap-4">
                <Link to="/dashboard" className="text-[14px] font-medium text-[#0F5A78] hover:underline">
                  Back to Dashboard
                </Link>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Button variant="secondary" onClick={handleAddAnother} className="w-full md:w-auto">
                    Add Another Chamber
                  </Button>
                  <Link
                    to={`/prescriptions/new?chamberId=${createdChamber._id}`}
                    className="w-full md:w-auto"
                  >
                    <Button variant="primary" className="w-full md:w-auto">
                      Create Prescription
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================
               CHAMBER CREATION FORM
               ============================================================ */
            <>
              {/* Heading Block */}
              <div className="mb-6">
                <h1 className="text-[24px] leading-[32px] font-semibold text-[#14232B]">
                  Create Chamber
                </h1>
                <p className="mt-2 text-[14px] leading-[22px] text-[#3F4F5A] max-w-[640px]">
                  Save a chamber’s details once. They appear automatically on every
                  prescription you create for it.
                </p>
              </div>

              {/* Form-level Error Banner */}
              {saveError && (
                <div className="mb-6">
                  <NoticeBanner type="error">{saveError}</NoticeBanner>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* ---------------- CARD 1: CHAMBER INFORMATION ---------------- */}
                <div className="bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6">
                  <h2 className="text-[18px] leading-[26px] font-semibold text-[#14232B]">
                    Chamber Information
                  </h2>
                  <p className="text-[13px] leading-[20px] text-[#5F6F7A] mt-1 mb-5">
                    Physical clinic or hospital location details.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                    {/* Chamber Name (full width) */}
                    <div className="md:col-span-2">
                      <TextInput
                        label="Chamber name"
                        placeholder="Domkal Clinic"
                        value={formData.chamberName}
                        onChange={(e) => handleChange("chamberName", e.target.value)}
                        onBlur={() => handleBlur("chamberName")}
                        error={touched.chamberName ? errors.chamberName : ""}
                        helperText="This name appears in the chamber list when you create a prescription."
                        required
                        maxLength={60}
                      />
                    </div>

                    {/* Chamber Address (full width) */}
                    <div className="md:col-span-2">
                      <TextareaInput
                        label="Chamber address"
                        placeholder="Main Road, Domkal, Murshidabad, West Bengal - 742303"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        onBlur={() => handleBlur("address")}
                        error={touched.address ? errors.address : ""}
                        helperText="Printed on the prescription exactly as entered. Use line breaks for a multi-line address."
                        required
                        maxLength={200}
                        minHeight="96px"
                      />
                    </div>

                    {/* Contact Number (half width) */}
                    <div>
                      <TextInput
                        label="Contact number"
                        type="tel"
                        placeholder="98300 12345"
                        value={formData.contactNumber}
                        onChange={(e) => handleChange("contactNumber", e.target.value)}
                        onBlur={() => handleBlur("contactNumber")}
                        error={touched.contactNumber ? errors.contactNumber : ""}
                        required
                        maxLength={20}
                      />
                    </div>
                  </div>
                </div>

                {/* ---------------- CARD 2: DOCTOR INFORMATION ---------------- */}
                <div className="bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6">
                  <h2 className="text-[18px] leading-[26px] font-semibold text-[#14232B]">
                    Doctor Information
                  </h2>
                  <p className="text-[13px] leading-[20px] text-[#5F6F7A] mt-1 mb-5">
                    {isPrefilledFromChamber
                      ? "Copied from your last chamber. RxDesk does not verify these details."
                      : "RxDesk does not verify these details. Enter them as they appear on your registration certificate."}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                    {/* Doctor's Name (full width) */}
                    <div className="md:col-span-2">
                      <TextInput
                        label="Doctor’s name"
                        placeholder="Dr. Anita Sen"
                        value={formData.doctorName}
                        onChange={(e) => handleChange("doctorName", e.target.value)}
                        onBlur={() => handleBlur("doctorName")}
                        error={touched.doctorName ? errors.doctorName : ""}
                        helperText="Printed exactly as entered, for example Dr. Anita Sen."
                        required
                        maxLength={80}
                      />
                    </div>

                    {/* Qualifications (half width) */}
                    <div>
                      <TextInput
                        label="Qualifications"
                        placeholder="MBBS, MD (Medicine)"
                        value={formData.qualifications}
                        onChange={(e) => handleChange("qualifications", e.target.value)}
                        onBlur={() => handleBlur("qualifications")}
                        error={touched.qualifications ? errors.qualifications : ""}
                        helperText="For example MBBS, MD (Medicine)"
                        required
                        maxLength={100}
                      />
                    </div>

                    {/* Registration Number (half width) */}
                    <div>
                      <TextInput
                        label="Medical registration number"
                        placeholder="WBMC 12345"
                        value={formData.registrationNo}
                        onChange={(e) => handleChange("registrationNo", e.target.value)}
                        onBlur={() => handleBlur("registrationNo")}
                        error={touched.registrationNo ? errors.registrationNo : ""}
                        helperText="Include the council name, for example WBMC 12345."
                        required
                        maxLength={40}
                      />
                    </div>
                  </div>
                </div>

                {/* ---------------- CARD 3: VISITING SCHEDULE ---------------- */}
                <div className="bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6">
                  <h2 className="text-[18px] leading-[26px] font-semibold text-[#14232B]">
                    Visiting Schedule
                  </h2>
                  <p className="text-[13px] leading-[20px] text-[#5F6F7A] mt-1 mb-5">
                    Consultation days and session timings shown on prescriptions.
                  </p>

                  <div className="space-y-6">
                    {/* Visiting Days Chips */}
                    <DayChipGroup
                      label="Visiting days"
                      selectedDays={formData.visitingDays}
                      onChange={(days) => handleChange("visitingDays", days)}
                      error={touched.visitingDays ? errors.visitingDays : ""}
                      required
                    />

                    {/* Visiting Hours Rows */}
                    <div>
                      <label className="text-[14px] leading-[20px] font-medium text-[#14232B] flex items-center mb-2">
                        Visiting hours <span className="text-[#B42318] ml-1">*</span>
                      </label>

                      <div className="space-y-3">
                        {formData.visitingSessions.map((session, idx) => (
                          <div key={idx} className="flex items-center gap-3 flex-wrap">
                            <div className="w-[160px]">
                              <SelectInput
                                options={TIME_SLOTS}
                                value={session.from}
                                onChange={(e) => updateSession(idx, "from", e.target.value)}
                              />
                            </div>

                            <span className="text-[14px] text-[#3F4F5A] px-1">to</span>

                            <div className="w-[160px]">
                              <SelectInput
                                options={TIME_SLOTS}
                                value={session.to}
                                onChange={(e) => updateSession(idx, "to", e.target.value)}
                              />
                            </div>

                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => removeSession(idx)}
                                className="h-[36px] px-2 text-[13px] font-semibold text-[#B42318] hover:bg-[#FDECEA] rounded flex items-center gap-1 focus:outline-none"
                              >
                                <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>
                        ))}

                        {formData.visitingSessions.length < 2 && (
                          <button
                            type="button"
                            onClick={addSession}
                            className="text-[13px] font-semibold text-[#0F5A78] hover:text-[#0B475F] underline flex items-center gap-1 mt-2 focus:outline-none"
                          >
                            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                            <span>Add another session</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-3 pt-2">
                  <Button
                    variant="secondary"
                    onClick={handleCancelClick}
                    disabled={isSaving}
                    className="w-full md:w-auto"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    loadingText="Saving…"
                    className="w-full md:w-auto min-w-[160px]"
                  >
                    Save Chamber
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Discard Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showDiscardDialog}
            title="Discard this chamber?"
            body="The details you entered won’t be saved."
            cancelLabel="Keep Editing"
            confirmLabel="Discard"
            onCancel={() => setShowDiscardDialog(false)}
            onConfirm={() => {
              setShowDiscardDialog(false);
              navigate("/dashboard");
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default CreateChamberPage;
