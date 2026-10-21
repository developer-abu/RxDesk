

import React, { useState, useRef, useEffect } from "react";
import A4Sheet from "../print/A4Sheet";
import { paginatePrescription } from "../../utils/printUtils";
import SegmentedControl from "../ui/SegmentedControl";

const PrescriptionPreview = ({
  prescriptionState,
  selectedChamber,
}) => {
  const containerRef = useRef(null);
  const [zoomMode, setZoomMode] = useState("fit");
  const [scale, setScale] = useState(1);

  const pages = paginatePrescription(prescriptionState);
  const totalPages = pages.length;

  const displayScale = zoomMode === "100%" ? 1 : scale;

  useEffect(() => {
    if (zoomMode === "100%" || !containerRef.current) return;

    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 48;
      const targetWidth = 794;
      const calculatedScale = Math.min(1, Math.max(0.45, containerWidth / targetWidth));
      setScale(calculatedScale);
    };

    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    window.addEventListener("resize", updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [zoomMode]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#E4EAEE] border border-[#D5DDE3] rounded-[8px] p-4 lg:p-6 flex flex-col overflow-y-auto"
    >

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

      <div
        className={`flex-1 flex flex-col items-center gap-6 ${
          zoomMode === "100%" ? "overflow-x-auto w-full" : ""
        }`}
      >
        {pages.map((page) => (
          <div key={page.pageNumber} className="flex flex-col items-center w-full">

            <span className="text-[12px] leading-[16px] text-[#5F6F7A] mb-2 self-start md:self-center">
              Page {page.pageNumber} of {totalPages}
            </span>

            <div
              style={{
                width: `${794 * displayScale}px`,
                height: `${1123 * displayScale}px`,
                position: "relative",
              }}
              className="shrink-0 transition-all duration-120"
            >
              <div
                style={{
                  transform: `scale(${displayScale})`,
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
