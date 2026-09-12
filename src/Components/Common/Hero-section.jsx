import React from "react";
import { Link, useNavigate } from "react-router-dom";
import heroBg from "../../assets/images/hero-bg-5.jpg"; // ✅ import image

export default function Hero() {
  const navigate = useNavigate();

  const handleFindTechnician = () => {
    const userId = sessionStorage.getItem("user_id");
    if (userId) {
      navigate("/user/dashboard");
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-20"
      style={{ backgroundImage: `url(${heroBg})` }} // ✅ use imported image
    >
      {/* Centered Content Layer */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center text-center space-y-10 font-poppins">
        <span className="bg-orange-200 text-orange-500 text-sm font-semibold px-3 py-1 rounded-full inline-block">
          READY TO FIND YOUR TECHNICIAN
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight font-poppins">
          Your Instruments Deserve the Best Care.
        </h1>
        <p className="text-gray-600 text-lg font-poppins">
          Find certified technicians, track your repairs, and ensure your scientific instruments perform at their best all in one platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleFindTechnician}
            className="bg-orange-500 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-400 transition"
          >
            Find a Technician
          </button>
          <Link to="/auth/login">
            <button className="bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
