import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { API_BASE } from "../../config";
import {
    DateField,
    IdTag,
    Pagination,
    RecordsBadge,
    SearchInput,
    TableCard,
    TableEmpty,
    TableHead,
    TableScroll,
    TableSkeleton,
    TableToolbar,
    Td,
    Th,
    Tr,
} from "./TableUI";

const RECORDS_PER_PAGE = 10;

export default function SearchTerm() {
    const token = sessionStorage.getItem("token");
    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [showOnlyValidTerms, setShowOnlyValidTerms] = useState(false);

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchSearchTerm = async () => {
            try {
                const response = await fetchWithAuth(
                    `${API_BASE}/admin/view-search-term`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setTableData(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch search term log data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchTerm();
    }, []);

    // Reset to page 1 when search filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, fromDate, toDate, showOnlyValidTerms]);

    const filteredData = tableData.filter((data) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            searchTerm === "" ||
            String(data.id).toLowerCase().includes(term) ||
            (data.search_term && data.search_term.toLowerCase().includes(term)) ||
            String("Client/" + data.client_id).toLowerCase().includes(term) ||
            (data.client_name &&
                data.client_name.toLowerCase().includes(term)) ||
            String("Tech/" + data.technician_id).toLowerCase().includes(term) ||
            (data.technician_name &&
                data.technician_name.toLowerCase().includes(term));

        let withinDateRange = true;
        if (fromDate || toDate) {
            const dataDate = new Date(data.searched_at);
            if (fromDate) {
                withinDateRange =
                    withinDateRange && dataDate >= new Date(fromDate);
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

    const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
    const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
    const currentRecords = filteredData.slice(
        indexOfFirstRecord,
        indexOfLastRecord
    );
    const totalPages = Math.ceil(filteredData.length / RECORDS_PER_PAGE);

    return (
        <TableCard>
            <TableHead
                title="Search Term Logs"
                subtitle="Every search typed by clients and technicians"
            />

            <TableToolbar>
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search term, client or technician…"
                />
                <DateField label="From" value={fromDate} onChange={setFromDate} />
                <DateField label="To" value={toDate} onChange={setToDate} />
                <button
                    type="button"
                    onClick={() => setShowOnlyValidTerms((prev) => !prev)}
                    className={`shrink-0 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition active:scale-[0.98] ${
                        showOnlyValidTerms
                            ? "border-orange-500 bg-orange-500 text-white shadow-sm shadow-orange-200"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    {showOnlyValidTerms ? "Showing terms only" : "Show terms only"}
                </button>
                <RecordsBadge count={filteredData.length} noun="logs" />
            </TableToolbar>

            {loading ? (
                <TableSkeleton rows={8} columns={5} />
            ) : filteredData.length === 0 ? (
                <TableEmpty
                    title="No search activity"
                    message="No search terms have been logged yet, or none match the current filters."
                />
            ) : (
                <TableScroll>
                    <thead>
                        <tr>
                            <Th>Client</Th>
                            <Th>Technician</Th>
                            <Th>Search Term</Th>
                            <Th>Searched At</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((data, i) => (
                            <Tr key={i}>
                                <Td>
                                    <div className="flex flex-col gap-0.5">
                                        <IdTag
                                            prefix="Client/"
                                            value={data.client_id}
                                        />
                                        <span className="text-xs text-gray-500">
                                            {data.client_name || "—"}
                                        </span>
                                    </div>
                                </Td>
                                <Td>
                                    <div className="flex flex-col gap-0.5">
                                        <IdTag
                                            prefix="Tech/"
                                            value={data.technician_id}
                                        />
                                        <span className="text-xs text-gray-500">
                                            {data.technician_name || "—"}
                                        </span>
                                    </div>
                                </Td>
                                <Td>
                                    {data.search_term ? (
                                        <span className="inline-flex max-w-[16rem] truncate rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-gray-100">
                                            {data.search_term}
                                        </span>
                                    ) : (
                                        <span className="text-xs italic text-gray-300">
                                            Empty term
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    <span className="whitespace-nowrap text-xs text-gray-500">
                                        {data.searched_at || "—"}
                                    </span>
                                </Td>
                            </Tr>
                        ))}
                    </tbody>
                </TableScroll>
            )}

            <Pagination
                page={currentPage}
                totalPages={totalPages}
                total={filteredData.length}
                onPage={setCurrentPage}
                noun="logs"
            />
        </TableCard>
    );
}
