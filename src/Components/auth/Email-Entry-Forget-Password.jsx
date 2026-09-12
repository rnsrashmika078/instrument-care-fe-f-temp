import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Bg from "../../assets/images/hero-bg-5.jpg";
import ForgotImg from "../../assets/images/fp-email-sending.webp"; // add your illustration here
import { API_BASE } from "../../config";

export default function EmailEntry_ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleForgotPassword = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/email-entry-forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      console.log("Forgot Password Response:", result);

      if (response.ok) {
        setError("");
        setMessage("Password reset link has been sent to your email!");
      } else {
        setMessage("");
        setError(result.message || "Something went wrong!");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage("");
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center m-0 p-0">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${Bg})` }}
      ></div>

      {/* Main Container - SAME SIZE AS LOGIN */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col bg-gray-50 bg-opacity-90 shadow-2xl rounded-none md:rounded-2xl overflow-hidden transform -translate-y-[5vh] px-6 py-10 sm:px-12 sm:py-14">
        
        {/* Top Illustration */}
        <div className="flex justify-center mb-4">
          <img 
            src={ForgotImg} 
            alt="Forgot Password Illustration" 
            className="w-70 h-70"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-center">
          Forgot your password?
        </h2>

        <p className="text-sm sm:text-md text-gray-500 mb-6 text-center">
          Enter your email so we can send you a password reset link.
        </p>

        {/* 🔹 Success / Error Messages */}
        {message && (
          <div className="mb-4 p-2 text-sm text-green-700 bg-green-100 border border-green-400 rounded-md text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md text-center">
            {error}
          </div>
        )}

        {/* Email Input (shorter height) */}
        <div className="flex justify-center">
            <input
                type="email"
                placeholder="e.g. username@kinety.com"
                className="w-lg mb-3 px-3 py-2 border rounded-md text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>


        {/* Submit Button (shorter height) */}
        <div className="flex justify-center">
            <Link to='/auth/email-send-forgot-password'>
                <button
                    className="w-lg bg-orange-400 text-white py-2 rounded-md text-md font-semibold hover:bg-orange-500"
                    onClick={handleForgotPassword}
                >
                    Send Email
                </button>
            </Link>
        </div>


        {/* Back to Login */}
        <div className="mt-4 text-center">
          <Link to="/auth/login" className="text-sm text-blue-600 hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
