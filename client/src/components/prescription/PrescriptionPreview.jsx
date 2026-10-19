/**
 * PrescriptionPreview.jsx
 *
 * Implements Design Spec §12.1 & §12.7:
 * - Fluid preview panel with sticky scrolling
 * - Toolbar: "Preview" label, page count badge, "Fit width" / "100%" zoom toggle
 * - Discrete A4 sheets stacked with "Page n of m" captions
 * - Exact responsive scaling (100% at >=1440, 87-100% at 1280-1439, 64-96% at 1024-1279)
 * - Panel footer note for print dialog settings
 */

import React, { useState, useRef, useEffect } from "react";
import A4Sheet from "../print/A4Sheet";
import { paginatePrescription } from "../../utils/printUtils";
import SegmentedControl from "../ui/SegmentedControl";

const PrescriptionPreview = ({
  prescriptionState,
  selectedChamber,
}) => {
  const containerRef = useRef(null);
  const [zoomMode, setZoomMode] = useState("fit"); // "fit" | "100%"
  const [scale, setScale] = useState(1);

  // Paginate into discrete A4 sheets
  const pages = paginatePrescription(prescriptionState, selectedChamber);
  const totalPages = pages.length;

  // Calculate fit width scale based on container width
  useEffect(() => {
    if (zoomMode === "100%") {
      setScale(1);
      return;
    }

    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 48; // minus 24px padding each side
      const targetWidth = 794; // A4 standard width at 96 DPI
      const calculatedScale = Math.min(1, Math.max(0.45, containerWidth / targetWidth));
      setScale(calculatedScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [zoomMode]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#E4EAEE] border border-[#D5DDE3] rounded-[8px] p-4 lg:p-6 flex flex-col overflow-y-auto"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D5DDE3] mb-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-[14px] leading-[20px] font-semibold text-[#14232B]">
            Preview
          </span>
          <span className="text-[13px] leading-[20px] text-[#5F6F7A]">
            {totalPages} {totalPages === 1 ? "page" : "pages"}
          </span>
        </div>

        <div className="w-48">
          <SegmentedControl
            size="small"
            options={[
              { label: "Fit width", value: "fit" },
              { label: "100%", value: "100%" },
            ]}
            value={zoomMode}
            onChange={setZoomMode}
          />
        </div>
      </div>

      {/* Sheets Container */}
      <div
        className={`flex-1 flex flex-col items-center gap-6 ${
          zoomMode === "100%" ? "overflow-x-auto w-full" : ""
        }`}
      >
        {pages.map((page) => (
          <div key={page.pageNumber} className="flex flex-col items-center w-full">
            {/* Sheet Caption */}
            <span className="text-[12px] leading-[16px] text-[#5F6F7A] mb-2 self-start md:self-center">
              Page {page.pageNumber} of {totalPages}
            </span>

            {/* Scaled Sheet Wrapper */}
            <div
              style={{
                width: zoomMode === "100%" ? "794px" : `${794 * scale}px`,
                height: zoomMode === "100%" ? "1123px" : `${1123 * scale}px`,
                position: "relative",
              }}
              className="shrink-0 transition-all duration-120"
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  width: "794px",
                  height: "1123px",
                }}
              >
                <A4Sheet
                  pageNumber={page.pageNumber}
                  totalPages={totalPages}
                  isFirstPage={page.isFirstPage}
                  items={page.items}
                  hasStampSig={page.hasStampSig}
                  chamber={selectedChamber}
                  prescriptionState={prescriptionState}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-8 pt-4 border-t border-[#D5DDE3] text-center shrink-0">
        <p className="text-[13px] leading-[20px] text-[#5F6F7A] max-w-xl mx-auto">
          This preview is approximate. Check page breaks in the print dialog. Choose
          paper size A4, margins Default, and turn off Headers and footers.
        </p>
      </div>
    </div>
  );
};

export default PrescriptionPreview;

