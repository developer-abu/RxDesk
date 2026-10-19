/**
 * ForgotPasswordPage.jsx
 *
 * Implements Design Spec §9 (Utility screen: Forgot password):
 * - 480px card
 * - Email field + Send Reset Link button
 * - Safe response: info banner identical whether or not account exists
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthHeader from "../components/layout/AuthHeader";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";
import NoticeBanner from "../components/ui/NoticeBanner";
import * as authService from "../services/authService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await authService.forgotPassword({ email: email.trim().toLowerCase() });
    } catch {
      // Intentionally suppress error to avoid user enumeration
    } finally {
      setIsLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col">
      <AuthHeader prompt="Remember your password?" linkText="Log in" linkTo="/login" />

      <main id="main-content" className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-[480px] bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6 md:p-10">
          <h1 className="text-[24px] leading-[32px] font-semibold text-[#14232B] mb-2">
            Reset your password
          </h1>
          <p className="text-[14px] leading-[22px] text-[#3F4F5A] mb-6">
            Enter the email address associated with your doctor account.
          </p>

          {submitted ? (
            <div className="space-y-6">
              <NoticeBanner type="info">
                If an account exists for this email, password reset instructions have
                been sent.
              </NoticeBanner>
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-[14px] font-semibold text-[#0F5A78] hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <TextInput
                label="Email address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                loadingText="Sending…"
                className="w-full"
              >
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-[14px] leading-[20px] font-medium text-[#0F5A78] hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
