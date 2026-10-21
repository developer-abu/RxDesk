

import React from "react";
import { formatAgeSex, formatDate, abbreviateRoute, formatVisitingLine } from "../../utils/formatUtils";

const A4Sheet = ({
  pageNumber,
  totalPages,
  isFirstPage,
  items = [],
  hasStampSig,
  chamber,
  prescriptionState,
}) => {
  const {
    patientName,
    age,
    ageUnit,
    sex,
    consultationDate,
  } = prescriptionState;

  const doctorName = chamber?.doctorName || "Doctor Name";
  const qualifications = chamber?.qualifications || "";
  const regNo = chamber?.registrationNo || "";
  const chamberName = chamber?.chamberName || "";
  const address = chamber?.address || "";
  const contactNumber = chamber?.contactNumber || "";
  const visitingLine = formatVisitingLine(
    chamber?.visitingDays,
    chamber?.visitingSessions || chamber?.visitingHours
  );

  const formattedDate = formatDate(consultationDate);
  const formattedAgeSex = formatAgeSex(age, ageUnit, sex);

  const medicineItems = items.filter((it) => it.type === "medicine");
  const hasMedicines = medicineItems.length > 0;

  return (
    <div className="a4-sheet bg-white border border-[#B7C3CC] shadow-[0_1px_2px_rgba(20,35,43,0.04)] print:shadow-none print:border-none flex flex-col justify-between relative select-none">
      <div>

        {isFirstPage ? (
          <div>

            <div className="flex justify-between items-start gap-4">

              <div className="w-[378px] shrink-0">
                <h1 className="print-doctor-name text-[22px] leading-[26px] font-bold text-black font-serif">
                  {doctorName}
                </h1>
                {qualifications && (
                  <p className="print-qualifications text-[13px] leading-[18px] text-black mt-1">
                    {qualifications}
                  </p>
                )}
                {regNo && (
                  <p className="print-reg-no text-[13px] leading-[18px] font-semibold text-black mt-0.5">
                    Reg. No.: {regNo}
                  </p>
                )}
              </div>

              <div className="w-[283px] shrink-0 text-left">
                {chamberName ? (
                  <>
                    <h2 className="print-chamber-name text-[14px] leading-[18px] font-bold tracking-[0.04em] uppercase text-black">
                      {chamberName}
                    </h2>
                    {address && (
                      <p className="print-address text-[12.5px] leading-[17px] text-black mt-1 whitespace-pre-line">
                        {address}
                      </p>
                    )}
                    {contactNumber && (
                      <p className="print-address text-[12.5px] leading-[17px] text-black mt-0.5">
                        Phone: {contactNumber}
                      </p>
                    )}
                    {visitingLine && (
                      <p className="print-address text-[12.5px] leading-[17px] text-black mt-0.5">
                        Visiting: {visitingLine}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="h-16 border border-dashed border-[#B7C3CC] flex items-center justify-center p-2 text-center print:hidden">
                    <span className="text-[12px] text-[#5F6F7A]">
                      Select a chamber to show doctor and chamber details
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full h-[2px] bg-black my-2.5" />

            <div className="flex items-center justify-between pb-2 border-b border-black text-[14px] leading-[18px]">

              <div className="flex-1 pr-4">
                <span className="print-label text-[11px] font-bold uppercase tracking-[0.04em] text-black block mb-0.5">
                  PATIENT NAME
                </span>
                <span className="print-patient-value font-medium text-black">
                  {patientName || "________________________"}
                </span>
              </div>

              <div className="w-[150px] shrink-0 pr-4">
                <span className="print-label text-[11px] font-bold uppercase tracking-[0.04em] text-black block mb-0.5">
                  AGE / SEX
                </span>
                <span className="print-patient-value font-medium text-black">
                  {formattedAgeSex || "___________"}
                </span>
              </div>

              <div className="w-[120px] shrink-0">
                <span className="print-label text-[11px] font-bold uppercase tracking-[0.04em] text-black block mb-0.5">
                  DATE
                </span>
                <span className="print-patient-value font-medium text-black">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        ) : (

          <div className="pb-2 mb-4 border-b border-black flex items-center justify-between text-[12px] font-semibold text-black">
            <span>
              {doctorName} {regNo ? `· Reg. No. ${regNo}` : ""}
            </span>
            <span>
              Patient: {patientName || "—"} · {formattedDate}
            </span>
          </div>
        )}

        <div className="mt-4 space-y-4">

          {items
            .filter((it) => it.type === "clinical")
            .map((it, idx) => (
              <div key={idx} className="flex items-start text-black">
                <div className="w-[128px] shrink-0 print-label text-[11px] leading-[15px] font-bold tracking-[0.04em] uppercase">
                  {it.label}
                </div>
                <div className="flex-1 print-clinical-text text-[13.5px] leading-[19px] whitespace-pre-wrap">
                  {it.text}
                </div>
              </div>
            ))}

          {hasMedicines && (
            <div className="mt-4">
              <div className="print-rx-glyph text-[24px] font-bold font-serif mb-1 leading-none text-black">
                ℞
              </div>

              <table className="print-table w-full border-collapse text-left">
                <thead>
                  <tr className="border-t border-b border-black">
                    <th className="py-1 text-[11px] font-bold uppercase tracking-[0.04em] w-[30px]">No.</th>
                    <th className="py-1 text-[11px] font-bold uppercase tracking-[0.04em]">Medicine</th>
                    <th className="py-1 text-[11px] font-bold uppercase tracking-[0.04em] w-[75px]">Dose</th>
                    <th className="py-1 text-[11px] font-bold uppercase tracking-[0.04em] w-[65px]">Route</th>
                    <th className="py-1 text-[11px] font-bold uppercase tracking-[0.04em] w-[120px]">Frequency</th>
                    <th className="py-1 text-[11px] font-bold uppercase tracking-[0.04em] w-[100px]">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {medicineItems.map((it) => (
                    <tr key={it.medicine.id || it.index} className="border-b border-[#666666]/40">
                      <td className="py-1.5 align-top text-[13px] text-black">{it.index}</td>
                      <td className="py-1.5 align-top text-black">
                        <div>
                          <span className="print-medicine-name font-bold text-[13.5px]">
                            {it.medicine.name}
                          </span>
                          {it.medicine.formulation && (
                            <span className="text-[13px] font-normal text-black ml-1.5">
                              {it.medicine.formulation}
                            </span>
                          )}
                        </div>
                        {it.medicine.additionalInstructions && (
                          <div className="print-medicine-instructions text-[12px] leading-[16px] text-[#333333] mt-0.5">
                            {it.medicine.additionalInstructions}
                          </div>
                        )}
                      </td>
                      <td className="py-1.5 align-top text-[13px] text-black">
                        {it.medicine.dose || "—"}
                      </td>
                      <td className="py-1.5 align-top text-[13px] text-black">
                        {abbreviateRoute(it.medicine.route || "Oral")}
                      </td>
                      <td className="py-1.5 align-top text-[13px] text-black">
                        {it.medicine.frequency || "—"}
                      </td>
                      <td className="py-1.5 align-top text-[13px] text-black">
                        {it.medicine.duration || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {items
            .filter((it) => it.type === "advice" || it.type === "followup")
            .map((it, idx) => (
              <div key={idx} className="flex items-start text-black pt-2">
                <div className="w-[128px] shrink-0 print-label text-[11px] leading-[15px] font-bold tracking-[0.04em] uppercase">
                  {it.label}
                </div>
                <div className="flex-1 print-clinical-text text-[13.5px] leading-[19px] whitespace-pre-wrap">
                  {it.text}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-8">
        {hasStampSig && (
          <div className="print-keep-together mb-6">
            <div className="print-stamp-sig-block flex items-end justify-end gap-6 ml-auto">

              <div className="flex flex-col items-center">
                <div className="print-stamp-box w-[226px] h-[120px] border border-dashed border-[#666666] flex items-center justify-center">
                  <span className="text-[11px] text-[#666666]/50">Physical Stamp Area</span>
                </div>
                <span className="print-caption text-[11px] text-[#333333] mt-1.5 text-center">
                  Doctor's Stamp
                </span>
              </div>

              <div className="print-sig-area w-[253px] flex flex-col justify-end">
                <div className="print-sig-line border-b border-black w-full h-[85px]" />
                <div className="mt-1.5 text-center">
                  <span className="print-caption text-[11px] text-[#333333] block">
                    Doctor's Signature
                  </span>
                  <span className="text-[12px] font-semibold text-black block mt-0.5">
                    {doctorName} {regNo ? `(${regNo})` : ""}
                  </span>
                </div>
              </div>
            </div>

            <p className="print-caption text-[10.5px] text-[#333333] text-center mt-3">
              Valid only when signed and stamped by the doctor.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="print-page-number text-[11px] text-[#333333] text-center pb-2">
            Page {pageNumber} of {totalPages}
          </div>
        )}
      </div>
    </div>
  );
};

export default A4Sheet;
