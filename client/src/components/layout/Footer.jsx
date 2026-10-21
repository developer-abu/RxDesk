

import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#F4F6F8] border-t border-[#D5DDE3] pt-12 pb-6">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-[6px] bg-[#0F5A78] flex items-center justify-center text-white text-[13px] font-bold select-none">
                ℞
              </div>
              <span className="text-[18px] leading-[24px] font-semibold text-[#14232B]">
                RxDesk
              </span>
            </Link>
            <p className="max-w-[320px] text-[14px] leading-[22px] text-[#3F4F5A]">
              A prescription-formatting utility for doctors. RxDesk does not verify
              medical registration or provide clinical advice.
            </p>
          </div>

          <div>
            <h4 className="text-[14px] leading-[20px] font-semibold text-[#14232B] mb-3">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-[14px] leading-[22px] text-[#0F5A78] hover:text-[#0B475F] underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-[14px] leading-[22px] text-[#0F5A78] hover:text-[#0B475F] underline"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[14px] leading-[20px] font-semibold text-[#14232B] mb-3">
              Contact
            </h4>
            <div className="space-y-1 text-[14px] leading-[22px] text-[#3F4F5A]">
              <p>support@rxdesk.local</p>
              <p>Mon – Sat · 9:00 AM – 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#D5DDE3] flex items-center justify-between text-[13px] leading-[20px] text-[#5F6F7A]">
          <span>© 2026 RxDesk. All rights reserved.</span>
          <span>Version 1.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

