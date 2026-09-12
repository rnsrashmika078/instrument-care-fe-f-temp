import React, { useEffect, useState } from "react";
import { API_BASE } from "../../config";

export default function AdminDashboardTechnicianViewStats() {
    const [data, setData] = useState([]);
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        fetchTopTechnicians();
    }, []);

    const fetchTopTechnicians = async () => {
        try {
            const res = await fetch(
                `${API_BASE}/admin/technician-view-count`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching technician stats:", error);
        }
    };

    // Get max value to scale bars
    const maxViews = Math.max(...data.map((d) => d.views), 1);

    return (
        <div className="rounded-[1.5rem] border border-orange-100 bg-white p-4 md:p-5">
            <h3 className="mb-5 text-lg font-bold text-gray-900">
                Top Most Viewed Technicians
            </h3>

            <div className="space-y-4">
                {data.map((tech) => {
                    const widthPercent = (tech.views / maxViews) * 100;

                    return (
                        <div key={tech.id} className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-3 text-sm text-gray-700">
                                <span className="font-semibold text-gray-800">
                                    {tech.technician_name}
                                </span>
                                <span className="text-xs font-medium text-orange-600">
                                    {tech.views} views
                                </span>
                            </div>

                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-orange-100">
                                <div
                                    className="h-full rounded-full bg-orange-500 transition-all duration-500"
                                    style={{ width: `${widthPercent}%` }}
                                    title={`ID: ${tech.id} | ${tech.views} views`}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}