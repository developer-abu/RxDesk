/**
 * ToastContext.jsx
 *
 * Centralized Toast notification system with arrow functions.
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ToastItem = ({ toast, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const styleMap = {
    success: {
      bg: "bg-[#E7F4EC]",
      border: "border-[#A9D6BC]",
      text: "text-[#1E7B4F]",
      icon: CheckCircle2,
    },
    error: {
      bg: "bg-[#FDECEA]",
      border: "border-[#F2B8B3]",
      text: "text-[#B42318]",
      icon: AlertCircle,
    },
    warning: {
      bg: "bg-[#FFF4DB]",
      border: "border-[#E8C873]",
      text: "text-[#8A5A00]",
      icon: AlertCircle,
    },
    info: {
      bg: "bg-[#EAF3F8]",
      border: "border-[#BFD8E6]",
      text: "text-[#0F5A78]",
      icon: Info,
    },
  };

  const currentStyle = styleMap[toast.type] || styleMap.info;
  const IconComponent = currentStyle.icon;

  useEffect(() => {
    if (toast.autoDismiss <= 0 || isHovered) return;

    timerRef.current = setTimeout(() => {
      onRemove();
    }, toast.autoDismiss);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.autoDismiss, isHovered, onRemove]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={toast.type === "error" ? "alert" : "status"}
      className={`pointer-events-auto flex items-start gap-3 w-full max-w-[360px] p-3 md:px-4 md:py-3
                  rounded-[6px] border ${currentStyle.bg} ${currentStyle.border} shadow-[0_4px_12px_rgba(20,35,43,0.16)]
                  transition-all duration-120 toast-enter`}
    >
      <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${currentStyle.text}`} strokeWidth={1.75} />

      <div className="flex-1 min-w-0">
        <p className="text-[14px] leading-[22px] text-[#14232B] break-words">
          {toast.message}
        </p>
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action.onClick();
              onRemove();
            }}
            className="mt-1 text-[13px] font-semibold text-[#0F5A78] hover:text-[#0B475F] underline focus:outline-none"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label="Close notification"
        className="w-7 h-7 shrink-0 -mr-1 -mt-0.5 flex items-center justify-center rounded text-[#5F6F7A] hover:text-[#14232B] hover:bg-black/5 focus:outline-none"
      >
        <X className="w-4 h-4" strokeWidth={1.75} />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none flex flex-col gap-2 transition-all duration-120
                 top-[68px] left-4 right-4 items-center
                 md:top-[72px] md:left-auto md:right-6 md:items-end"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => onRemove(toast.id)} />
      ))}
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = "info", message, action, duration }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 6);
      const autoDismiss = duration !== undefined ? duration : type === "error" ? 0 : 5000;

      const newToast = {
        id,
        type,
        message,
        action,
        autoDismiss,
        remainingTime: autoDismiss,
        startTime: Date.now(),
      };

      setToasts((prev) => [newToast, ...prev].slice(0, 3));
      return id;
    },
    []
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
