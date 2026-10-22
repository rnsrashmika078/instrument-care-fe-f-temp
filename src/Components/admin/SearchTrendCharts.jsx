import { useEffect, useState } from "react";
import { SearchX } from "lucide-react";
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

export default function SearchTrendsChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        fetch(`${API_BASE}/admin/view-search-count-hourly`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (active) setData(Array.isArray(res) ? res : []);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    // count comes back from MySQL COUNT(*) as a string, so coerce it before
    // it reaches the value axis.
    const chartData = data.map((row) => ({
        ...row,
        count: Number(row.count) || 0,
    }));

    // Rows that all sit at zero would still draw an empty grid, so treat
    // that the same as no rows at all.
    const hasData = chartData.some((row) => row.count > 0);

    return (
        <div className="rounded-[1.5rem] border border-gray-200 bg-white p-4 md:p-5">
            <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                    Search Trends (Hourly)
                </h3>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                    Live
                </span>
            </div>

            {loading ? (
                <ChartSkeleton height="h-64" />
            ) : !hasData ? (
                <ChartEmptyState
                    icon={SearchX}
                    title="No searches recorded yet"
                    message="Technician search activity will appear here hour by hour. Nothing has been logged so far."
                />
            ) : (
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 8, right: 8, bottom: 4, left: -20 }}
                        >
                            <defs>
                                <linearGradient
                                    id="searchTrendBar"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop offset="0%" stopColor="#fb923c" />
                                    <stop offset="100%" stopColor="#ea580c" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                stroke="#f3f4f6"
                                strokeDasharray="5 5"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="hour"
                                tick={{ fontSize: 11 }}
                                stroke="#9ca3af"
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 11 }}
                                stroke="#9ca3af"
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
                                dataKey="count"
                                fill="url(#searchTrendBar)"
                                radius={[8, 8, 0, 0]}
                                maxBarSize={28}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
