

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";
import ChamberCard from "../components/chamber/ChamberCard";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import NoticeBanner from "../components/ui/NoticeBanner";
import { useAuth } from "../hooks/useAuth";
import * as chamberService from "../services/chamberService";
import { ArrowRight } from "lucide-react";

const getChamberList = async () => {
  const response = await chamberService.getChambers();
  return response?.data?.chambers || response?.chambers || [];
};

const DashboardPage = () => {
  const { doctor } = useAuth();
  const [chambers, setChambers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchChambers = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      setChambers(await getChamberList());
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getChamberList()
      .then((list) => {
        if (active) setChambers(list);
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const doctorGreeting = doctor?.fullName
    ? `Welcome, Dr. ${doctor.fullName.replace(/^Dr\.\s*/i, "")}`
    : "Welcome, Doctor";

  const hasChambers = chambers.length > 0;

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col">
      <AppHeader />

      <main id="main-content" className="flex-1 py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">

          <div className="mb-6">
            <h1 className="text-[24px] leading-[32px] font-semibold text-[#14232B]">
              {doctorGreeting}
            </h1>
            <p className="mt-2 text-[14px] leading-[22px] text-[#3F4F5A]">
              Create a chamber or start a new prescription.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

            <Link
              to={hasChambers ? "/prescriptions/new" : "#"}
              className={`min-h-[112px] p-6 rounded-[8px] flex items-center justify-between transition-colors duration-120 group
                ${
                  !isLoading && !hasChambers
                    ? "bg-white border border-[#B7C3CC] text-[#14232B] opacity-75 cursor-not-allowed"
                    : "bg-[#0F5A78] text-white hover:bg-[#0B475F] shadow-[0_1px_2px_rgba(20,35,43,0.04)]"
                }`}
            >
              <div>
                <h2
                  className={`text-[18px] leading-[26px] font-semibold ${
                    !isLoading && !hasChambers ? "text-[#14232B]" : "text-white"
                  }`}
                >
                  Create Prescription
                </h2>
                <p
                  className={`mt-1 text-[14px] leading-[22px] ${
                    !isLoading && !hasChambers ? "text-[#5F6F7A]" : "text-[#E6F0F4]"
                  }`}
                >
                  {!isLoading && !hasChambers
                    ? "Requires at least one chamber."
                    : "Choose a chamber and prepare a prescription."}
                </p>
              </div>
              <ArrowRight
                className={`w-5 h-5 shrink-0 transition-transform duration-120 group-hover:translate-x-1 ${
                  !isLoading && !hasChambers ? "text-[#5F6F7A]" : "text-white"
                }`}
                strokeWidth={1.75}
              />
            </Link>

            <Link
              to="/chambers/new"
              className={`min-h-[112px] p-6 rounded-[8px] flex items-center justify-between transition-colors duration-120 group
                ${
                  !isLoading && !hasChambers
                    ? "bg-[#0F5A78] text-white hover:bg-[#0B475F] shadow-[0_1px_2px_rgba(20,35,43,0.04)]"
                    : "bg-white border border-[#B7C3CC] text-[#14232B] hover:border-[#0F5A78] hover:bg-[#F1F5F8] shadow-[0_1px_2px_rgba(20,35,43,0.04)]"
                }`}
            >
              <div>
                <h2
                  className={`text-[18px] leading-[26px] font-semibold ${
                    !isLoading && !hasChambers ? "text-white" : "text-[#14232B]"
                  }`}
                >
                  Create Chamber
                </h2>
                <p
                  className={`mt-1 text-[14px] leading-[22px] ${
                    !isLoading && !hasChambers ? "text-[#E6F0F4]" : "text-[#3F4F5A]"
                  }`}
                >
                  Save a new chamber with its address and visiting hours.
                </p>
              </div>
              <ArrowRight
                className={`w-5 h-5 shrink-0 transition-transform duration-120 group-hover:translate-x-1 ${
                  !isLoading && !hasChambers ? "text-white" : "text-[#3F4F5A]"
                }`}
                strokeWidth={1.75}
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[18px] leading-[26px] font-semibold text-[#14232B]">
              Your Chambers
            </h2>
            {isLoading ? (
              <Skeleton width="24px" height="20px" className="rounded" />
            ) : (
              <span className="px-2 py-0.5 rounded-[4px] bg-[#E6F0F4] text-[#0F5A78] text-[12px] leading-[16px] font-medium">
                {chambers.length}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton height="232px" className="rounded-[8px]" />
              <Skeleton height="232px" className="rounded-[8px]" />
            </div>
          ) : loadError ? (
            <NoticeBanner type="error">
              We couldn’t load your chambers.{" "}
              <button
                type="button"
                onClick={fetchChambers}
                className="font-semibold underline text-[#0F5A78] ml-1"
              >
                Try again
              </button>
            </NoticeBanner>
          ) : !hasChambers ? (
            <EmptyState
              title="No chambers yet"
              description="Create a chamber to save your details, address and visiting hours. You will select it each time you prepare a prescription."
              actionLabel="Create Chamber"
              onAction={() => (window.location.href = "/chambers/new")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chambers.map((ch) => (
                <ChamberCard key={ch._id} chamber={ch} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
