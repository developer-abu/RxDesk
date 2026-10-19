/**
 * SelectInput.jsx
 *
 * Implements Design Spec §6.2 (Native select with custom chevron).
 */

import React, { useId } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [], // [{ label, value }] or strings
  placeholder,
  required = false,
  optional = false,
  error,
  helperText,
  disabled = false,
  className = "",
  selectClassName = "",
  ...props
}) => {
  const generatedId = useId();
  const inputId = props.id || name || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[14px] leading-[20px] font-medium text-[#14232B] flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-[#B42318] ml-1">*</span>}
            {optional && (
              <span className="text-[13px] font-normal text-[#5F6F7A] ml-1">
                (optional)
              </span>
            )}
          </span>
        </label>
      )}

      <div className="relative w-full">
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full h-[44px] pl-3 pr-10 font-sans text-[14px] md:text-[14px] text-[16px] leading-[20px] text-[#14232B]
                     bg-white border rounded-[6px] transition-colors duration-120 outline-none appearance-none cursor-pointer
                     hover:not(:disabled):border-[#5F6F7A]
                     focus:not(:disabled):border-[#0F5A78] focus:not(:disabled):ring-3 focus:not(:disabled):ring-[#1B7FB5]/30
                     disabled:bg-[#EEF1F4] disabled:border-[#D5DDE3] disabled:text-[#8A98A3] disabled:cursor-not-allowed
                     ${error ? "border-[#B42318]" : "border-[#7D8D98]"}
                     ${selectClassName}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === "object" ? opt.value : opt;
            const text = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {text}
              </option>
            );
          })}
        </select>

        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6F7A] pointer-events-none"
          strokeWidth={1.75}
        />
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
        <p id={helperId} className="text-[13px] leading-[18px] font-normal text-[#5F6F7A] mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default SelectInput;
