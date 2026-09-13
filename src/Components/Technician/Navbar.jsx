import React from "react";
import NationalLogo from "../../assets/images/national-logo.jpg";
import NsfLogo from "../../assets/images/NSF-Logo.jpg";
import { HOME_BASE } from "../../config";
import { doFrontendLogout } from "../auth/Logout";

export default function Navbar() {
  const handleLogout = () => {
    doFrontendLogout();
    window.location.href = HOME_BASE;
  };

  return (
    <nav className="w-full bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          {/* LEFT: Logos */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src={NationalLogo}
              alt="National Logo"
              className="h-8 sm:h-10 md:h-12"
            />
            <img src={NsfLogo} alt="NSF Logo" className="h-7 sm:h-9 md:h-10" />
          </div>

          {/* CENTER: Title */}
          <h1 className="text-sm sm:text-xl md:text-3xl font-bold md:font-extrabold text-gray-900 font-poppins text-center flex-1 truncate">
            Instrument Care
          </h1>

          {/* RIGHT: Logout */}
          <div className="shrink-0">
            <button
              onClick={handleLogout}
              className="bg-orange-500 text-white px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm rounded-md font-medium hover:bg-orange-600 transition"
            >
              Logout
            </button>
          </div>

          {/* LEFT: Hamburger (mobile only) */}
        </div>
      </div>
    </nav>
  );
}