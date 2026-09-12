import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Bg from '../../assets/images/hero-bg-5.jpg';
import { API_BASE } from "../../config";

export default function EmailVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(""); 
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Get userId from navigation state
  const { userId, email } = location.state || {};

  useEffect(() => {
    if (!userId) {
      // If no userId, redirect back to login/register
      navigate("/auth/login");
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [userId, navigate]);

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) document.getElementById(`otp-${index + 1}`).focus();
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

      const result = await response.json();
      console.log("Email Verification Response:", result);

      if (result.message === "Verification successful") {
        setError("");
        navigate("/auth/login");
      } else {
        setError("Invalid OTP. Please try again!");
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setError("Something went wrong. Please try again!");
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center m-0 p-0">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${Bg})` }}></div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row bg-gray-50 bg-opacity-90 shadow-2xl rounded-none md:rounded-2xl overflow-hidden transform -translate-y-[5vh]">
        
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-6 sm:px-10 md:px-16 md:py-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center md:text-left">
            Verify Your Email
          </h2>

          <p className="text-sm sm:text-md text-gray-500 mb-4 text-center">
            Enter the 6-digit code sent to your email to continue.
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md text-center">
              {error}
            </div>
          )}

          <div className="flex justify-between mb-6 gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 sm:w-14 h-14 text-center text-xl border rounded-md focus:outline-orange-400"
              />
            ))}
          </div>

          <button
            className="w-full bg-orange-400 text-white py-3 rounded-md text-lg font-semibold hover:bg-orange-500"
            onClick={handleVerifyEmail}
          >
            VERIFY EMAIL
          </button>
        </div>

        <div className="hidden md:flex w-1/2 flex-col justify-center items-center px-12 text-white"
             style={{ background: "linear-gradient(135deg, #e78f0c, #e78f0c)", borderTopLeftRadius: "60px", borderBottomLeftRadius: "60px" }}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Need Help?</h2>
          <p className="text-lg text-center mb-8">
            Didn't receive the code? Check your spam folder or request a new verification code.
          </p>
          <Link to="/auth/login">
            <button className="border border-white px-8 py-2 rounded-md hover:bg-white hover:text-orange-600 transition text-lg font-semibold">
              BACK TO LOGIN
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
