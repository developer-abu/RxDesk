

import React, { useEffect, useRef } from "react";
import Button from "./Button";

const ConfirmDialog = ({
  isOpen,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "destructive",
  isLoading = false,
}) => {
  const cancelBtnRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    setTimeout(() => {
      cancelBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-body"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >

      <div
        className="fixed inset-0 bg-[#14232B]/50 transition-opacity duration-120"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-[440px] bg-white rounded-[8px] p-6
                   shadow-[0_12px_32px_rgba(20,35,43,0.18)] border border-[#D5DDE3]
                   flex flex-col focus:outline-none"
      >
        <h2
          id="dialog-title"
          className="text-[18px] leading-[26px] font-semibold text-[#14232B]"
        >
          {title}
        </h2>

        <p
          id="dialog-body"
          className="mt-2 text-[14px] leading-[22px] text-[#3F4F5A]"
        >
          {body}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3 flex-wrap">
          <Button
            ref={cancelBtnRef}
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>

          <Button
            variant={variant}
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="Processing…"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
