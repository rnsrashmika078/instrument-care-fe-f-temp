import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Home, LayoutDashboard, LogOut, Monitor } from "lucide-react";
import NationalLogo from "../../assets/images/national-logo.jpg";
import NsfLogo from "../../assets/images/NSF-Logo.jpg";
import profileImage from "../../assets/images/profile-image.jpeg";
import { doFullLogout } from "../auth/Logout";
import { assetUrl } from "../utils/api";
import { HOME_BASE, API_BASE } from "../../config";

// Same treatments as the owner navbar so both views read as one product.
const primaryBtn =
  "inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 font-poppins whitespace-nowrap";
const menuLink =
  "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-gray-900";

export default function Navbar() {
  const navigate = useNavigate();
  const [userOpen, setUserOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPicture, setUserPicture] = useState("");

  // Technicians work in the Instrument Care portal, so they get no Dashboard
  // entry in this dropdown. Everyone else (supervisors, staff who reached the
  // tech portal) gets the role-aware instrument/dashboard entry, matching the
  // navbar_v2.php dropdown in the instrument app.
  const isTechnician = Number(sessionStorage.getItem("role")) === 10;

  useEffect(() => {
    const userId = sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");
    if (!userId) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/user/profile/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();
        if (fullName) setUserName(fullName);
        if (data.email) setUserEmail(data.email);
        // picture_url is authoritative: it keeps remote (Cloudinary) URLs
        // intact, where the API's `picture` field is re-written to a local
        // path that does not exist for cloud-hosted images.
        if (data.picture_url || data.picture) setUserPicture(data.picture_url || data.picture);
      } catch (err) {
        console.error("Failed to load user name", err);
      }
    })();
  }, []);

  const handleLogout = () => {
    doFullLogout();
  };

  const avatar = (userPicture && assetUrl(userPicture)) || profileImage;

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* LEFT: brand */}
          <button
            type="button"
            onClick={() => navigate("/user/dashboard")}
            className="flex flex-shrink-0 items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            aria-label="Go to dashboard"
          >
            <img src={NationalLogo} alt="National Logo" className="h-9 w-auto sm:h-12" />
            <img src={NsfLogo} alt="NSF Logo" className="h-7 w-auto sm:h-10" />
            <span className="ml-1 hidden border-l border-gray-200 pl-3 text-lg font-extrabold leading-tight text-gray-900 font-poppins sm:block">
              Instrument Care
            </span>
          </button>

          {/* RIGHT: Client View + user menu */}
          <div className="flex items-center gap-2 sm:gap-3 sm:flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/user/dashboard")}
              className={primaryBtn}
            >
              <Monitor className="h-4 w-4" />
              Client View
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setUserOpen(!userOpen)}
                aria-expanded={userOpen}
                aria-haspopup="menu"
                className="flex max-w-[200px] items-center gap-2 rounded-full border border-gray-300 py-1 pl-1 pr-3 transition hover:bg-gray-50"
              >
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-100 object-cover"
                />
                <span className="hidden truncate text-sm font-medium text-gray-800 sm:block">
                  {userName || "User"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-gray-500 transition-transform ${
                    userOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg font-poppins">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {userName || "User"}
                      </p>
                      {userEmail && (
                        <p className="truncate text-xs text-gray-500">{userEmail}</p>
                      )}
                    </div>

                    <a
                      href={`${HOME_BASE}/home`}
                      onClick={() => setUserOpen(false)}
                      className={menuLink}
                    >
                      <Home className="h-4 w-4 text-gray-400" />
                      NID Home
                    </a>

                    {!isTechnician && (
                      <a
                        href={`${HOME_BASE}/dashboard`}
                        onClick={() => setUserOpen(false)}
                        className={menuLink}
                      >
                        <LayoutDashboard className="h-4 w-4 text-gray-400" />
                        NID Dashboard
                      </a>
                    )}

                    {/* "My Request" only exists in the client view, which uses
                       the owner navbar - this admin/technician navbar must not
                       offer it. */}

                    <div className="my-1 border-t border-gray-100" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
