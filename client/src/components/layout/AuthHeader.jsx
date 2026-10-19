/**
 * AuthHeader.jsx
 *
 * Implements Design Spec §6.6 with arrow function.
 */

import React from "react";
import { Link } from "react-router-dom";

const AuthHeader = ({
  prompt = "Already registered?",
  linkText = "Log in",
  linkTo = "/login",
}) => (
  <header className="w-full h-[60px] bg-white border-b border-[#D5DDE3]">
    <div className="max-w-[1200px] h-full mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
      <Link
        to="/"
        className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-[#1B7FB5] rounded"
      >
        <div className="w-7 h-7 rounded-[6px] bg-[#0F5A78] flex items-center justify-center text-white text-[13px] font-bold select-none">
          ℞
        </div>
        <span className="text-[18px] leading-[24px] font-semibold text-[#14232B]">
          RxDesk
        </span>
      </Link>

      <div className="text-[14px] leading-[22px] text-[#3F4F5A] flex items-center gap-1.5">
        <span>{prompt}</span>
        <Link
          to={linkTo}
          className="font-medium text-[#0F5A78] hover:text-[#0B475F] underline focus-visible:outline-2 focus-visible:outline-[#1B7FB5] rounded"
        >
          {linkText}
        </Link>
      </div>
    </div>
  </header>
);

export default AuthHeader;
