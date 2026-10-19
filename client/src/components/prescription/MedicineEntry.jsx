/**
 * MedicineEntry.jsx
 *
 * Implements Design Spec §12.6:
 * - Repeatable medicine entry
 * - Renumbering
 * - Route options & Frequency suggestions
 * - Tab order: name → strength → dose → route → frequency → duration → instructions → Remove
 */

import React, { useState, useRef, useEffect } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import TextInput from "../ui/TextInput";
import SelectInput from "../ui/SelectInput";
import TextareaInput from "../ui/TextareaInput";

const ROUTE_OPTIONS = [
  "Oral",
  "Sublingual",
  "Topical",
  "Intramuscular (IM)",
  "Intravenous (IV)",
  "Subcutaneous (SC)",
  "Inhalation",
  "Nasal",
  "Ophthalmic",
  "Otic",
  "Rectal",
  "Other",
];

const FREQUENCY_SUGGESTIONS = [
  "Once daily (OD)",
  "Twice daily (BD)",
  "Thrice daily (TDS)",
  "Four times daily (QID)",
  "At bedtime (HS)",
  "As needed (SOS)",
  "Every 8 hours",
  "1-0-1",
  "1-1-1",
  "1-0-0",
  "0-0-1",
];

const MedicineEntry = ({
  index,
  medicine,
  totalMedicines,
  onChange,
  onRemove,
  error,
}) => {
  const [freqOpen, setFreqOpen] = useState(false);
  const freqRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (freqRef.current && !freqRef.current.contains(e.target)) {
        setFreqOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleKeyDownNoSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full p-4 rounded-[6px] bg-[#F4F6F8] border border-[#D5DDE3] transition-colors duration-120">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] leading-[20px] font-semibold text-[#14232B]">
          Medicine {index + 1}
        </h3>

        {totalMedicines > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="h-[36px] px-2.5 rounded-[6px] text-[13px] leading-[20px] font-semibold text-[#3F4F5A]
                       hover:text-[#B42318] hover:bg-[#FDECEA] flex items-center gap-1.5 transition-colors duration-120 focus:outline-none"
            aria-label={`Remove Medicine ${index + 1}`}
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.75} />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
        {/* Row 1: Medicine name (full width) */}
        <div className="md:col-span-2">
          <TextInput
            label="Medicine name"
            placeholder="Medicine name"
            value={medicine.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            onKeyDown={handleKeyDownNoSubmit}
            error={error}
            required
            maxLength={100}
          />
        </div>

        {/* Row 2: Formulation / Strength */}
        <div>
          <TextInput
            label="Formulation / Strength"
            placeholder="For example: Tablet 500 mg"
            value={medicine.formulation || ""}
            onChange={(e) => onChange("formulation", e.target.value)}
            onKeyDown={handleKeyDownNoSubmit}
            maxLength={60}
          />
        </div>

        {/* Row 2: Dose */}
        <div>
          <TextInput
            label="Dose"
            placeholder="For example: 1 tablet"
            value={medicine.dose || ""}
            onChange={(e) => onChange("dose", e.target.value)}
            onKeyDown={handleKeyDownNoSubmit}
            maxLength={30}
          />
        </div>

        {/* Row 3: Route */}
        <div>
          <SelectInput
            label="Route"
            options={ROUTE_OPTIONS}
            value={medicine.route || "Oral"}
            onChange={(e) => onChange("route", e.target.value)}
          />
        </div>

        {/* Row 3: Frequency with suggestions */}
        <div ref={freqRef} className="relative">
          <TextInput
            label="Frequency"
            placeholder="For example: 1-0-1 or TDS"
            value={medicine.frequency || ""}
            onChange={(e) => onChange("frequency", e.target.value)}
            onFocus={() => setFreqOpen(true)}
            onKeyDown={handleKeyDownNoSubmit}
            maxLength={40}
            rightElement={
              <button
                type="button"
                onClick={() => setFreqOpen((prev) => !prev)}
                className="p-1 text-[#5F6F7A] hover:text-[#14232B] focus:outline-none"
                aria-label="Toggle frequency suggestions"
              >
                <ChevronDown className="w-4 h-4" strokeWidth={1.75} />
              </button>
            }
          />

          {freqOpen && (
            <div className="absolute top-[70px] left-0 right-0 z-20 bg-white border border-[#B7C3CC] rounded-[6px] shadow-[0_4px_12px_rgba(20,35,43,0.12)] max-h-48 overflow-y-auto">
              {FREQUENCY_SUGGESTIONS.map((sug) => (
                <div
                  key={sug}
                  onClick={() => {
                    onChange("frequency", sug);
                    setFreqOpen(false);
                  }}
                  className="px-3 py-2 text-[13px] leading-[18px] text-[#14232B] hover:bg-[#E6F0F4] cursor-pointer"
                >
                  {sug}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Row 4: Duration (col 1) & Instructions (col 2) */}
        <div>
          <TextInput
            label="Duration"
            placeholder="For example: 5 days"
            value={medicine.duration || ""}
            onChange={(e) => onChange("duration", e.target.value)}
            onKeyDown={handleKeyDownNoSubmit}
            maxLength={30}
          />
        </div>

        <div>
          <TextareaInput
            label="Additional instructions"
            placeholder="For example: after food"
            value={medicine.additionalInstructions || ""}
            onChange={(e) => onChange("additionalInstructions", e.target.value)}
            onKeyDown={handleKeyDownNoSubmit}
            maxLength={150}
            minHeight="44px"
          />
        </div>
      </div>
    </div>
  );
};

export default MedicineEntry;

