/**
 * SegmentedControl.jsx
 *
 * Implements Design Spec §6.4:
 * - Height 44px, equal segments divided by 1px #B7C3CC lines
 * - Selected segment: fill #E6F0F4, text #0F5A78 600, 14px check icon
 * - Accessible as a radio group with keyboard navigation
 */

import React, { useId } from "react";
import { Check, AlertCircle } from "lucide-react";

const SegmentedControl = ({
  label,
  options = [], // [{ label: "Male", value: "Male" }, ...] or string[]
  value,
  onChange,
  required = false,
  optional = false,
  error,
  className = "",
  size = "standard", // "standard" (44px) | "small" (36px)
}) => {
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const errorId = `${generatedId}-error`;

  const heightClass = size === "small" ? "h-[36px]" : "h-[44px]";

  const normalizedOptions = options.map((opt) =>
    typeof opt === "object" ? opt : { label: opt, value: opt }
  );

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span
          id={labelId}
          className="text-[14px] leading-[20px] font-medium text-[#14232B] flex items-center"
        >
          {label}
          {required && <span className="text-[#B42318] ml-1">*</span>}
          {optional && (
            <span className="text-[13px] font-normal text-[#5F6F7A] ml-1">
              (optional)
            </span>
          )}
        </span>
      )}

      <div
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full flex ${heightClass} border rounded-[6px] overflow-hidden bg-white
                   ${error ? "border-[#B42318]" : "border-[#7D8D98]"}`}
      >
        {normalizedOptions.map((opt, idx) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(opt.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 text-[14px] leading-[20px] select-none
                         transition-colors duration-120 outline-none
                         focus-visible:ring-2 focus-visible:ring-[#1B7FB5] focus-visible:z-10
                         ${idx > 0 ? "border-l border-[#B7C3CC]" : ""}
                         ${
                           isSelected
                             ? "bg-[#E6F0F4] text-[#0F5A78] font-semibold"
                             : "bg-white text-[#14232B] font-normal hover:bg-[#F4F6F8]"
                         }`}
            >
              {isSelected && (
                <Check className="w-3.5 h-3.5 text-[#0F5A78] shrink-0" strokeWidth={2.5} />
              )}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-[13px] leading-[18px] font-medium text-[#B42318] mt-0.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-[#B42318]" strokeWidth={1.75} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default SegmentedControl;
