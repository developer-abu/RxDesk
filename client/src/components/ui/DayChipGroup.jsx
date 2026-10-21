

import React, { useId } from "react";
import { Check, AlertCircle } from "lucide-react";

const DAYS = [
  { id: "Mon", label: "Mon" },
  { id: "Tue", label: "Tue" },
  { id: "Wed", label: "Wed" },
  { id: "Thu", label: "Thu" },
  { id: "Fri", label: "Fri" },
  { id: "Sat", label: "Sat" },
  { id: "Sun", label: "Sun" },
];

const DayChipGroup = ({
  label = "Visiting days",
  selectedDays = [],
  onChange,
  required = false,
  error,
  helperText,
  disabled = false,
}) => {
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const errorId = `${generatedId}-error`;

  const toggleDay = (dayId) => {
    if (disabled) return;
    if (selectedDays.includes(dayId)) {
      onChange(selectedDays.filter((d) => d !== dayId));
    } else {
      onChange([...selectedDays, dayId]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <span
          id={labelId}
          className="text-[14px] leading-[20px] font-medium text-[#14232B] flex items-center"
        >
          {label}
          {required && <span className="text-[#B42318] ml-1">*</span>}
        </span>
      )}

      <div
        role="group"
        aria-labelledby={labelId}
        className="flex flex-wrap gap-2 items-center"
      >
        {DAYS.map((day) => {
          const isSelected = selectedDays.includes(day.id);
          return (
            <button
              key={day.id}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => toggleDay(day.id)}
              className={`w-[64px] h-[40px] rounded-[6px] text-[14px] leading-[20px] font-medium select-none
                         flex items-center justify-center gap-1 transition-colors duration-120 border
                         focus-visible:outline-2 focus-visible:outline-[#1B7FB5] focus-visible:outline-offset-2
                         ${
                           isSelected
                             ? "bg-[#E6F0F4] border-[#0F5A78] text-[#0F5A78] font-semibold"
                             : "bg-white border-[#7D8D98] text-[#14232B] hover:border-[#5F6F7A] hover:bg-[#F4F6F8]"
                         }
                         ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isSelected && (
                <Check className="w-3.5 h-3.5 text-[#0F5A78] shrink-0" strokeWidth={2.5} />
              )}
              <span>{day.label}</span>
            </button>
          );
        })}
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-[13px] leading-[18px] font-medium text-[#B42318] mt-0.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-[#B42318]" strokeWidth={1.75} />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-[13px] leading-[18px] font-normal text-[#5F6F7A] mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default DayChipGroup;
