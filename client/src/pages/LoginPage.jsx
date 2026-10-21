

import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthHeader from "../components/layout/AuthHeader";
import TextInput from "../components/ui/TextInput";
import PasswordInput from "../components/ui/PasswordInput";
import Button from "../components/ui/Button";
import NoticeBanner from "../components/ui/NoticeBanner";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorBanner, setErrorBanner] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const passwordInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBanner("");

    if (!email.trim() || !password) {
      setErrorBanner("Enter your email address and password.");
      return;
    }

    setIsLoading(true);
    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
      });

      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response?.status === 429) {
        setErrorBanner(
          "Too many unsuccessful attempts. Try again in 15 minutes or reset your password."
        );
      } else {

        setErrorBanner("Incorrect email or password. Check your details and try again.");
      }
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col">
      <AuthHeader prompt="New to RxDesk?" linkText="Register" linkTo="/register" />

      <main id="main-content" className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-[480px] bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6 md:p-10">
          <div className="mb-6">
            <h1 className="text-[24px] leading-[32px] font-semibold text-[#14232B]">
              Doctor Login
            </h1>
            <p className="mt-2 text-[14px] leading-[22px] text-[#3F4F5A]">
              Log in to manage your chambers and create prescriptions.
            </p>
          </div>

          {errorBanner && (
            <div className="mb-6">
              <NoticeBanner type="error">{errorBanner}</NoticeBanner>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <TextInput
              label="Email address"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <PasswordInput
              ref={passwordInputRef}
              label="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              labelRight={
                <Link
                  to="/forgot-password"
                  className="text-[13px] leading-[20px] font-medium text-[#0F5A78] hover:text-[#0B475F] underline"
                >
                  Forgot password?
                </Link>
              }
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                loadingText="Logging in…"
                className="w-full"
              >
                Log In
              </Button>
            </div>
          </form>

          <div className="mt-5 text-center text-[14px] leading-[22px] text-[#3F4F5A]">
            New to RxDesk?{" "}
            <Link
              to="/register"
              className="text-[#0F5A78] font-semibold hover:underline"
            >
              Register as a Doctor
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
