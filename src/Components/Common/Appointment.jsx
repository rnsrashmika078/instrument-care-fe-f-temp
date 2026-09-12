import React from "react";
import AppointmentBg from '../../assets/images/appointment-bg.jpg';
import { Link, useNavigate } from "react-router-dom";

export default function AppointmentSection() {

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
      className="relative bg-cover bg-center bg-no-repeat py-24 px-6 text-center"
      style={{
        backgroundImage: `url(${AppointmentBg})`, // Replace with your image path
      }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-xs z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <span className="text-xs font-semibold font-poppins uppercase text-amber-600 bg-orange-200 rounded-full px-4 py-1 inline-block mb-4 tracking-wide">
          Appointment
        </span>
        <h2 className="text-amber-600 text-6xl sm:text-7xl font-semibold leading-tight mb-4 font-poppins">
          Need a Repair ? <br/>Book a Technician in Minutes!
        </h2>
        <p className="text-gray-700 text-base sm:text-lg mb-8 font-poppins">
          {/* Schedule your service with us today and experience <br className="hidden sm:block" />
          quality handyman solutions! */}
          Start your repair process quickly and easily with trusted professionals at your fingertips.
        </p>
        <button 
          className="inline-flex items-center justify-center px-6 py-3 bg-orange-200 text-[#FF8356] font-poppins rounded-lg font-semibold hover:opacity-90 transition hover:bg-orange-600 hover:text-white"
          onClick={handleFindTechnician}
        >
          Find a Technician
          <span className="ml-2 text-lg">➝</span>
        </button>
      </div>
    </section>
  );
}
