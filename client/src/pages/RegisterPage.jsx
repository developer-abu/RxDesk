import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../components/layout/AuthHeader";
import TextInput from "../components/ui/TextInput";
import PasswordInput from "../components/ui/PasswordInput";
import Button from "../components/ui/Button";
import NoticeBanner from "../components/ui/NoticeBanner";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { extractLastName } from "../utils/formatUtils";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerAndVerify, verifyAndLogin } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    fullQualification: "",
    doctorRegistrationNumber: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value, { ...formData, [field]: value });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field], formData);
  };

  const validateField = (field, value, currentData) => {
    let err = "";

    if (field === "fullName") {
      if (!value?.trim()) err = "Enter your full name.";
      else if (value.trim().length < 3) err = "Full name must be at least 3 characters.";
    } else if (field === "fullQualification") {
      if (!value?.trim()) err = "Enter your qualifications.";
      else if (value.trim().length < 2) err = "Qualification must be at least 2 characters.";
    } else if (field === "doctorRegistrationNumber") {
      if (!value?.trim()) err = "Enter your doctor registration number.";
      else if (value.trim().length < 2) err = "Registration number must be at least 2 characters.";
    } else if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value?.trim()) err = "Enter your email address.";
      else if (!emailRegex.test(value.trim()))
        err = "Enter a valid email address, like name@example.com.";
    } else if (field === "mobileNumber") {
      const cleanNum = value.replace(/\s+/g, "");
      if (!cleanNum) err = "Enter a 10-digit mobile number.";
      else if (!/^[6-9]\d{9}$/.test(cleanNum))
        err = "Enter a 10-digit mobile number starting with 6, 7, 8 or 9.";
    } else if (field === "password") {
      const hasLength = value.length >= 8;
      const hasUpperLower = /[A-Z]/.test(value) && /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      if (!hasLength || !hasUpperLower || !hasNumber) {
        err = "Create a password that meets all the rules below.";
      }
    } else if (field === "confirmPassword") {
      if (value !== currentData.password) {
        err = "Passwords do not match.";
      }
    } else if (field === "agreed") {
      if (!value) {
        err = "You must accept this to create an account.";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: err }));
    return err;
  };

  const validateAll = () => {
    const nextErrors = {};
    nextErrors.fullName = validateField("fullName", formData.fullName, formData);
    nextErrors.fullQualification = validateField("fullQualification", formData.fullQualification, formData);
    nextErrors.doctorRegistrationNumber = validateField(
      "doctorRegistrationNumber",
      formData.doctorRegistrationNumber,
      formData
    );
    nextErrors.email = validateField("email", formData.email, formData);
    nextErrors.mobileNumber = validateField("mobileNumber", formData.mobileNumber, formData);
    nextErrors.password = validateField("password", formData.password, formData);
    nextErrors.confirmPassword = validateField("confirmPassword", formData.confirmPassword, formData);
    nextErrors.agreed = validateField("agreed", formData.agreed, formData);

    setTouched({
      fullName: true,
      fullQualification: true,
      doctorRegistrationNumber: true,
      email: true,
      mobileNumber: true,
      password: true,
      confirmPassword: true,
      agreed: true,
    });

    return Object.values(nextErrors).filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const failedList = validateAll();
    if (failedList.length > 0) {
      if (failedList.length >= 2) {
        setServerError("Please correct the highlighted fields.");
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerAndVerify({
        fullName: formData.fullName.trim(),
        fullQualification: formData.fullQualification.trim(),
        doctorRegistrationNumber: formData.doctorRegistrationNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        mobileNumber: formData.mobileNumber.replace(/\s+/g, ""),
        password: formData.password,
      });

      setRequiresOtp(Boolean(res?.data?.requiresEmailVerification));
    } catch (err) {
      if (err.response?.status === 409) {
        setServerError("An account with this email already exists.");
      } else {
        setServerError(
          err.response?.data?.message ||
            "We couldn’t create your account. Check your connection and try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setOtpError("Enter the 6-digit verification code sent to your email.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");
    try {
      await verifyAndLogin({
        email: formData.email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      const lastName = extractLastName(formData.fullName);
      addToast({
        type: "success",
        message: `Account created. Welcome, Dr. ${lastName}.`,
      });
      navigate("/dashboard");
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid or expired verification code.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col">
      <AuthHeader prompt="Already registered?" linkText="Log in" linkTo="/login" />

      <main id="main-content" className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-[480px] bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6 md:p-10">
          {!requiresOtp ? (
            <>

              <div className="mb-6">
                <h1 className="text-[24px] leading-[32px] font-semibold text-[#14232B]">
                  Create your doctor account
                </h1>
                <p className="mt-2 text-[14px] leading-[22px] text-[#3F4F5A]">
                  Set up your account, then add your chambers.
                </p>
              </div>

              {serverError && (
                <div className="mb-6">
                  <NoticeBanner type="error">
                    {serverError}
                    {serverError.includes("already exists") && (
                      <Link to="/login" className="ml-1 font-semibold underline text-[#0F5A78]">
                        Log in instead
                      </Link>
                    )}
                  </NoticeBanner>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                <TextInput
                  label="Full name"
                  name="fullName"
                  placeholder="Anita Sen"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  onBlur={() => handleBlur("fullName")}
                  error={touched.fullName ? errors.fullName : ""}
                  helperText="Used to greet you. The name printed on prescriptions is set per chamber."
                  required
                  maxLength={80}
                  autoComplete="name"
                />

                <TextInput
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  error={touched.email ? errors.email : ""}
                  required
                  autoComplete="email"
                />

                <TextInput
                  label="Qualifications"
                  name="fullQualification"
                  placeholder="For example: MBBS, MD"
                  value={formData.fullQualification}
                  onChange={(e) => handleChange("fullQualification", e.target.value)}
                  onBlur={() => handleBlur("fullQualification")}
                  error={touched.fullQualification ? errors.fullQualification : ""}
                  required
                  maxLength={200}
                />

                <TextInput
                  label="Doctor registration number"
                  name="doctorRegistrationNumber"
                  placeholder="Registration number"
                  value={formData.doctorRegistrationNumber}
                  onChange={(e) => handleChange("doctorRegistrationNumber", e.target.value)}
                  onBlur={() => handleBlur("doctorRegistrationNumber")}
                  error={
                    touched.doctorRegistrationNumber
                      ? errors.doctorRegistrationNumber
                      : ""
                  }
                  required
                  maxLength={60}
                />

                <div className="w-full">
                  <label className="text-[14px] leading-[20px] font-medium text-[#14232B] flex items-center mb-1.5">
                    Mobile number <span className="text-[#B42318] ml-1">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="w-14 h-[44px] bg-[#EEF1F4] border-y border-l border-[#7D8D98] rounded-l-[6px] flex items-center justify-center text-[14px] font-medium text-[#14232B] select-none border-r border-r-[#7D8D98]">
                      +91
                    </div>
                    <input
                      type="tel"
                      name="mobileNumber"
                      placeholder="98300 12345"
                      value={formData.mobileNumber}
                      onChange={(e) => handleChange("mobileNumber", e.target.value)}
                      onBlur={() => handleBlur("mobileNumber")}
                      maxLength={12}
                      className={`flex-1 h-[44px] px-3 font-sans text-[14px] md:text-[14px] text-[16px] leading-[20px] text-[#14232B]
                                 bg-white border-y border-r rounded-r-[6px] outline-none transition-colors duration-120
                                 hover:border-[#5F6F7A] focus:border-[#0F5A78] focus:ring-3 focus:ring-[#1B7FB5]/30
                                 ${
                                   touched.mobileNumber && errors.mobileNumber
                                     ? "border-[#B42318]"
                                     : "border-[#7D8D98]"
                                 }`}
                    />
                  </div>
                  {touched.mobileNumber && errors.mobileNumber && (
                    <p className="flex items-center gap-1.5 text-[13px] leading-[18px] font-medium text-[#B42318] mt-1">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>

                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  error={touched.password ? errors.password : ""}
                  showRulesChecklist={true}
                  rulesChecklistTouched={Boolean(touched.password)}
                  required
                  autoComplete="new-password"
                />

                <PasswordInput
                  label="Confirm password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  onBlur={() => handleBlur("confirmPassword")}
                  error={touched.confirmPassword ? errors.confirmPassword : ""}
                  required
                  autoComplete="new-password"
                />

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.agreed}
                      onChange={(e) => handleChange("agreed", e.target.checked)}
                      onBlur={() => handleBlur("agreed")}
                      className="w-4 h-4 mt-1 rounded text-[#0F5A78] focus:ring-[#1B7FB5] border-[#7D8D98]"
                    />
                    <span className="text-[14px] leading-[22px] text-[#14232B]">
                      I am a registered medical practitioner and I agree to the{" "}
                      <Link
                        to="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0F5A78] underline hover:text-[#0B475F]"
                      >
                        Terms of Use
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0F5A78] underline hover:text-[#0B475F]"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {touched.agreed && errors.agreed && (
                    <p className="text-[13px] leading-[18px] font-medium text-[#B42318] mt-1">
                      {errors.agreed}
                    </p>
                  )}
                </div>

                <p className="text-[13px] leading-[20px] text-[#5F6F7A] pt-1">
                  RxDesk does not verify medical registration. You are responsible
                  for the accuracy of the details printed on your prescriptions.
                </p>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    loadingText="Creating account…"
                    className="w-full"
                  >
                    Create Account
                  </Button>
                </div>
              </form>

              <div className="mt-5 text-center text-[14px] leading-[22px] text-[#3F4F5A]">
                Already have an account?{" "}
                <Link to="/login" className="text-[#0F5A78] font-semibold hover:underline">
                  Log in
                </Link>
              </div>
            </>
          ) : (

            <div>
              <h1 className="text-[24px] leading-[32px] font-semibold text-[#14232B]">
                Verify your email
              </h1>
              <p className="mt-2 text-[14px] leading-[22px] text-[#3F4F5A]">
                We sent a 6-digit verification code to <strong>{formData.email}</strong>.
              </p>

              {otpError && (
                <div className="my-4">
                  <NoticeBanner type="error">{otpError}</NoticeBanner>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
                <TextInput
                  label="Verification code"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isVerifyingOtp}
                  loadingText="Verifying…"
                  className="w-full mt-2"
                >
                  Verify and Continue
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
