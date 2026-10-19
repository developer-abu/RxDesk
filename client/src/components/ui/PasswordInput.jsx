/**
 * PasswordInput.jsx
 *
 * Implements Design Spec §6.2 (Password field with Show/Hide toggle and optional rules checklist).
 */

import React, { useState } from "react";
import TextInput from "./TextInput";
import { CheckCircle2, XCircle, Circle } from "lucide-react";

const PasswordInput = ({
  label,
  name,
  value = "",
  onChange,
  onBlur,
  error,
  helperText,
  required = true,
  showRulesChecklist = false,
  rulesChecklistTouched = false,
  labelRight,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Validation rules
  const hasMinLength = value.length >= 8;
  const hasUpperAndLower = /[A-Z]/.test(value) && /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);

  const rules = [
    { label: "At least 8 characters", met: hasMinLength },
    { label: "One uppercase and one lowercase letter", met: hasUpperAndLower },
    { label: "One number", met: hasNumber },
  ];

  const rightToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="px-2 py-1 h-[36px] flex items-center justify-center text-[13px] font-semibold text-[#0F5A78] hover:text-[#0B475F] focus:outline-none"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label className="text-[14px] leading-[20px] font-medium text-[#14232B]">
            {label}
            {required && <span className="text-[#B42318] ml-1">*</span>}
          </label>
        )}
        {labelRight}
      </div>

      <TextInput
        {...props}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        required={false} // Handled in custom label above
        label=""
        inputClassName="pr-[64px]"
        rightElement={rightToggle}
      />

      {showRulesChecklist && (
        <div className="mt-2 space-y-1.5" aria-live="polite">
          {rules.map((rule, idx) => {
            let Icon = Circle;
            let iconColor = "text-[#7D8D98]";
            let textColor = "text-[#5F6F7A]";
            let statusText = "not met";

            if (rule.met) {
              Icon = CheckCircle2;
              iconColor = "text-[#1E7B4F]";
              textColor = "text-[#1E7B4F]";
              statusText = "met";
            } else if (rulesChecklistTouched) {
              Icon = XCircle;
              iconColor = "text-[#B42318]";
              textColor = "text-[#B42318]";
              statusText = "failed";
            }

            return (
              <div key={idx} className="flex items-center gap-2 text-[13px] leading-[18px]">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} strokeWidth={2} />
                <span className={textColor}>
                  {rule.label} <span className="sr-only">({statusText})</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
