import { TrendingUp } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { ChartEmptyState, ChartSkeleton } from "./ChartStates";

export default function AdminDashboardLineChart({ data, loading = false }) {
    const rows = Array.isArray(data) ? data : [];
    const hasData = rows.some((row) => Number(row.count) > 0);

    return (
        <section className="flex flex-col rounded-[1.5rem] border border-gray-200 bg-white p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                    Service Requests Overview
                </h2>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                    Daily
                </span>
            </div>

            {loading ? (
                <ChartSkeleton height="h-[300px]" />
            ) : !hasData ? (
                <ChartEmptyState
                    icon={TrendingUp}
                    title="No service requests yet"
                    message="Daily request volume will be plotted here as soon as requests start coming in."
                />
            ) : (
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={rows}
                            margin={{ top: 10, right: 12, bottom: 10, left: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="serviceRequestLine"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#fb923c"
                                        stopOpacity={0.28}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#fb923c"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                stroke="#f3f4f6"
                                strokeDasharray="5 5"
                            />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                stroke="#6b7280"
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 12 }}
                                stroke="#6b7280"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#f97316"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#f97316" }}
                                activeDot={{ r: 6, fill: "#ea580c" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}
