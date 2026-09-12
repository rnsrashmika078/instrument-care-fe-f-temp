import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Bg from "../../assets/images/hero-bg-5.jpg";
import ForgotImg from "../../assets/images/fp-email-verifying.png"; // add your illustration here

export default function EmailSend_ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  
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
          Check your email!
        </h2>

        <p className="text-sm sm:text-md text-gray-500 mb-6 text-center">
          Thanks! An email was sent that will ask you to click on a link to verify that you own this account. <br/>If you don't get the email, please contact support@nsf.gov.lk
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


        {/* Submit Button (shorter height) */}
        <div className="flex justify-center">
          <Link 
            to='https://mail.google.com/'
            target="_blank"
            rel="noopener noreferrer">
            <button
                className="w-lg bg-orange-400 text-white py-2 rounded-md text-md font-semibold hover:bg-orange-500"
            >
                Open Email Inbox
            </button>
          </Link>
        </div>


        {/* Back to Login */}
        <div className="mt-4 text-center">
          <Link to="/auth/email-entry-forgot-password" className="text-sm text-blue-600 hover:underline">
            ← Resend Email
          </Link>
        </div>
      </div>
    </div>
  );
}
