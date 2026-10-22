import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CircleUser, Wrench, History } from "lucide-react";
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

  const navTabs = [
    {
      key: "profile",
      label: "Profile",
      icon: CircleUser,
      match: "view-profile",
      action: handleViewProfile,
    },
    {
      key: "request",
      label: "Request a Service",
      icon: Wrench,
      match: "service-request",
      action: () => navigate(`/user/service-request/${id}`),
    },
    {
      key: "history",
      label: "Request History",
      icon: History,
      match: "service-history",
      action: () => navigate(`/user/service-history/${id}`),
    },
  ];

  return (
    <div className="sticky top-16 z-20  border-b border-gray-200 bg-white p-2">
      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={() => navigate("/user/dashboard")}
          aria-label="Back to dashboard"
          title="Back to dashboard"
          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-orange-50 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <span aria-hidden="true" className="h-6 w-px shrink-0 bg-gray-200" />

        <div
          role="tablist"
          aria-label="Technician sections"
          className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1"
        >
          {navTabs.map((tab) => {
            const isActive = location.pathname.includes(tab.match);
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={tab.action}
                title={tab.label}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:bg-white/70 hover:text-gray-900"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-orange-600" : "text-gray-400"}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
