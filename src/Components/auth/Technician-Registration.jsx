import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE } from "../../config";
import { toast } from "react-toastify";

export default function TechnicianRegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log("Registration Response:", result);

      // ✅ Navigate to verify-email page with user_id
      if (result.message === "User registered successfully. Verification email sent.") {
        navigate("/auth/verify-email", { state: { userId: result.user_id, email: formData.email } });
        return;
      }

      toast.error(result.message || "Registration failed. Please try again.");

      // Build per-field validation errors to show under the inputs
      const normalized = {};
      if (result.errors && typeof result.errors === "object") {
        Object.entries(result.errors).forEach(([key, messages]) => {
          normalized[key] = Array.isArray(messages) ? messages : [String(messages)];
        });
      } else if (result.error === "EMAIL_ALREADY_EXISTS") {
        normalized.email = [result.message];
      }
      setFieldErrors(normalized);
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const renderFieldError = (fieldName) => {
    const messages = fieldErrors[fieldName];
    if (!messages || messages.length === 0) return null;
    return (
      <div className="text-[12.5px] text-[#dc2626] mt-1.5 font-bold">
        {messages.join(" ")}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="w-full max-w-[880px] bg-white rounded-[18px] overflow-hidden border border-black/5 shadow-[0_16px_45px_rgba(0,0,0,0.07),0_2px_8px_rgba(0,0,0,0.03)]">
        {/* Card Header */}
        <div
          className="relative text-center text-white pt-9 pb-8 px-6 sm:px-9 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #ee9310 0%, #d88106 100%)" }}
        >
          <div
            className="pointer-events-none absolute -top-1/2 -right-[20%] w-80 h-80 rounded-full"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          ></div>

          <span
            className="relative inline-flex items-center mb-3 px-3.5 py-1 rounded-full text-[11.5px] font-bold uppercase tracking-[0.8px] text-white border border-white/30"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          >
            Technician Registration
          </span>
          <h1 className="relative text-[28px] font-extrabold text-white mb-2 tracking-tight">
            Create an Account
          </h1>
          <p className="relative text-[14.5px] text-white/90 leading-relaxed max-w-[580px] mx-auto">
            Join as a Technician - create your profile to start serving
            instrument owners.
          </p>
        </div>

        {/* Card Body */}
        <div className="px-5 sm:px-11 pt-8 sm:pt-10 pb-8 sm:pb-10">
          {/* Section 1: Personal Information */}
          <div className="flex items-center gap-3 text-base font-bold text-[#111827] pb-2.5 mb-5 border-b-[1.5px] border-[#f1f3f5]">
            <span
              className="w-[26px] h-[26px] rounded-full text-[13px] font-bold inline-flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(238, 147, 16, 0.08)", color: "#ee9310" }}
            >
              1
            </span>
            Personal Information
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="mb-[18px]">
              <label className="block text-[13.5px] font-semibold text-[#111827] mb-[6px]">
                First Name <span className="text-[#dc2626] ml-0.5 font-bold">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                placeholder="Enter your first name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full h-12 px-3.5 rounded-[9px] border-[1.5px] border-[#e5e7eb] bg-white text-[14.5px] text-[#111827] placeholder:text-[#9ca3af] placeholder:text-sm focus:outline-none focus:border-[#ee9310] focus:ring-[3.5px] focus:ring-[rgba(238,147,16,0.22)] transition-all duration-200"
              />
              {renderFieldError("first_name")}
            </div>

            <div className="mb-[18px]">
              <label className="block text-[13.5px] font-semibold text-[#111827] mb-[6px]">
                Last Name <span className="text-[#dc2626] ml-0.5 font-bold">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                placeholder="Enter your last name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full h-12 px-3.5 rounded-[9px] border-[1.5px] border-[#e5e7eb] bg-white text-[14.5px] text-[#111827] placeholder:text-[#9ca3af] placeholder:text-sm focus:outline-none focus:border-[#ee9310] focus:ring-[3.5px] focus:ring-[rgba(238,147,16,0.22)] transition-all duration-200"
              />
              {renderFieldError("last_name")}
            </div>
          </div>

          <div className="mb-[18px]">
            <label className="block text-[13.5px] font-semibold text-[#111827] mb-[6px]">
              Mobile Number <span className="text-[#dc2626] ml-0.5 font-bold">*</span>
            </label>
            <input
              type="text"
              name="mobile_number"
              placeholder="e.g. 0771234567 (10 digits)"
              value={formData.mobile_number}
              onChange={handleChange}
              className="w-full h-12 px-3.5 rounded-[9px] border-[1.5px] border-[#e5e7eb] bg-white text-[14.5px] text-[#111827] placeholder:text-[#9ca3af] placeholder:text-sm focus:outline-none focus:border-[#ee9310] focus:ring-[3.5px] focus:ring-[rgba(238,147,16,0.22)] transition-all duration-200"
            />
            {renderFieldError("mobile_number")}
          </div>

          {/* Section 2: Account Credentials */}
          <div className="flex items-center gap-3 text-base font-bold text-[#111827] pb-2.5 mb-5 border-b-[1.5px] border-[#f1f3f5] mt-7">
            <span
              className="w-[26px] h-[26px] rounded-full text-[13px] font-bold inline-flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(238, 147, 16, 0.08)", color: "#ee9310" }}
            >
              2
            </span>
            Account Credentials
          </div>

          <div className="mb-[18px]">
            <label className="block text-[13.5px] font-semibold text-[#111827] mb-[6px]">
              Email Address (User Name) <span className="text-[#dc2626] ml-0.5 font-bold">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 px-3.5 rounded-[9px] border-[1.5px] border-[#e5e7eb] bg-white text-[14.5px] text-[#111827] placeholder:text-[#9ca3af] placeholder:text-sm focus:outline-none focus:border-[#ee9310] focus:ring-[3.5px] focus:ring-[rgba(238,147,16,0.22)] transition-all duration-200"
            />
            {renderFieldError("email")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="mb-[18px]">
              <label className="block text-[13.5px] font-semibold text-[#111827] mb-[6px]">
                Password <span className="text-[#dc2626] ml-0.5 font-bold">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 px-3.5 pr-11 rounded-[9px] border-[1.5px] border-[#e5e7eb] bg-white text-[14.5px] text-[#111827] placeholder:text-[#9ca3af] placeholder:text-sm focus:outline-none focus:border-[#ee9310] focus:ring-[3.5px] focus:ring-[rgba(238,147,16,0.22)] transition-all duration-200"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#9ca3af] p-2 rounded-md cursor-pointer flex items-center justify-center z-[4] transition-colors duration-200 hover:text-[#ee9310] hover:bg-[rgba(238,147,16,0.08)] focus:text-[#ee9310] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {renderFieldError("password")}
            </div>

            <div className="mb-[18px]">
              <label className="block text-[13.5px] font-semibold text-[#111827] mb-[6px]">
                Confirm Password <span className="text-[#dc2626] ml-0.5 font-bold">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-type password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full h-12 px-3.5 pr-11 rounded-[9px] border-[1.5px] border-[#e5e7eb] bg-white text-[14.5px] text-[#111827] placeholder:text-[#9ca3af] placeholder:text-sm focus:outline-none focus:border-[#ee9310] focus:ring-[3.5px] focus:ring-[rgba(238,147,16,0.22)] transition-all duration-200"
                />
                <button
                  type="button"
                  aria-label="Toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#9ca3af] p-2 rounded-md cursor-pointer flex items-center justify-center z-[4] transition-colors duration-200 hover:text-[#ee9310] hover:bg-[rgba(238,147,16,0.08)] focus:text-[#ee9310] focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {renderFieldError("confirmPassword")}
            </div>
          </div>

          <button
            onClick={handleRegister}
            className="w-full h-[50px] rounded-[10px] bg-[#EE9310] border-none text-white text-base font-bold uppercase tracking-[0.3px] cursor-pointer transition-all duration-250 mt-7 hover:bg-[#d88106] hover:-translate-y-px active:translate-y-0"
          >
            Register Account
          </button>

          <div className="text-center mt-[22px] text-sm text-[#6b7280]">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-[#ee9310] font-semibold ml-1 no-underline transition-colors duration-200 hover:text-[#d88106] hover:underline"
            >
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}