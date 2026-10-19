/**
 * ResetPasswordPage.jsx
 *
 * Implements Design Spec §9 (Utility screen: Reset password):
 * - Two password fields with strength checklist
 * - Reset verification OTP/token
 * - Redirect to Login with success banner
 */

import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthHeader from "../components/layout/AuthHeader";
import PasswordInput from "../components/ui/PasswordInput";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";
import NoticeBanner from "../components/ui/NoticeBanner";
import * as authService from "../services/authService";
import { useToast } from "../context/ToastContext";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState(searchParams.get("otp") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !otp) {
      setError("Email and reset verification code are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const hasLength = newPassword.length >= 8;
    const hasUpperLower = /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (!hasLength || !hasUpperLower || !hasNumber) {
      setError("Password does not meet all the required rules.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });

      addToast({
        type: "success",
        message: "Password reset successfully. You can now log in.",
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col">
      <AuthHeader prompt="Remember your password?" linkText="Log in" linkTo="/login" />

      <main id="main-content" className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-[480px] bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6 md:p-10">
          <h1 className="text-[24px] leading-[32px] font-semibold text-[#14232B] mb-2">
            Set new password
          </h1>
          <p className="text-[14px] leading-[22px] text-[#3F4F5A] mb-6">
            Enter your reset code and choose a secure new password.
          </p>

          {error && (
            <div className="mb-6">
              <NoticeBanner type="error">{error}</NoticeBanner>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!searchParams.get("email") && (
              <TextInput
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}

            {!searchParams.get("otp") && (
              <TextInput
                label="Reset code (from email)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            )}

            <PasswordInput
              label="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              showRulesChecklist={true}
              required
            />

            <PasswordInput
              label="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              loadingText="Updating…"
              className="w-full"
            >
              Set New Password
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
