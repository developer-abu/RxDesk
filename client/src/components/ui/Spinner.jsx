

import React from "react";

const Spinner = ({ size = 16, className = "", label = "Loading…" }) => {
  const px = `${size}px`;
  const stroke = size <= 16 ? "2px" : "2px";

  return (
    <span
      role="status"
      aria-label={label}
      className={`spinner inline-block ${className}`}
      style={{
        width: px,
        height: px,
        borderWidth: stroke,
        flexShrink: 0,
      }}
    />
  );
};

export default Spinner;
