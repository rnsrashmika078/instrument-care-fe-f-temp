import React, { useEffect, useState } from "react";
import { API_BASE } from "../../config";

export default function DashboardStats({ technicianId }) {
  const token = sessionStorage.getItem("token");

  const [stats, setStats] = useState([
    { label: "Total Services", value: 0 },
    { label: "Pending Services", value: 0 },
    { label: "Completed Services", value: 0 },
  ]);

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

        const response = await fetch(
          `${API_BASE}/service-request/${id}/job-counts`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch job counts");

        const data = await response.json();
        const jobCounts = data.job_counts || {};

        setStats([
          { label: "Total Services", value: jobCounts["total"] || 0 },
          { label: "Pending Services", value: jobCounts["Pending"] || 0 },
          { label: "Completed Services", value: jobCounts["Completed"] || 0 },
        ]);
      } catch (err) {
        console.error(err);
        setError("Failed to load stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobCounts();
  }, [technicianId]);

  if (loading)
    return <div className="text-center py-4 text-sm">Loading stats...</div>;

  if (error)
    return <div className="text-center py-4 text-red-500 text-sm">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-2 sm:px-0 mb-5">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-orange-50 border border-orange-200 rounded-2xl p-4 sm:p-5 text-center font-semibold"
        >
          <div className="text-2xl sm:text-3xl font-bold mb-1 text-orange-600">
            {stat.value}
          </div>
          <div className="text-sm sm:text-base text-gray-700">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}