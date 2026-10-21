

import React from "react";
import { Link } from "react-router-dom";
import { formatVisitingLine } from "../../utils/formatUtils";

const ChamberCard = ({ chamber }) => {
  if (!chamber) return null;

  const {
    _id,
    chamberName,
    doctorName,
    qualifications,
    registrationNo,
    address,
    contactNumber,
    visitingDays,
    visitingSessions,
  } = chamber;

  const visitingString = formatVisitingLine(
    visitingDays,
    visitingSessions || chamber.visitingHours
  );

  return (
    <div className="w-full min-h-[232px] p-5 rounded-[8px] bg-white border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] flex flex-col justify-between transition-colors duration-120">
      <div>

        <h3
          title={chamberName}
          className="text-[16px] leading-[24px] font-semibold text-[#14232B] truncate mb-3"
        >
          {chamberName}
        </h3>

        <div className="space-y-3">

          <div className="flex text-[13px] leading-[20px]">
            <span className="w-[88px] shrink-0 text-[#5F6F7A]">Doctor</span>
            <span className="text-[14px] leading-[22px] text-[#14232B] line-clamp-2">
              {doctorName}
              {qualifications ? `, ${qualifications}` : ""}
            </span>
          </div>

          {registrationNo && (
            <div className="flex text-[13px] leading-[20px]">
              <span className="w-[88px] shrink-0 text-[#5F6F7A]">Reg. No.</span>
              <span className="text-[14px] leading-[22px] text-[#14232B]">
                {registrationNo}
              </span>
            </div>
          )}

          <div className="flex text-[13px] leading-[20px]">
            <span className="w-[88px] shrink-0 text-[#5F6F7A]">Address</span>
            <span
              title={address}
              className="text-[14px] leading-[22px] text-[#14232B] line-clamp-2"
            >
              {address}
            </span>
          </div>

          <div className="flex text-[13px] leading-[20px]">
            <span className="w-[88px] shrink-0 text-[#5F6F7A]">Contact</span>
            <span className="text-[14px] leading-[22px] text-[#14232B]">
              {contactNumber}
            </span>
          </div>

          {visitingString && (
            <div className="flex text-[13px] leading-[20px]">
              <span className="w-[88px] shrink-0 text-[#5F6F7A]">Visits</span>
              <span className="text-[14px] leading-[22px] text-[#14232B]">
                {visitingString}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#D5DDE3] flex items-center justify-between">
        <Link
          to={`/prescriptions/new?chamberId=${_id}`}
          className="text-[14px] leading-[20px] font-semibold text-[#0F5A78] hover:text-[#0B475F] inline-flex items-center gap-1 group"
        >
          <span>Create prescription</span>
          <span className="transition-transform duration-120 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ChamberCard;
