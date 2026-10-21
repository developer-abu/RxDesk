

import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";
import Spinner from "./components/ui/Spinner";

const HomePage               = lazy(() => import("./pages/HomePage"));
const RegisterPage           = lazy(() => import("./pages/RegisterPage"));
const LoginPage              = lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage     = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage      = lazy(() => import("./pages/ResetPasswordPage"));
const PrivacyPage            = lazy(() => import("./pages/PrivacyPage"));
const TermsPage              = lazy(() => import("./pages/TermsPage"));
const DashboardPage          = lazy(() => import("./pages/DashboardPage"));
const CreateChamberPage      = lazy(() => import("./pages/CreateChamberPage"));
const CreatePrescriptionPage = lazy(() => import("./pages/CreatePrescriptionPage"));

const pageTitles = {
  "/": "RxDesk — Doctor Prescription Generator",
  "/register": "Create Account — RxDesk",
  "/login": "Doctor Login — RxDesk",
  "/forgot-password": "Forgot Password — RxDesk",
  "/reset-password": "Reset Password — RxDesk",
  "/privacy": "Privacy Policy — RxDesk",
  "/terms": "Terms of Use — RxDesk",
  "/dashboard": "Dashboard — RxDesk",
  "/chambers/new": "Create Chamber — RxDesk",
  "/prescriptions/new": "Create Prescription — RxDesk",
};

const PageTitle = () => {
  const { pathname } = useLocation();

  return (
    <Helmet>
      <title>{pageTitles[pathname] ?? pageTitles["/"]}</title>
    </Helmet>
  );
};

const PageLoader = () => (
  <div
    className="fixed inset-0 flex items-center justify-center"
    style={{ background: "var(--color-page)" }}
    aria-label="Loading page…"
    role="status"
  >
    <Spinner size={32} />
  </div>
);

const App = () => (
  <BrowserRouter>
    <PageTitle />
    <ToastProvider>
      <AuthProvider>

        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Suspense fallback={<PageLoader />}>
          <Routes>

            <Route path="/" element={<HomePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            <Route element={<PublicOnlyRoute />}>
              <Route path="/register"        element={<RegisterPage />} />
              <Route path="/login"           element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password"  element={<ResetPasswordPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard"          element={<DashboardPage />} />
              <Route path="/chambers/new"       element={<CreateChamberPage />} />
              <Route path="/prescriptions/new"  element={<CreatePrescriptionPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
);

export default App;
