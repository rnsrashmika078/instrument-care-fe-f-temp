import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import { API_BASE } from "../../config";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChartEmptyState, ChartSkeleton } from "./ChartStates";

export default function AdminDashboardTechnicianViewStats() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        let active = true;

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
                if (active) setData(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error("Error fetching technician stats:", error);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchTopTechnicians();

        return () => {
            active = false;
        };
    }, []);

    const hasData = data.some((row) => Number(row.views) > 0);

    return (
        <div className="flex flex-col rounded-[1.5rem] border border-gray-200 bg-white p-4 md:p-5">
            <h3 className="mb-5 text-lg font-bold text-gray-900">
                Top Most Viewed Technicians
            </h3>

            {loading ? (
                <ChartSkeleton height="h-[300px]" />
            ) : !hasData ? (
                <ChartEmptyState
                    icon={Inbox}
                    title="No technician views yet"
                    message="Once clients start viewing technician profiles, the top ten will be ranked here."
                />
            ) : (
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
                        >
                            <defs>
                                <linearGradient
                                    id="techViewsBar"
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                >
                                    <stop offset="0%" stopColor="#fb923c" />
                                    <stop offset="100%" stopColor="#ea580c" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                stroke="#f3f4f6"
                                strokeDasharray="5 5"
                                horizontal={false}
                            />
                            <XAxis
                                type="number"
                                allowDecimals={false}
                                tick={{ fontSize: 11 }}
                                stroke="#9ca3af"
                            />
                            <YAxis
                                type="category"
                                dataKey="technician_name"
                                width={130}
                                tick={{ fontSize: 12, fill: "#374151" }}
                                stroke="#9ca3af"
                                tickFormatter={(value) =>
                                    value?.length > 18
                                        ? `${value.slice(0, 18)}…`
                                        : value
                                }
                            />
                            <Tooltip
                                cursor={{ fill: "#fff7ed" }}
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                }}
                            />
                            <Bar
                                dataKey="views"
                                fill="url(#techViewsBar)"
                                radius={[0, 8, 8, 0]}
                                barSize={18}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
