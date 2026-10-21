

import React from "react";
import Spinner from "./Spinner";

const Button = ({
  children,
  variant = "primary",
  size = "standard",
  isLoading = false,
  loadingText,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  type = "button",
  className = "",
  onClick,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  let sizeStyles = "h-[44px] px-5 min-w-[96px] text-[14px] leading-[20px] font-semibold";
  let iconSize = 16;

  if (size === "small") {
    sizeStyles = "h-[36px] px-3.5 min-w-[72px] text-[14px] leading-[20px] font-semibold";
    iconSize = 16;
  } else if (size === "large") {
    sizeStyles = "h-[48px] px-6 min-w-[200px] text-[16px] leading-[24px] font-semibold";
    iconSize = 20;
  }

  let variantStyles = "";
  if (variant === "primary") {
    variantStyles =
      "bg-[#0F5A78] text-white hover:bg-[#0B475F] active:bg-[#083849] disabled:bg-[#D5DDE3] disabled:text-[#7B8A95] border-transparent";
  } else if (variant === "secondary") {
    variantStyles =
      "bg-white text-[#14232B] border border-[#B7C3CC] hover:bg-[#F1F5F8] hover:border-[#7D8D98] active:bg-[#E4EAEE] disabled:bg-[#EEF1F4] disabled:border-[#D5DDE3] disabled:text-[#8A98A3]";
  } else if (variant === "destructive") {
    variantStyles =
      "bg-[#B42318] text-white hover:bg-[#912018] active:bg-[#7A1A13] disabled:bg-[#D5DDE3] disabled:text-[#7B8A95] border-transparent";
  } else if (variant === "text-link") {
    sizeStyles = "h-auto p-0 min-w-0 text-[14px] font-medium underline inline-flex items-center gap-1";
    variantStyles =
      "text-[#0F5A78] hover:text-[#0B475F] active:text-[#083849] bg-transparent border-none disabled:text-[#8A98A3]";
  } else if (variant === "icon-only") {
    sizeStyles = "w-9 h-9 p-0 min-w-0 flex items-center justify-center";
    variantStyles =
      "text-[#3F4F5A] bg-transparent hover:bg-[#EEF3F6] active:bg-[#E4EAEE] disabled:text-[#8A98A3]";
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center gap-2 rounded-[6px] transition-colors duration-120 select-none
                 cursor-pointer disabled:cursor-not-allowed
                 focus-visible:outline-2 focus-visible:outline-[#1B7FB5] focus-visible:outline-offset-2
                 ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size={iconSize} className="shrink-0" />
          <span>{loadingText || "Loading…"}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon size={iconSize} strokeWidth={1.75} className="shrink-0" />
          )}
          {children}
          {Icon && iconPosition === "right" && (
            <Icon size={iconSize} strokeWidth={1.75} className="shrink-0" />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
