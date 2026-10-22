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

export default function TechnicianViewAndActive() {
    const token = sessionStorage.getItem("token");
    const [searchTerm, setSearchTerm] = useState("");

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchWithAuth(
                    `${API_BASE}/admin/tech-view-active`,
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

        fetchData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredData = tableData.filter((data) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            searchTerm === "" ||
            String(data.technician_user_id).toLowerCase().includes(term) ||
            String("Tech/" + data.technician_id).toLowerCase().includes(term) ||
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

    function timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();

        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);

        const minute = 60;
        const hour = 60 * minute;
        const day = 24 * hour;
        const month = 30 * day;
        const year = 365 * day;

        if (diffSec < minute) {
            return "just now";
        } else if (diffSec < hour) {
            return Math.floor(diffSec / minute) + " minutes ago";
        } else if (diffSec < day) {
            return Math.floor(diffSec / hour) + " hours ago";
        } else if (diffSec < month) {
            return Math.floor(diffSec / day) + " days ago";
        } else if (diffSec < year) {
            return Math.floor(diffSec / month) + " months ago";
        } else {
            if (Math.floor(diffSec / year) <= 55) {
                return Math.floor(diffSec / year) + " years ago";
            }
            return "long time ago";
        }
    }

    return (
        <TableCard>
            <TableHead
                title="Technician Views & Activity"
                subtitle="Profile views and last sign-in for each technician"
            />

            <TableToolbar>
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search technicians…"
                />
                <RecordsBadge count={filteredData.length} noun="technicians" />
            </TableToolbar>

            {loading ? (
                <TableSkeleton rows={6} columns={4} />
            ) : filteredData.length === 0 ? (
                <TableEmpty
                    title="No activity yet"
                    message="Technician profile views and last logins will appear here as soon as there is activity."
                />
            ) : (
                <TableScroll>
                    <thead>
                        <tr>
                            <Th>Technician</Th>
                            <Th align="right">Total Views</Th>
                            <Th>Last Login</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((data, i) => (
                            <Tr key={i}>
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
                                <Td align="right">
                                    <Metric value={data.total_searches} />
                                </Td>
                                <Td>
                                    <span className="whitespace-nowrap text-xs text-gray-500">
                                        {data.last_login
                                            ? timeAgo(data.last_login)
                                            : "Never"}
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
                noun="technicians"
            />
        </TableCard>
    );
}
