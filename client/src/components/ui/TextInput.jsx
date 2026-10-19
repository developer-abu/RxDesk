/**
 * TextInput.jsx
 *
 * Implements Design Spec §6.2.
 */

import React, { useId } from "react";
import { AlertCircle } from "lucide-react";

const TextInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  optional = false,
  error,
  helperText,
  disabled = false,
  readOnly = false,
  type = "text",
  maxLength,
  autoComplete,
  className = "",
  inputClassName = "",
  leftElement,
  rightElement,
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

      <div className="relative w-full flex items-center">
        {leftElement && (
          <div className="absolute left-0 top-0 bottom-0 flex items-center z-10">
            {leftElement}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={`w-full h-[44px] px-3 font-sans text-[14px] md:text-[14px] text-[16px] leading-[20px] text-[#14232B]
                     bg-white border rounded-[6px] transition-colors duration-120 outline-none
                     placeholder:text-[#66757F]
                     hover:not(:disabled):border-[#5F6F7A]
                     focus:not(:disabled):border-[#0F5A78] focus:not(:disabled):ring-3 focus:not(:disabled):ring-[#1B7FB5]/30
                     disabled:bg-[#EEF1F4] disabled:border-[#D5DDE3] disabled:text-[#8A98A3] disabled:cursor-not-allowed
                     ${error ? "border-[#B42318]" : "border-[#7D8D98]"}
                     ${leftElement ? "pl-16" : ""}
                     ${rightElement ? "pr-12" : ""}
                     ${inputClassName}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-2 top-0 bottom-0 flex items-center z-10">
            {rightElement}
          </div>
        )}
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
        <p
          id={helperId}
          className="text-[13px] leading-[18px] font-normal text-[#5F6F7A] mt-0.5"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default TextInput;
