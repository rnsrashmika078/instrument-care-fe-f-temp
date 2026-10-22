import React, { useEffect, useState } from "react";
import { API_BASE } from "../../config";
import { ChartEmptyState } from "../admin/ChartStates";
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const STAT_META = [
  { label: "Total Services", key: "total", icon: ClipboardDocumentListIcon },
  { label: "Pending Services", key: "Pending", icon: ClockIcon },
  { label: "Completed Services", key: "Completed", icon: CheckCircleIcon },
];

const CARD =
  "flex min-h-[120px] md:min-h-[140px] flex-col justify-center rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-5 text-gray-800 shadow-sm hover:shadow-md transition border-2 border-gray-200";

function StatCardSkeleton() {
  return (
    <div className={CARD}>
      <div className="mb-3 md:mb-4 h-10 w-10 md:h-12 md:w-12 animate-pulse rounded-xl bg-orange-200/70" />
      <div className="h-7 md:h-8 w-14 md:w-16 animate-pulse rounded-md bg-orange-100" />
      <div className="mt-2 h-3 w-28 md:w-32 animate-pulse rounded bg-orange-100" />
    </div>
  );
}

export default function DashboardStats({ technicianId }) {
  const token = sessionStorage.getItem("token");

  const [stats, setStats] = useState({
    total: 0,
    Pending: 0,
    Completed: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = technicianId || sessionStorage.getItem("technician_id");

    if (!id) {
      setError("Technician ID not found");
      setLoading(false);
      return;
    }

    const fetchJobCounts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE}/service-request/${id}/job-counts`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch job counts");

        const data = await response.json();
        const jobCounts = data.job_counts || {};

        setStats({
          total: jobCounts.total || 0,
          Pending: jobCounts.Pending || 0,
          Completed: jobCounts.Completed || 0,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobCounts();
  }, [technicianId, token]);

  if (error) {
    return (
      <div>
        <ChartEmptyState
          icon={ExclamationTriangleIcon}
          title="Stats unavailable"
          message={error}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {loading
        ? [0, 1, 2].map((i) => <StatCardSkeleton key={i} />)
        : STAT_META.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.key} className={CARD}>
                <div className="mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-sm">
                  <Icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stats[stat.key]}</div>
                <div className="mt-1 text-xs md:text-sm font-medium uppercase tracking-wider text-orange-600">
                  {stat.label}
                </div>
              </div>
            );
          })}
    </div>
  );
}
