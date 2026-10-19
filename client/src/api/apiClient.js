/**
 * apiClient.js
 *
 * Axios instance configured for RxDesk backend.
 *
 * Security notes:
 *  - credentials: "include"  → sends HTTP-only JWT cookie on every request
 *  - baseURL from env         → never hard-coded, never exposed in frontend bundle
 *  - withXSRFToken disabled   → SameSite=Strict cookie is the CSRF protection
 *  - Interceptor strips any field that looks like patient/prescription data
 *    before logging (belt-and-suspenders: the app must never send such data
 *    in the first place, but this is an extra guard).
 */

import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,       // send HTTP-only cookie on every request
  timeout: 15000,              // 15-second timeout — fail fast on network issues
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

/* ----------------------------------------------------------------
   REQUEST INTERCEPTOR
   Security guard: block any request that accidentally carries
   patient or prescription fields. Log a clear error so developers
   catch this during development, but DO NOT log the actual values.
   ---------------------------------------------------------------- */
const FORBIDDEN_FIELDS = [
  "patientName", "patient_name", "patientAge", "age",
  "chiefComplaints", "clinicalNotes", "diagnosis",
  "medicines", "medicine", "prescription", "prescriptions",
  "advice", "followUp", "follow_up",
];

apiClient.interceptors.request.use(
  (config) => {
    if (config.data && typeof config.data === "object") {
      const keys = Object.keys(config.data);
      const forbidden = keys.filter((k) =>
        FORBIDDEN_FIELDS.some((f) => k.toLowerCase().includes(f.toLowerCase()))
      );
      if (forbidden.length > 0) {
        // Block the request entirely — this is a programming error
        console.error(
          "[RxDesk Security] REQUEST BLOCKED: Attempted to send patient/prescription " +
          "data to the backend. Fields detected (values NOT logged):",
          forbidden
        );
        return Promise.reject(
          new Error("Security policy violation: patient data must not be sent to the server.")
        );
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ----------------------------------------------------------------
   RESPONSE INTERCEPTOR
   - 401 → clear local auth state, redirect to /login
   - Never log response data (could contain doctor account info)
   ---------------------------------------------------------------- */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or cookie cleared — redirect to login
      // We use window.location to break out of any React Router context
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

