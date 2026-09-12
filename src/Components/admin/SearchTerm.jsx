import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/api";
import { API_BASE } from "../../config";

export default function SearchTerm() {
    const token = sessionStorage.getItem("token");
    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [showOnlyValidTerms, setShowOnlyValidTerms] = useState(false);

    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    useEffect(() => {
        fetchSearchTerm();
    }, []);

    // Reset to page 1 when search filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, fromDate, toDate]);

    const filteredData = tableData.filter((data) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            searchTerm === "" ||
            String(data.id).toLowerCase().includes(term) ||
            (data.search_term && data.search_term.toLowerCase().includes(term)) ||
            String("Client/" + data.client_id).toLowerCase().includes(term) ||
            (data.client_name && data.client_name.toLowerCase().includes(term)) ||
            String("Tech/" + data.technician_id).toLowerCase().includes(term) ||
            (data.technician_name && data.technician_name.toLowerCase().includes(term));


        let withinDateRange = true;
        if (fromDate || toDate) {
            const dataDate = new Date(data.searched_at);
            if (fromDate) {
                withinDateRange = withinDateRange && dataDate >= new Date(fromDate);
            }
            if (toDate) {
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999);
                withinDateRange = withinDateRange && dataDate <= to;
            }
        }
        const hasValidSearchTerm =
            !showOnlyValidTerms ||
            (data.search_term && data.search_term.trim() !== "");

        return matchesSearch && withinDateRange && hasValidSearchTerm;
    });

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    const fetchSearchTerm = async () => {
        try {
            const response = await fetchWithAuth(`${API_BASE}/admin/view-search-term`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            setTableData(data);
        } catch (error) {
            console.error('Failed to fetch search term log data:', error);
        }
    };

    return (
        <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins min-h-[720px]">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h3 className="font-bold text-lg text-gray-800 w-full md:w-auto">All Search Term Logs</h3>

                <div className="flex flex-col xl:flex-row gap-4 w-full md:w-auto items-center">
                    <input
                        type="text"
                        placeholder="Search by ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full xl:w-64 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />

                    <div className="flex items-center gap-2 w-full xl:w-auto">
                        <span className="text-sm text-gray-500 whitespace-nowrap">From:</span>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 w-full"
                        />
                        <span className="text-sm text-gray-500 whitespace-nowrap">To:</span>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 w-full"
                        />
                    </div>
                    <button
                        onClick={() => setShowOnlyValidTerms(prev => !prev)}
                        className="bg-orange-500 text-white px-3 py-2 rounded-md text-sm shadow-sm shrink-0"
                    >
                        {showOnlyValidTerms ? "Show All Logs" : "All Search Terms"}
                    </button>

                    <label className="font-semibold text-gray-700 bg-white px-3 py-2 rounded-md border text-sm shadow-sm shrink-0">Records: {filteredData.length}</label>

                </div>
            </div>

            <div className="overflow-x-auto">
                {filteredData.length === 0 ? (
                    <p className="text-gray-500 italic p-4 text-center">
                        No data found matching your criteria.
                    </p>
                ) : (
                    <div className="max-h-[720px] overflow-y-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-100 text-gray-700">
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Client ID</th>
                                    <th className="p-3">Client Name</th>
                                    <th className="p-3">Technician ID</th>
                                    <th className="p-3">Technician Name</th>
                                    <th className="p-3">Search Term</th>
                                    <th className="p-3">Searched At</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentRecords.map((data, i) => (
                                    <tr
                                        key={i}
                                        className="border-b hover:bg-orange-50 transition-colors"
                                    >
                                        <td className="p-3">{data.id}</td>
                                        <td className="p-3">Client/{data.client_id}</td>
                                        <td className="p-3">{data.client_name}</td>
                                        <td className="p-3">Tech/{data.technician_id}</td>
                                        <td className="p-3">{data.technician_name}</td>
                                        <td className="p-3">{data.search_term}</td>
                                        <td className="p-3">{data.searched_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 border-t pt-4">
                    <span className="text-sm text-gray-600">
                        Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredData.length)} of {filteredData.length} entries
                    </span>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm font-medium text-gray-700 mx-2">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
