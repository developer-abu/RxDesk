import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.config?.url?.startsWith("/chambers")
    ) {
      window.dispatchEvent(new Event("rxdesk:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
