import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { API_BASE } from "../../config";
import ServiceRequestModal from "./ServiceRequestModal";
import { dateOnly, formatDate } from "../utils/format";
import {
  DateField,
  FilterSelect,
  IconButton,
  IdTag,
  RecordsBadge,
  SearchInput,
  StatusPill,
  TableCard,
  TableEmpty,
  TableHead,
  TableScroll,
  TableSkeleton,
  TableToolbar,
  Td,
  Th,
  Tr,
} from "../admin/TableUI";

const STATUS_OPTIONS = [
  { value: "All", label: "All Statuses" },
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Rejected", label: "Rejected" },
];

export default function AllServiceRequestTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const techId = sessionStorage.getItem("technician_id");
        if (!techId) {
          setError("Technician ID not found in local storage.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE}/user/service-request/${techId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch service requests");

        const data = await response.json();
        if (Array.isArray(data)) {
          setRequests(data);
        } else if (data && Array.isArray(data.requests)) {
          setRequests(data.requests);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load service requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const filteredRequests = requests.filter((request) => {
    const query = searchTerm.trim().toLowerCase();
    const haystack = [
      `SR/${request.id}`,
      `SR-${String(request.id).padStart(4, "0")}`,
      request.full_name,
      request.instrument_name,
      request.institute_name,
      request.physical_address,
      request.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !query || haystack.includes(query);
    const matchesStatus =
      statusFilter === "All" ||
      (request.status || "").toLowerCase() === statusFilter.toLowerCase();

    const requestDate = dateOnly(request.created_at);
    let matchesDate = true;
    if (startDate && (!requestDate || requestDate < startDate)) matchesDate = false;
    if (endDate && (!requestDate || requestDate > endDate)) matchesDate = false;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <>
      <TableCard>
        <TableHead
          title="All Service Requests"
          subtitle="Every request routed to you, across all statuses"
        />

        <TableToolbar>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by ID, client, instrument…"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
            className="sm:max-w-[10.5rem]"
          />
          <DateField label="From" value={startDate} onChange={setStartDate} />
          <DateField label="To" value={endDate} onChange={setEndDate} />
          <RecordsBadge count={filteredRequests.length} noun="requests" />
        </TableToolbar>

        {loading ? (
          <TableSkeleton rows={8} columns={6} />
        ) : error ? (
          <TableEmpty title="Unable to load requests" message={error} />
        ) : requests.length === 0 ? (
          <TableEmpty
            title="No service requests"
            message="Requests raised by clients will appear here once they are assigned to you."
          />
        ) : filteredRequests.length === 0 ? (
          <TableEmpty
            title="No matching requests"
            message="No requests match the current search, status or date range."
            hint="Try clearing the filters"
          />
        ) : (
          <TableScroll>
            <thead>
              <tr>
                <Th>Request</Th>
                <Th>Client</Th>
                <Th>Institute</Th>
                <Th>Instrument</Th>
                <Th>Requested On</Th>
                <Th>Location</Th>
                <Th>Status</Th>
                <Th align="center">Actions</Th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((request) => (
                <Tr key={request.id} onClick={() => setSelectedRequest(request)}>
                  <Td>
                    <IdTag prefix="SR-" value={String(request.id).padStart(4, "0")} />
                  </Td>
                  <Td>{request.full_name}</Td>
                  <Td>
                    <span className="text-gray-600">{request.institute_name || "—"}</span>
                  </Td>
                  <Td>
                    <span className="text-gray-600">{request.instrument_name}</span>
                  </Td>
                  <Td>
                    <span className="whitespace-nowrap text-xs text-gray-500">
                      {formatDate(request.created_at)}
                    </span>
                  </Td>
                  <Td>
                    <span className="block max-w-[180px] truncate text-gray-600">
                      {request.physical_address}
                    </span>
                  </Td>
                  <Td>
                    <StatusPill status={request.status} />
                  </Td>
                  <Td align="center">
                    <div className="flex items-center justify-center gap-1.5">
                      <IconButton
                        tone="blue"
                        icon={FaEye}
                        title="View Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                        }}
                      />
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableScroll>
        )}
      </TableCard>

      <ServiceRequestModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </>
  );
}
