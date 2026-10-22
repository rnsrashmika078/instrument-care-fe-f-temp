import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { API_BASE } from "../../config";
import {
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

function Metric({ value }) {
    const n = Number(value) || 0;
    return (
        <span className="inline-flex min-w-[2.25rem] items-center justify-center rounded-lg bg-orange-50 px-2 py-1 text-sm font-bold tabular-nums text-orange-700 ring-1 ring-inset ring-gray-100">
            {n}
        </span>
    );
}

export default function TechnicianSearchRequests() {
    const token = sessionStorage.getItem("token");
    const [searchTerm, setSearchTerm] = useState("");

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchSearchTerm = async () => {
            try {
                const response = await fetchWithAuth(
                    `${API_BASE}/admin/tech-search-requests`,
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
                console.error("Failed to fetch log data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchTerm();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredData = tableData.filter((data) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            searchTerm === "" ||
            String(data.technician_user_id).toLowerCase().includes(term) ||
            String("Tech/" + data.technician_user_id)
                .toLowerCase()
                .includes(term) ||
            (data.technician_name &&
                data.technician_name.toLowerCase().includes(term));

        return matchesSearch;
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
                title="Technician Search Requests"
                subtitle="Profile searches compared with service requests raised"
            />

            <TableToolbar>
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search technicians…"
                />
                <RecordsBadge
                    count={filteredData.length}
                    noun="technicians"
                />
            </TableToolbar>

            {loading ? (
                <TableSkeleton rows={6} columns={4} />
            ) : filteredData.length === 0 ? (
                <TableEmpty
                    title="No search data yet"
                    message="Technician search and request counts will be ranked here once clients start browsing."
                />
            ) : (
                <TableScroll>
                    <thead>
                        <tr>
                            <Th>Technician</Th>
                            <Th align="right">Views</Th>
                            <Th align="right">Service Requests</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((data, i) => (
                            <Tr key={i}>
                                <Td>
                                    <div className="flex flex-col gap-0.5">
                                        <IdTag
                                            prefix="Tech/"
                                            value={data.technician_user_id}
                                        />
                                        <span className="text-xs text-gray-500">
                                            {data.technician_name || "—"}
                                        </span>
                                    </div>
                                </Td>
                                <Td align="right">
                                    <Metric value={data.search_count} />
                                </Td>
                                <Td align="right">
                                    <Metric value={data.service_request_count} />
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
                noun="technicians"
            />
        </TableCard>
    );
}
