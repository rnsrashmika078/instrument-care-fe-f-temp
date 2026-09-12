import React from "react";
import { NavLink, useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { API_BASE } from "../../config";
export default function Tabs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("user_id");

  const handleViewProfile = async () => {

    try {
      const res = await fetch(
        `${API_BASE}/tech/user_id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      const technician_user_id = data.user_id;

      const payload = {
        client_id: userId,
        technician_id: technician_user_id,
        search_term: null,
      };

      await fetch(
        `${API_BASE}/user/dashboard/search`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
    } catch (error) {
      console.error("Tracking error:", error);
    }

    navigate(`/user/view-profile/${id}`);
  };

  const tabs = [
    { label: <ArrowLeft className="w-5 h-5" />, action: () => navigate(`/user/dashboard`) },
    { label: "Profile", action: handleViewProfile },
    { label: "Request a Service", action: () => navigate(`/user/service-request/${id}`) },
    { label: "My Request History", action: () => navigate(`/user/service-history/${id}`) },
  ];

  return (
    <div className="flex gap-6 border-b mb-4 cursor-pointer">
      {tabs.map((tab, index) => {
        const isActive =
          (index === 1 && location.pathname.includes("view-profile")) ||
          (index === 2 && location.pathname.includes("service-request")) ||
          (index === 3 && location.pathname.includes("service-history"));

        return (
          <button
            key={index}
            onClick={tab.action}
            className={`pb-2 transition ${isActive
              ? "font-bold text-black border-b-4 border-black"
              : "text-gray-600 hover:text-black"
              }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}