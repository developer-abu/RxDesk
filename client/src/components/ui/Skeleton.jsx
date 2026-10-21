

import React from "react";

const Skeleton = ({
  width = "100%",
  height = "20px",
  className = "",
  style = {},
}) => (
  <div
    aria-hidden="true"
    className={`skeleton shrink-0 ${className}`}
    style={{
      width,
      height,
      ...style,
    }}
  />
);

export default Skeleton;
