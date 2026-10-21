

import React, { useState, useRef, useEffect, useId } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Check, AlertCircle, AlertTriangle } from "lucide-react";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";

const ChamberDropdown = ({
  chambers = [],
  selectedChamberId,
  onSelectChamber,
  isLoading = false,
  loadError = null,
  onRetry,
  error,
  required = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const listboxId = useId();

  const sortedChambers = [...chambers].sort((a, b) =>
    (a.chamberName || "").localeCompare(b.chamberName || "")
  );

  const selectedChamber = sortedChambers.find((c) => c._id === selectedChamberId);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleKeyDown = (e) => {
    if (isLoading || loadError || sortedChambers.length === 0) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (highlightedIndex >= 0 && sortedChambers[highlightedIndex]) {
        onSelectChamber(sortedChambers[highlightedIndex]._id);
        setIsOpen(false);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) => (prev < sortedChambers.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : sortedChambers.length - 1));
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="w-full flex flex-col gap-1.5 relative">
      <div className="flex items-center justify-between">
        <label
          id={`${listboxId}-label`}
          className="text-[14px] leading-[20px] font-medium text-[#14232B] flex items-center"
        >
          Chamber
          {required && <span className="text-[#B42318] ml-1">*</span>}
        </label>
        <span className="text-[13px] leading-[20px] text-[#5F6F7A]">
          * Required field
        </span>
      </div>

      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={`${listboxId}-label`}
        disabled={isLoading || Boolean(loadError) || sortedChambers.length === 0}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`w-full h-[44px] px-3 font-sans text-[14px] leading-[20px] text-left
                   bg-white border rounded-[6px] transition-colors duration-120 flex items-center justify-between
                   focus:outline-none focus:border-[#0F5A78] focus:ring-3 focus:ring-[#1B7FB5]/30
                   disabled:bg-[#EEF1F4] disabled:border-[#D5DDE3] disabled:cursor-not-allowed
                   ${error ? "border-[#B42318]" : "border-[#7D8D98]"}
                   ${isOpen ? "border-[#0F5A78] ring-3 ring-[#1B7FB5]/30" : ""}`}
      >
        <span className="truncate">
          {isLoading ? (
            <span className="flex items-center gap-2 text-[#5F6F7A]">
              <Spinner size={16} />
              <span>Loading chambers…</span>
            </span>
          ) : sortedChambers.length === 0 ? (
            <span className="text-[#66757F]">No chambers saved</span>
          ) : selectedChamber ? (
            <span className="text-[#14232B] font-medium">{selectedChamber.chamberName}</span>
          ) : (
            <span className="text-[#66757F]">Select a chamber</span>
          )}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-[#5F6F7A] shrink-0 transition-transform duration-120 ${
            isOpen ? "rotate-180" : ""
          }`}
          strokeWidth={1.75}
        />
      </button>

      <p className="text-[13px] leading-[18px] text-[#5F6F7A] mt-0.5">
        Chamber details appear on the prescription automatically.
      </p>

      {error && (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-[13px] leading-[18px] font-medium text-[#B42318] mt-0.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-[#B42318]" strokeWidth={1.75} />
          <span>{error}</span>
        </p>
      )}

      {loadError && (
        <div className="flex items-center gap-2 text-[13px] leading-[18px] text-[#B42318] mt-1">
          <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span>We couldn't load your chambers.</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="font-semibold text-[#0F5A78] underline hover:text-[#0B475F]"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {!isLoading && !loadError && sortedChambers.length === 0 && (
        <div className="mt-2 p-3 bg-[#FFF4DB] border border-[#E8C873] rounded-[6px] flex flex-col gap-2">
          <div className="flex items-start gap-2 text-[13px] leading-[18px] text-[#8A5A00]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} />
            <span>
              You haven't created a chamber yet. A chamber supplies the doctor and
              address details printed on the prescription.
            </span>
          </div>
          <div className="self-start">
            <Link to="/chambers/new">
              <Button variant="secondary" size="small">
                Create Chamber
              </Button>
            </Link>
          </div>
        </div>
      )}

      {isOpen && sortedChambers.length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${listboxId}-label`}
          className="absolute top-[70px] left-0 right-0 z-50 bg-white border border-[#B7C3CC] rounded-[6px]
                     shadow-[0_4px_12px_rgba(20,35,43,0.12)] max-h-[280px] overflow-y-auto"
        >
          {sortedChambers.map((chamber, idx) => {
            const isSelected = chamber._id === selectedChamberId;
            const isHighlighted = idx === highlightedIndex;

            return (
              <div
                key={chamber._id}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelectChamber(chamber._id);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`h-10 px-3 flex items-center justify-between text-[14px] leading-[20px] cursor-pointer select-none
                           ${
                             isHighlighted
                               ? "bg-[#E6F0F4]"
                               : isSelected
                               ? "bg-[#E6F0F4]/50"
                               : "bg-white hover:bg-[#E6F0F4]"
                           }
                           ${isSelected ? "font-semibold text-[#14232B]" : "font-normal text-[#14232B]"}`}
              >
                <span className="truncate">{chamber.chamberName}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#0F5A78] shrink-0 ml-2" strokeWidth={2} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChamberDropdown;
