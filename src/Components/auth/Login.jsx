import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Bg from "../../assets/images/index11.jpg";
import { API_BASE } from "../../config";

const FEATURES = [
  "Join our network of skilled professionals",
  "Access instrument service requests",
  "Build your reputation with verified work",
];

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      // console.log("Login data:", loginData);
      const result = await response.json();
      // console.log("Login Response:", result);

      if (result.message === "Login successful") {
        setError("");

        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("role", String(result.role));
        sessionStorage.setItem("user_id", String(result.id));
        sessionStorage.setItem("technician_id", String(result.technician_id));
        sessionStorage.setItem("token", result.token);

        if (
          result.role === 8 ||
          result.role === 9 ||
          result.role === 7 ||
          result.role === 6 ||
          result.role === 5 ||
          result.role === 4 ||
          result.role === 3 ||
          result.role === 2
        ) {
          navigate("/user/dashboard");
        } else if (result.role === 10) {
          navigate("/tech/dashboard");
        } else if (result.role === 1) {
          navigate("/admin/dashboard");
        } else {
          setError("Unauthorized role!");
        }
      } else {
        setError("Invalid username or password!");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again!");
    }
  };

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const inputClass =
    "w-full h-12 px-3.5 pl-[42px] rounded-[9px] border-[1.5px] border-[#e5e7eb] bg-white text-[14.5px] text-[#111827] placeholder:text-[#9ca3af] placeholder:text-sm focus:outline-none focus:border-[#ee9310] focus:ring-[3.5px] focus:ring-[rgba(238,147,16,0.22)] transition-all duration-200";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="w-full max-w-[1020px] bg-white rounded-[18px] overflow-hidden border border-black/5 shadow-[0_16px_45px_rgba(0,0,0,0.07),0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col md:flex-row">
          {/* Left - Brand Showcase Panel */}
          <div className="relative md:w-5/12 min-h-[180px] md:min-h-[560px] flex flex-col justify-center md:justify-end px-5 sm:px-9 py-6 md:py-12 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${Bg})` }}
            ></div>
            <div
              className="absolute inset-0 z-[1] bg-black/80"
           
            ></div>

            <div className="relative z-[2]">
              <span
                className="inline-flex items-center px-3.5 py-1.5 mb-4 md:mb-5 rounded-full text-xs font-bold uppercase tracking-[0.5px] text-white border border-white/35"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                Join Our Team
              </span>
              <h2 className="text-white text-2xl md:text-[30px] font-extrabold leading-[1.25] mb-3.5 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                Become a Technician
              </h2>
              <p className="text-white/90 text-sm leading-relaxed mb-6">
                Register as a certified technician and provide expert instrument maintenance and repair services to research facilities nationwide.
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

              <Link
                to="/auth/tech-registration"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#111827] text-[14px] font-bold rounded-lg hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 no-underline"
              >
                Register as Technician
                <svg
                  className="ml-2 w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>

          {/* Right - Form Panel */}
          <div className="md:w-7/12 bg-white flex flex-col justify-center px-5 sm:px-8 lg:px-11 py-8 md:min-h-[560px]">
            <div className="mb-6">
              <h1 className="text-[27px] font-bold text-[#111827] mb-1.5 tracking-tight">
                Technician & Client Login
              </h1>
              <p className="text-[14.5px] text-[#6b7280]">
                Welcome back! Sign in to access your technician or client dashboard.
              </p>
            </div>

            {/* Important Notice */}
            <div className="bg-[#fef9c3] border-2 border-red-500 rounded-xl p-3 sm:p-4 flex flex-col items-center text-center mb-5">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900">
                Important
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed mt-2">
                This login is for <b>Technicians</b> and <b>Clients</b> registered with the{" "}
                <b>National Instrument Database (NID)</b>. Use your existing{" "}
                <b>NID username</b> and <b>password</b> to sign in. No need to
                create a new account.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 p-3 rounded-lg text-[13.5px] text-[#991b1b] bg-[#fef2f2] border-l-4 border-[#ef4444]">
                {error}
              </div>
            )}

            {/* Email / Username Field */}
            <div className="mb-[18px]">
              <label className="block text-[13.5px] font-semibold text-[#111827] mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-[#9ca3af] pointer-events-none flex items-center justify-center z-[4] transition-colors duration-200">
                  <svg
                    width="18"
                    height="18"
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
                </span>
                <input
                  type="text"
                  name="username"
                  placeholder="name@example.com"
                  autoComplete="username"
                  value={loginData.username}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-[18px]">
              <label className="block text-[13.5px] font-semibold text-[#111827] mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-[#9ca3af] pointer-events-none flex items-center justify-center z-[4] transition-colors duration-200">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={loginData.password}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className={inputClass + " pr-11"}
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#9ca3af] p-2 rounded-md cursor-pointer flex items-center justify-center z-[4] transition-colors duration-200 hover:text-[#ee9310] hover:bg-[rgba(238,147,16,0.08)] focus:text-[#ee9310] focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between gap-2 mb-[22px]">
              <Link
                to="/auth/user-registration"
                className="text-[13.5px] font-semibold text-[#ee9310] no-underline transition-colors duration-200 hover:text-[#d88106] hover:underline"
              >
                If you don't have account? SIGN UP
              </Link>
              <Link
                to="/auth/email-entry-forgot-password"
                className="text-[13.5px] font-semibold text-[#ee9310] no-underline transition-colors duration-200 hover:text-[#d88106] hover:underline"
              >
                Forget Your Password?
              </Link>
            </div>

            <button
              onClick={handleLogin}
              className="w-full h-12 rounded-[9px] bg-[#ee9310] border-none text-white text-[15px] font-semibold tracking-[0.3px] cursor-pointer transition-all duration-250 shadow-[0_4px_12px_rgba(238,147,16,0.28)] hover:bg-[#d88106] hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(238,147,16,0.38)] active:translate-y-0"
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
