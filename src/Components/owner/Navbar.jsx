import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, LayoutDashboard, Home, LogOut, ClipboardList, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import NationalLogo from "../../assets/images/national-logo.jpg";
import NsfLogo from "../../assets/images/NSF-Logo.jpg";
import profileImage from "../../assets/images/profile-image.jpeg";
import { useNavigate } from "react-router-dom";
import { doFullLogout } from "../auth/Logout";
import { assetUrl } from "../utils/api";
import { HOME_BASE, API_BASE } from "../../config";

// Shared button treatments so every action in the bar reads the same way:
// one solid primary, one neutral outline, one quiet text button.
const primaryBtn =
  "inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 font-poppins whitespace-nowrap";
const outlineBtn =
  "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 font-poppins whitespace-nowrap";
const menuLink =
  "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-gray-900";

export default function Navbar() {
  const navigate = useNavigate();

  const isTechnician = Number(sessionStorage.getItem("role")) === 10;

  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPicture, setUserPicture] = useState("");

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

  const handleLogout = async () => {
    // Logs out of both inst-care AND the instrument (CodeIgniter) session.
    doFullLogout();
  };

  const avatar = (userPicture && assetUrl(userPicture)) || profileImage;

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: brand */}
          <button
            type="button"
            onClick={() => navigate("/user/dashboard")}
            className="flex flex-shrink-0 items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            aria-label="Go to dashboard"
          >
            <img src={NationalLogo} alt="National Logo" className="h-10 w-auto sm:h-12" />
            <img src={NsfLogo} alt="NSF Logo" className="h-8 w-auto sm:h-10" />
            <span className="ml-1 hidden border-l border-gray-200 pl-3 text-lg font-extrabold leading-tight text-gray-900 font-poppins lg:block">
              Instrument Care
            </span>
          </button>

          {/* Right: desktop actions */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <Link
              to="/user/my-request"
              onClick={() => setUserOpen(false)}
              className={primaryBtn}
            >
              <ClipboardList className="h-4 w-4" />
              My Request
            </Link>

            {/* Switch back to technician view (only for technician accounts) */}
            {isTechnician && (
              <button
                type="button"
                onClick={() => navigate("/tech/dashboard")}
                className={outlineBtn}
              >
                <Wrench className="h-4 w-4" />
                Tech View
              </button>
            )}

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserOpen(!userOpen)}
                aria-expanded={userOpen}
                aria-haspopup="menu"
                className="flex max-w-[220px] items-center gap-2 rounded-full border border-gray-300 py-1 pl-1 pr-3 transition hover:bg-gray-50"
              >
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-100 object-cover"
                />
                <span className="truncate text-sm font-medium text-gray-800">
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

          {/* Mobile: avatar + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <img
              src={avatar}
              alt="Profile"
              className="h-9 w-9 rounded-full bg-gray-100 object-cover"
            />
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 transition hover:bg-gray-50"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {menuOpen && (
          <div className="border-t border-gray-200 py-3 md:hidden">
            <div className="mb-3 flex items-center gap-3">
              <img
                src={avatar}
                alt="Profile"
                className="h-10 w-10 rounded-full bg-gray-100 object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {userName || "User"}
                </p>
                {userEmail && (
                  <p className="truncate text-xs text-gray-500">{userEmail}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                to="/user/my-request"
                onClick={() => setMenuOpen(false)}
                className={primaryBtn + " justify-center"}
              >
                <ClipboardList className="h-4 w-4" />
                My Request
              </Link>

              <a
                href={`${HOME_BASE}/home`}
                onClick={() => setMenuOpen(false)}
                className={outlineBtn + " justify-center"}
              >
                <Home className="h-4 w-4" />
                NID Home
              </a>

              {!isTechnician && (
                <a
                  href={`${HOME_BASE}/dashboard`}
                  onClick={() => setMenuOpen(false)}
                  className={outlineBtn + " justify-center"}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  NID Dashboard
                </a>
              )}

              {isTechnician && (
                <button
                  type="button"
                  onClick={() => {
                    navigate("/tech/dashboard");
                    setMenuOpen(false);
                  }}
                  className={outlineBtn + " justify-center"}
                >
                  <Wrench className="h-4 w-4" />
                  Tech View
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 font-poppins"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
