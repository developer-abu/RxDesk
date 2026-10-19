/**
 * AppHeader.jsx
 *
 * Implements Design Spec §6.6 and §10.1:
 * - 60px non-sticky header for signed-in pages (Dashboard, Create Chamber, Create Prescription)
 * - Navigation links with 2px bottom line active indicator
 * - Doctor name truncated at 200px with tooltip
 * - Log out button (secondary small)
 * - Mobile responsive collapsible menu panel below 768px
 */

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Button from "../ui/Button";
import { Menu, X } from "lucide-react";

const AppHeader = () => {
  const { doctor, logout } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Create Chamber", path: "/chambers/new" },
    { label: "Create Prescription", path: "/prescriptions/new" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      addToast({
        type: "info",
        message: "You have been logged out.",
      });
      navigate("/login");
    } catch {
      navigate("/login");
    }
  };

  const doctorDisplayName = doctor?.fullName ? `Dr. ${doctor.fullName.replace(/^Dr\.\s*/i, "")}` : "Doctor";

  return (
    <header className="relative w-full h-[60px] bg-white border-b border-[#D5DDE3] z-30">
      <div className="max-w-[1440px] h-full mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo & Desktop Navigation */}
        <div className="flex items-center h-full">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 mr-12 group focus-visible:outline-2 focus-visible:outline-[#1B7FB5] rounded"
          >
            <div className="w-7 h-7 rounded-[6px] bg-[#0F5A78] flex items-center justify-center text-white text-[13px] font-bold select-none">
              ℞
            </div>
            <span className="text-[18px] leading-[24px] font-semibold text-[#14232B]">
              RxDesk
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center h-full gap-2" aria-label="App Navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center h-full px-3 text-[14px] leading-[20px] transition-colors duration-120
                             ${
                               isActive
                                 ? "text-[#0F5A78] font-semibold"
                                 : "text-[#3F4F5A] font-medium hover:bg-[#EEF3F6]"
                             }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0F5A78]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Doctor Info + Logout (Desktop) */}
        <div className="hidden md:flex items-center">
          <span
            title={doctorDisplayName}
            className="text-[14px] leading-[20px] font-medium text-[#14232B] truncate max-w-[200px]"
          >
            {doctorDisplayName}
          </span>

          <div className="w-[1px] h-6 bg-[#D5DDE3] mx-4" aria-hidden="true" />

          <Button variant="secondary" size="small" onClick={handleLogout}>
            Log out
          </Button>
        </div>

        {/* Mobile Menu Button (<768px) */}
        <div className="flex md:hidden items-center">
          <Button
            variant="secondary"
            size="small"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 mr-1.5" strokeWidth={1.75} />
            ) : (
              <Menu className="w-4 h-4 mr-1.5" strokeWidth={1.75} />
            )}
            <span>Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel (<768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[60px] left-0 right-0 bg-white border-b border-[#D5DDE3] shadow-[0_4px_12px_rgba(20,35,43,0.12)] flex flex-col z-40">
          <div className="px-4 py-3 bg-[#F4F6F8] border-b border-[#D5DDE3] text-[14px] font-medium text-[#14232B] truncate">
            {doctorDisplayName}
          </div>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`h-12 px-4 flex items-center border-b border-[#D5DDE3] text-[14px] transition-colors duration-120
                           ${
                             isActive
                               ? "bg-[#E6F0F4] text-[#0F5A78] font-semibold"
                               : "text-[#14232B] hover:bg-[#F4F6F8]"
                           }`}
              >
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="h-12 px-4 flex items-center text-[14px] font-semibold text-[#B42318] hover:bg-[#FDECEA] transition-colors duration-120 text-left"
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
};

export default AppHeader;

