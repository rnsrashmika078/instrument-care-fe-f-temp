import React from "react";
import { CheckCircle } from "lucide-react"; // Icon
import whyUsBg from '../../assets/images/why-us-bg.jpg';
import techImage from '../../assets/images/hero-image-2.png';
import { Link, useNavigate } from "react-router-dom";

export default function WhyUs() {

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
      className="py-16 px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${whyUsBg})` }} // ✅ replace with your path
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Left Image */}
        <div className="flex-1">
          <img
            src= {techImage} // replace with your image path
            alt="Technician"
            className="rounded-xl w-full object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="flex-1">
          <span className="bg-orange-100 text-orange-500 text-xs font-semibold px-3 py-1 rounded-full">
            WHY US
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4">
            The Instrument Care advantage: <br className="hidden md:block" />
            reasons to trust our expertise
          </h2>
          <p className="text-gray-600 mb-6">
            Our open, positive, and proactive approach helps us find ways to
            align your work environment with the culture.
          </p>

          <ul className="space-y-4 mb-6">
            <li className="flex items-center text-gray-900 font-medium">
              <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
              Verified & Skilled Technicians
            </li>
            <li className="flex items-center text-gray-900 font-medium">
              <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
              Transparent & Secure Process
            </li>
            <li className="flex items-center text-gray-900 font-medium">
              <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
              Admin-Supported & Community Rated
            </li>
          </ul>

          <button 
            className="bg-orange-400 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-500 transition"
            onClick={handleFindTechnician}
          >
            Find Now →
          </button>
        </div>
      </div>
    </section>
  );
}
