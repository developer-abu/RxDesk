/**
 * NoticeBanner.jsx
 *
 * Implements Design Spec §6.5:
 * - Padding 12px 16px, 6px radius, state background and border
 * - 20px icon, 14/22 text in #14232B
 * - Types: info, success, warning, error
 * - Accessibility: role="alert" for error/success; static for info
 */

import React from "react";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";

const NoticeBanner = ({
  type = "info",
  title,
  children,
  onClose,
  className = "",
  action,
}) => {
  const map = {
    info: {
      bg: "bg-[#EAF3F8]",
      border: "border-[#BFD8E6]",
      iconColor: "text-[#0F5A78]",
      icon: Info,
      role: "status",
    },
    success: {
      bg: "bg-[#E7F4EC]",
      border: "border-[#A9D6BC]",
      iconColor: "text-[#1E7B4F]",
      icon: CheckCircle2,
      role: "alert",
    },
    warning: {
      bg: "bg-[#FFF4DB]",
      border: "border-[#E8C873]",
      iconColor: "text-[#8A5A00]",
      icon: AlertTriangle,
      role: "alert",
    },
    error: {
      bg: "bg-[#FDECEA]",
      border: "border-[#F2B8B3]",
      iconColor: "text-[#B42318]",
      icon: AlertCircle,
      role: "alert",
    },
  };

  const current = map[type] || map.info;
  const IconComponent = current.icon;

  return (
    <div
      role={current.role}
      className={`w-full p-3 md:px-4 md:py-3 rounded-[6px] border ${current.bg} ${current.border}
                 flex items-start gap-3 transition-colors duration-120 ${className}`}
    >
      <IconComponent
        className={`w-5 h-5 shrink-0 mt-0.5 ${current.iconColor}`}
        strokeWidth={1.75}
      />

      <div className="flex-1 min-w-0 text-[14px] leading-[22px] text-[#14232B]">
        {title && <span className="font-semibold mr-1.5">{title}</span>}
        {children}
        {action && <div className="mt-2">{action}</div>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss banner"
          className="shrink-0 -mr-1 -mt-0.5 w-6 h-6 flex items-center justify-center rounded text-[#5F6F7A] hover:text-[#14232B] focus:outline-none"
        >
          <X className="w-4 h-4" strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
};

export default NoticeBanner;
