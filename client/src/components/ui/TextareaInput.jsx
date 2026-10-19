/**
 * TextareaInput.jsx
 *
 * Implements Design Spec §6.2:
 * - Auto-grows up to 320px, then scrolls internally
 * - Character counter appears when >= 80% of maxLength is used
 * - Accessible error handling with alert icon
 */

import React, { useEffect, useRef, useId } from "react";
import { AlertCircle } from "lucide-react";

const TextareaInput = ({
  label,
  name,
  value = "",
  onChange,
  onBlur,
  placeholder,
  required = false,
  optional = false,
  error,
  helperText,
  disabled = false,
  maxLength,
  minHeight = "72px",
  className = "",
  ...props
}) => {
  const textareaRef = useRef(null);
  const generatedId = useId();
  const inputId = props.id || name || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  // Auto-grow height calculation up to 320px
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.min(Math.max(el.scrollHeight, parseInt(minHeight, 10) || 72), 320);
    el.style.height = `${nextHeight}px`;
  }, [value, minHeight]);

  const currentLength = value?.length || 0;
  const showCounter = maxLength && currentLength >= maxLength * 0.8;

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

      <textarea
        ref={textareaRef}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        style={{ minHeight }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={`w-full py-2.5 px-3 font-sans text-[14px] md:text-[14px] text-[16px] leading-[20px] text-[#14232B]
                   bg-white border rounded-[6px] transition-colors duration-120 outline-none resize-none
                   placeholder:text-[#66757F]
                   hover:not(:disabled):border-[#5F6F7A]
                   focus:not(:disabled):border-[#0F5A78] focus:not(:disabled):ring-3 focus:not(:disabled):ring-[#1B7FB5]/30
                   disabled:bg-[#EEF1F4] disabled:border-[#D5DDE3] disabled:text-[#8A98A3] disabled:cursor-not-allowed
                   ${error ? "border-[#B42318]" : "border-[#7D8D98]"}`}
        {...props}
      />

      <div className="flex items-start justify-between gap-2 mt-0.5">
        <div className="flex-1">
          {error ? (
            <p
              id={errorId}
              role="alert"
              className="flex items-center gap-1.5 text-[13px] leading-[18px] font-medium text-[#B42318]"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-[#B42318]" strokeWidth={1.75} />
              <span>{error}</span>
            </p>
          ) : helperText ? (
            <p id={helperId} className="text-[13px] leading-[18px] font-normal text-[#5F6F7A]">
              {helperText}
            </p>
          ) : null}
        </div>

        {showCounter && (
          <span className="text-[13px] leading-[18px] text-[#5F6F7A] shrink-0 tabular-nums">
            {currentLength} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default TextareaInput;
