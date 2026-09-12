import { fetchWithAuth } from '../utils/api';
import React, { useEffect, useState } from "react";
import { API_BASE } from "../../config";
import { Link } from "react-router-dom";
import profileImage from '../../assets/images/profile-image.jpeg';

export default function Admin_Sidebar() {
  const [avatarSrc, setAvatarSrc] = useState(profileImage);
  const [fullName, setFullName] = useState("System Administrator");
  const [designation, setDesignation] = useState("System Administrator");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) return;

        const token = sessionStorage.getItem("token");

        const res = await fetch(
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

  return (
    <aside className="w-full rounded-[1.75rem] border border-orange-100 bg-white p-4 text-black lg:w-72 lg:flex-shrink-0">
      <div className="flex flex-col items-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-orange-200 bg-orange-50">
          <img
            src={avatarSrc}
            alt="Profile"
            className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900">{fullName}</h2>
          <p className="mt-1 text-sm text-gray-600">{designation}</p>
        </div>

        <div className="my-5 h-px w-full bg-orange-100" />

        <nav className="flex w-full flex-col gap-3">
          <Link to="/admin/dashboard">
            <button className="w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100">
              Dashboard
            </button>
          </Link>

          <Link to="/admin/technicians">
            <button className="w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100">
              Technicians
            </button>
          </Link>

          <Link to="/admin/instrument">
            <button className="w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100">
              Instruments
            </button>
          </Link>

          <Link to="/admin/service-requests">
            <button className="w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100">
              Service Requests
            </button>
          </Link>

          <Link to="/admin/statistics">
            <button className="w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100">
              Statistics
            </button>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
