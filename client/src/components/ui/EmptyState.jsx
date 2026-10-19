/**
 * EmptyState.jsx
 *
 * Implements Design Spec §6.5 with arrow function.
 */

import React from "react";
import Button from "./Button";

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => (
  <div
    className={`w-full p-10 border border-dashed border-[#B7C3CC] rounded-[8px] bg-white
               flex flex-col items-center justify-center text-center ${className}`}
  >
    <h3 className="text-[16px] leading-[24px] font-semibold text-[#14232B]">
      {title}
    </h3>

    <p className="mt-2 max-w-[420px] text-[14px] leading-[22px] text-[#3F4F5A]">
      {description}
    </p>

    {actionLabel && onAction && (
      <div className="mt-4">
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    )}
  </div>
);

export default EmptyState;
