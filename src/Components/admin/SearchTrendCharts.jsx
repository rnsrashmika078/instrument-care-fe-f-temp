import { useEffect, useState } from "react";
import { API_BASE } from "../../config";

export default function SearchTrendsChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(
            `${API_BASE}/admin/view-search-count-hourly`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            }
        )
            .then((res) => res.json())
            .then((res) => setData(res))
            .catch((err) => console.error(err));
    }, []);

    const maxCount = Math.max(...data.map((d) => d.count), 1);

    return (
        <div className="rounded-[1.5rem] border border-orange-100 bg-white p-4 md:p-5">
            <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                    Search Trends (Hourly)
                </h3>
                <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-600">
                    Live
                </span>
            </div>

            <div className="flex h-64 items-end gap-3 overflow-x-auto pb-2">
                {data.map((item, index) => {
                    const heightPercent = (item.count / maxCount) * 100;

                    return (
                        <div
                            key={index}
                            className="flex min-w-[40px] flex-col items-center justify-end"
                        >
                            <span className="mb-1 text-[10px] font-medium text-gray-600">
                                {item.count}
                            </span>

                            <div className="flex h-48 w-6 items-end overflow-hidden rounded-xl bg-orange-100">
                                <div
                                    className="w-full rounded-xl bg-orange-500 transition-all duration-500"
                                    style={{ height: `${heightPercent}%` }}
                                    title={`${item.search_term}`}
                                ></div>
                            </div>

                            <span className="mt-2 text-[10px] text-gray-500">
                                {item.hour || item.search_term?.slice(0, 6)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}