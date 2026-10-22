import { fetchWithAuth } from '../utils/api';
import React, { useEffect, useState } from "react";
import { API_BASE } from "../../config";
import { Link, useLocation } from "react-router-dom";
import profileImage from '../../assets/images/profile-image.jpeg';

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/technicians", label: "Technicians" },
  { to: "/admin/instrument", label: "Instruments" },
  { to: "/admin/service-requests", label: "Service Requests" },
  { to: "/admin/statistics", label: "Statistics" },
];

const activeBtnClass =
  "bg-orange-500 text-white font-semibold px-4 py-2.5 rounded-xl w-48 transition-colors duration-200 hover:bg-orange-600";
const inactiveBtnClass =
  "bg-orange-50 border border-gray-200 text-orange-700 font-semibold px-4 py-2.5 rounded-xl w-48 transition-colors duration-200 hover:bg-orange-100";

export default function Admin_Sidebar() {
  const { pathname } = useLocation();
  const [avatarSrc, setAvatarSrc] = useState(profileImage);
  const [fullName, setFullName] = useState("System Administrator");
  const [designation, setDesignation] = useState("System Administrator");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) return;

        const token = sessionStorage.getItem("token");

        const res = await fetchWithAuth(
          `${API_BASE}/admin/profile/${userId}`,
          {
            method: "GET",
            headers: token
              ? {
                  "Accept": "application/json",
                  "Authorization": `Bearer ${token}`
                }
              : { "Accept": "application/json" },
          }
        );

        if (!res.ok) {
          console.warn("Failed to fetch sidebar profile:", res.status);
          return;
        }

        const data = await res.json();

        if (data.profile_image_url) {
          setAvatarSrc(data.profile_image_url);
        }
        if (data.first_name) setFullName(data.first_name + " " + data.last_name);
        if (data.designation) setDesignation(data.designation);
      } catch (err) {
        console.error("Error loading profile for sidebar:", err);
      }
    };

    loadProfile();
  }, []);

  const isActive = (to) =>
    to === "/admin/dashboard"
      ? pathname === to
      : pathname.startsWith(to);

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full p-4 font-poppins bg-white border-r border-gray-200">
      <div className="flex flex-col items-center">
        {/* Close button — mobile only */}
        <button
          className="md:hidden self-end mb-2 text-gray-600 hover:text-gray-900 text-2xl leading-none"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>

        <div className="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center mb-4 overflow-hidden bg-gray-100">
          <img
            src={avatarSrc}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>

        <h2 className="text-lg font-bold text-gray-800 text-center">{fullName}</h2>
        <p className="text-sm text-gray-600">{designation}</p>

        <hr className="w-full border-gray-200 my-4" />

        <nav className="flex flex-col items-center space-y-3 w-full">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              aria-current={isActive(item.to) ? "page" : undefined}
            >
              <button
                className={
                  isActive(item.to) ? activeBtnClass : inactiveBtnClass
                }
              >
                {item.label}
              </button>
            </Link>
          ))}
        </nav>
      </div>

      <div className="bg-gray-50 border border-gray-200 text-gray-700 rounded-2xl p-4 text-sm mt-6">
        <p className="font-bold mb-2 text-center text-orange-700">Contact System Admin</p>
        <div className="flex items-start mb-2">
          <span className="mt-0.5">📞</span>
          <span className="ml-2 block">
            +94 (0)11 2 696771
            <br />
            Ext: 191, 126
          </span>
        </div>
        <div className="flex items-center">
          <span>✉️</span> <span className="ml-2">nid@nsf.gov.lk</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Hamburger button — mobile only ── */}
      <button
        className="md:hidden fixed top-15 left-4 z-50 bg-white border border-gray-200 text-orange-500 rounded-xl p-2"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 bg-orange-500 mb-1"></span>
        <span className="block w-5 h-0.5 bg-orange-500 mb-1"></span>
        <span className="block w-5 h-0.5 bg-orange-500"></span>
      </button>

      {/* ── Backdrop — mobile only ── */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white z-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent />
      </div>

      {/* ── Desktop sidebar (always visible, sticky so it doesn't scroll) ── */}
      <aside className="hidden md:flex bg-white border border-gray-200 text-black rounded-2xl w-64 flex-shrink-0 flex-col justify-between font-poppins overflow-hidden self-start sticky top-[76px] max-h-[calc(100vh-84px)]">
        <SidebarContent />
      </aside>
    </>
  );
}
