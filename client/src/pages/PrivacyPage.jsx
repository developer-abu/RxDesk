

import React from "react";
import PublicHeader from "../components/layout/PublicHeader";
import Footer from "../components/layout/Footer";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col">
      <PublicHeader />

      <main id="main-content" className="flex-1 py-12 px-4">
        <div className="max-w-[720px] mx-auto bg-white p-8 md:p-12 rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)]">
          <h1 className="text-[24px] leading-[32px] font-semibold text-[#14232B] mb-6">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-[14px] leading-[22px] text-[#3F4F5A]">
            <p>
              Last updated: October 17, 2026. RxDesk ("we", "our", or "the platform") is a
              dedicated doctor prescription formatting utility designed for registered
              medical practitioners in India.
            </p>

            <h2 className="text-[18px] leading-[26px] font-semibold text-[#14232B]">
              1. Fundamental Privacy Guarantee: No Patient Data Persistence
            </h2>
            <p>
              The most essential operational constraint of RxDesk is that{" "}
              <strong className="text-[#14232B]">
                we never store, persist, log, analyze, or transmit patient medical data
              </strong>
              .
            </p>
            <p>
              All patient information, including names, age, sex, complaints, clinical
              findings, provisional diagnoses, medicine lists, and advice, exists solely in
              temporary browser memory on your device while you prepare and print the
              prescription document. Once you refresh or close the browser tab, this data is
              instantly cleared.
            </p>

            <h2 className="text-[18px] leading-[26px] font-semibold text-[#14232B]">
              2. Information We Store
            </h2>
            <p>
              We store only the minimum information necessary to authenticate doctor accounts
              and manage chamber details:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Doctor account details: Full name, email address, password hash, and mobile number.</li>
              <li>Saved chamber details: Chamber name, address, contact phone number, doctor's registered qualifications, medical council registration number, and visiting schedule.</li>
            </ul>

            <h2 className="text-[18px] leading-[26px] font-semibold text-[#14232B]">
              3. Cookies and Security
            </h2>
            <p>
              We use strictly necessary HTTP-only authentication cookies to maintain your
              secure login session. We do not use third-party tracking cookies or advertising
              analytics on the prescription preparation workspace.
            </p>

            <h2 className="text-[18px] leading-[26px] font-semibold text-[#14232B]">
              4. Contact Us
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy, please contact us at{" "}
              <a href="mailto:support@rxdesk.local" className="text-[#0F5A78] underline">
                support@rxdesk.local
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
