import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Bg from "../../assets/images/hero-bg-5.jpg";
import ForgotImg from "../../assets/images/set-new-password.png";
import { API_BASE } from "../../config";

export default function SetNewPassword_ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address!");
      setMessage("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setMessage("");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/reset-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setError("");
        setMessage("Your password has been reset successfully!");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setMessage("");
        setError(result.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      setMessage("");
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center m-0 p-0">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${Bg})` }}
      ></div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col bg-gray-50 bg-opacity-90 shadow-2xl rounded-none md:rounded-2xl overflow-hidden transform -translate-y-[5vh] px-6 py-10 sm:px-12 sm:py-14">
        <div className="flex justify-center mb-4">
          <img
            src={ForgotImg}
            alt="Reset Password Illustration"
            className="w-80 h-80"
          />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-center">
          Reset password
        </h2>
        <p className="text-sm sm:text-md text-gray-500 mb-6 text-center">
          Please kindly set your new password.
        </p>

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

        {/* Email Input */}
        <div className="flex flex-col items-center mb-3 w-full">
          <input
            type="email"
            placeholder="e.g. username@kinety.com"
            className="w-lg mb-3 px-3 py-2 border rounded-md text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col items-center mb-3 w-full">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Set new password"
              className="w-lg px-3 py-2 border rounded-md text-sm pr-10"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="flex flex-col items-center mb-3 w-full">
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-lg px-3 py-2 border rounded-md text-sm pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="mt-1 text-xs text-red-500">
              Passwords do not match
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            className="w-lg bg-orange-400 text-white py-2 rounded-md text-md font-semibold hover:bg-orange-500 disabled:opacity-50"
            onClick={handleResetPassword}
            disabled={!email || !password || password !== confirmPassword}
          >
            Reset Password
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link to="/auth/login" className="text-sm text-blue-600 hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
