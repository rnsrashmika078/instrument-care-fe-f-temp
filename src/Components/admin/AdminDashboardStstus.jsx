import { fetchWithAuth } from '../utils/api';
import React, { useState, useEffect } from "react";
import { API_BASE } from "../../config";
import { UsersIcon, WrenchScrewdriverIcon, CubeIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export default function AdminDashboardStats({ technicianId }) {
  const token = sessionStorage.getItem("token");
  const [stats, setStats] = useState([
    { label: "Owners", value: 0, icon: UsersIcon, color: "from-orange-400 to-orange-300" },
    { label: "Technicians", value: 0, icon: WrenchScrewdriverIcon, color: "from-orange-400 to-orange-300" },
    { label: "Instruments", value: 0, icon: CubeIcon, color: "from-orange-400 to-orange-300" },
    { label: "Service Requests", value: 0, icon: ClipboardDocumentCheckIcon, color: "from-orange-400 to-orange-300" },
  ]);

  // 🔥 Fetch dashboard stats from backend
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/admin/dashboard`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );
        const data = await response.json();

        // ✅ Update all dashboard values from backend response
        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.label === "Owners") {
              return { ...stat, value: data.owner_count || 0 };
            }

            if (stat.label === "Technicians") {
              return { ...stat, value: data.technician_count || 0 };
            }

            if (stat.label === "Instruments") {
              return { ...stat, value: data.instrument_count || 0 };
            }

            if (stat.label === "Service Requests") {
              return { ...stat, value: data.service_request_count || 0 };
            }

            return stat;
          })
        );
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="flex min-h-[148px] flex-col justify-center rounded-[1.5rem] border border-orange-100 bg-orange-50 p-5 text-gray-800 transition hover:border-orange-200"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="mt-1 text-sm font-medium uppercase tracking-[0.18em] text-orange-600">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
