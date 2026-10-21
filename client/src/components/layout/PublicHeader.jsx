

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";

const PublicHeader = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full h-[60px] bg-white border-b border-[#D5DDE3]">
      <div className="max-w-[1200px] h-full mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">

        <div className="flex items-center">
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

          <nav className="hidden md:flex items-center ml-12 gap-2" aria-label="Main Navigation">
            <a
              href="#features"
              className="text-[14px] leading-[20px] font-medium text-[#3F4F5A] px-3 py-2 rounded-[6px] hover:text-[#0F5A78] hover:bg-[#EEF3F6] transition-colors duration-120"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-[14px] leading-[20px] font-medium text-[#3F4F5A] px-3 py-2 rounded-[6px] hover:text-[#0F5A78] hover:bg-[#EEF3F6] transition-colors duration-120"
            >
              How it works
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" size="small">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="small">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="small">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
