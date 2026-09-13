import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Bg from "../../assets/images/hero-bg-5.jpg";
import { API_BASE } from "../../config";

const FEATURES = [
  "Discover national research equipment",
  "Explore institutes & laboratories",
  "Streamlined access for researchers",
];

export default function EmailVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Get userId from navigation state (fall back to sessionStorage after a refresh)
  const { userId: stateUserId, email: stateEmail } = location.state || {};
  const userId = stateUserId ?? sessionStorage.getItem("verify_user_id");
  const email = stateEmail ?? sessionStorage.getItem("verify_email");

  useEffect(() => {
    if (!userId) {
      // If no userId, redirect back to login/register
      navigate("/auth/login");
    }
  }, [userId, navigate]);

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5)
        document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerifyEmail = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setError("Please enter all 6 digits!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, otp: enteredOtp }),
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        console.error("Email Verification Response:", text);
        setError("Something went wrong. Please try again!");
        toast.error("Something went wrong. Please try again!");
        return;
      }
      console.log("Email Verification Response:", result);

      if (result && result.success === true) {
        setError("");
        toast.success("Email verified successfully!");
        sessionStorage.removeItem("verify_user_id");
        sessionStorage.removeItem("verify_email");
        setTimeout(() => navigate("/auth/login"), 800);
      } else {
        setError("Invalid OTP. Please try again!");
        toast.error("Invalid OTP. Please try again!");
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setError("Something went wrong. Please try again!");
      toast.error("Something went wrong. Please try again!");
    }
  };

  const handleResendCode = () => {
    if (!userId) return;
    setIsResending(true);
    setError("");
    setTimeout(() => setIsResending(false), 3000);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="w-full max-w-[1020px] bg-white rounded-[18px] overflow-hidden border border-black/5 shadow-[0_16px_45px_rgba(0,0,0,0.07),0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col md:flex-row">
          {/* Left - Brand Showcase Panel */}
          <div className="relative md:w-5/12 min-h-[200px] md:min-h-[560px] flex flex-col justify-center md:justify-end px-5 sm:px-9 py-6 md:py-12 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${Bg})` }}
            ></div>
            <div className="absolute inset-0 z-[1] bg-black/80"></div>

            <div className="relative z-[2]">
              <span
                className="inline-flex items-center px-3.5 py-1.5 mb-4 md:mb-5 rounded-full text-xs font-bold uppercase tracking-[0.5px] text-white border border-white/35"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                NSF Sri Lanka
              </span>
              <h2 className="text-white text-2xl md:text-[28px] font-extrabold leading-[1.25] mb-3.5 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                National Instrument Database
              </h2>
              <p className="text-white/90 text-sm leading-relaxed mb-6">
                Centralized access to advanced scientific instruments, analytical
                equipment, and national laboratory resources.
              </p>

              <div className="hidden md:flex flex-col gap-3 pt-3.5 border-t border-white/20 mb-6">
                {FEATURES.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center text-white text-[13.5px] font-medium"
                  >
                    <span className="w-[22px] h-[22px] rounded-full bg-white/25 inline-flex items-center justify-center mr-2.5 shrink-0">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Verify Form Panel */}
          <div className="md:w-7/12 bg-white flex flex-col justify-center px-5 sm:px-8 lg:px-11 py-8 md:min-h-[560px]">
            {/* Header */}
            <div className="text-center mb-[26px]">
              <div className="w-[68px] h-[68px] rounded-full bg-[#fff7ec] border border-[rgba(238,147,16,0.25)] flex items-center justify-center mx-auto mb-[18px] text-[#ee9310]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h1 className="text-[26px] font-bold text-[#111827] mb-2 tracking-tight">
                Verify Your Email
              </h1>
              <p className="text-sm text-[#6b7280] leading-relaxed mx-auto max-w-[400px]">
                A 6-digit verification code was sent to your email address. Enter
                the code below to activate your account.
              </p>
            </div>

            {/* Email chip */}
            {email && (
              <div className="inline-flex items-center gap-2 mx-auto mt-[18px] mb-6 px-4 py-2 rounded-full border border-dashed border-[rgba(238,147,16,0.5)] bg-[#fffdf8] text-[13.5px] font-semibold text-[#111827]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ee9310"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>{email}</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-[14px] text-center text-[13.5px] text-[#dc2626] bg-[#fef2f2] border-l-4 border-[#ef4444] rounded-lg px-4 py-[11px] mb-4">
                {error}
              </div>
            )}

            {/* Code inputs */}
            <div className="flex justify-between gap-2 mb-[20px] max-w-[340px] mx-auto w-full">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-[46px] h-[56px] text-center text-2xl font-bold rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ee9310] focus:ring-[4px] focus:ring-[rgba(238,147,16,0.18)] transition-all duration-200"
                />
              ))}
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                onClick={handleVerifyEmail}
                className="w-full max-w-[280px] h-12 rounded-[9px] bg-[#ee9310] border-none text-white text-[15px] font-semibold tracking-[0.3px] cursor-pointer transition-all duration-250 shadow-[0_4px_12px_rgba(238,147,16,0.28)] hover:bg-[#d88106] hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(238,147,16,0.38)] active:translate-y-0"
              >
                Verify Email
              </button>
            </div>

            {/* Resend */}
            <div className="text-center mt-[26px] pt-[22px] border-t border-[#e5e7eb]">
              <div className="text-[14.5px] font-semibold text-[#111827] mb-1">
                Didn't receive the code?
              </div>
              <div className="text-[13px] text-[#6b7280] mb-3.5">
                Check your spam or junk folder, or resend the code.
              </div>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="inline-block h-[42px] leading-[42px] px-6 rounded-[9px] bg-white border-[1.5px] border-[#ee9310] text-[#ee9310] text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-[#ee9310] hover:text-white hover:shadow-[0_4px_12px_rgba(238,147,16,0.28)] disabled:opacity-65 disabled:cursor-not-allowed"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}