import { fetchWithAuth } from "../utils/api";
import { API_BASE } from "../../config";
import React, { useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
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
    TableToolbar,
    Td,
    Th,
    Tr,
} from "./TableUI";

const STATUS_OPTIONS = [
    { value: "All", label: "All Statuses" },
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
];

export default function AdminAllServiceRequest({ requestsData }) {
  const token = sessionStorage.getItem("token");
  const initialRequests = requestsData || [];

  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      searchQuery === "" ||
      Object.values(req).some(
        (val) => val && String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
      || String("ID/" + req.id).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || req.status === statusFilter;

    let matchesDate = true;
    if (fromDate || toDate) {
      const dateStr = req.requestedOn || req.created_at;
      if (!dateStr) {
        matchesDate = false;
      } else {
        const reqDate = new Date(dateStr);
        if (fromDate) {
          const start = new Date(fromDate);
          start.setHours(0, 0, 0, 0);
          if (reqDate < start) matchesDate = false;
        }
        if (toDate) {
          const end = new Date(toDate);
          end.setHours(23, 59, 59, 999);
          if (reqDate > end) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  React.useEffect(() => {
    setRequests(requestsData || []);
  }, [requestsData]);

  const handleOpenModal = (request) => {
    setSelectedRequest({ ...request });
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedRequest((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSave = async () => {
    try {
      const response = await fetchWithAuth(
        `${API_BASE}/admin/service-request/${selectedRequest.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(selectedRequest),
        }
      );

      const result = await response.json();
      console.log(result);

      if (result.success) {
        toast.success("Service request updated successfully");
      }


      if (!response.ok) {
        toast.error(result.error || "Failed to update service request");
        return;
      }


      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id ? selectedRequest : req
        )
      );

      handleCloseModal();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong while updating");
    }
  };


  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service request?"
    );
    if (!confirmed) return;

    try {
      const response = await fetchWithAuth(
        `${API_BASE}/admin/service-request/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        toast.error(result.error || "Failed to delete service request");
        return;
      }

      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong while deleting");
    }
  };

  return (
    <>
      <TableCard>
        <TableHead
          title="Service Requests"
          subtitle="Every instrument request raised by clients"
        />

        <TableToolbar>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search requests…"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
            className="sm:max-w-[10.5rem]"
          />
          <DateField label="From" value={fromDate} onChange={setFromDate} />
          <DateField label="To" value={toDate} onChange={setToDate} />
          <RecordsBadge
            count={filteredRequests.length}
            noun="requests"
          />
        </TableToolbar>

        {filteredRequests.length === 0 ? (
          <TableEmpty
            title="No service requests"
            message="No requests match the current search, status or date range."
            hint="Try clearing the filters"
          />
        ) : (
          <TableScroll>
            <thead>
              <tr>
                <Th>Request</Th>
                <Th>Requester</Th>
                <Th>Technician</Th>
                <Th>Instrument</Th>
                <Th>Status</Th>
                <Th>Requested On</Th>
                <Th align="center">Actions</Th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((req, i) => (
                <Tr key={i} onClick={() => handleOpenModal(req)}>
                  <Td>
                    <IdTag value={`REQ-${String(req.id).padStart(4, "0")}`} />
                  </Td>
                  <Td>{req.requesterName}</Td>
                  <Td>{req.technicianName}</Td>
                  <Td>
                    <span className="text-gray-600">{req.instrument}</span>
                  </Td>
                  <Td>
                    <StatusPill status={req.status} />
                  </Td>
                  <Td>
                    <span className="whitespace-nowrap text-xs text-gray-500">
                      {req.requestedOn}
                    </span>
                  </Td>
                  <Td align="center">
                    <div className="flex items-center justify-center gap-1.5">
                      <IconButton
                        tone="blue"
                        icon={FaEye}
                        title="View / Edit Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(req);
                        }}
                      />
                      <IconButton
                        tone="red"
                        icon={FaTrash}
                        title="Delete Request"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(req.id);
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

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-b from-white to-orange-50/40 px-6 py-4">
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                Service Request Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                title="Close"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="grid flex-grow grid-cols-1 gap-5 overflow-y-auto p-6 md:grid-cols-2">
              {Object.entries(selectedRequest).map(([key, value]) => {
                const isReadOnly =
                  key === "id" || key === "created_at" || key === "updated_at" ||
                  key === "requesterName" || key === "technicianName" || key === "instrument" || key === "requestedOn";

                return (
                  <label key={key} className="flex flex-col gap-1.5 text-sm">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      {key.replace(/_/g, " ")}
                    </span>
                    <input
                      type="text"
                      name={key}
                      value={value ?? ""}
                      readOnly={isReadOnly}
                      onChange={handleChange}
                      className={`rounded-xl border px-3 py-2.5 outline-none transition ${
                        isReadOnly
                          ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                          : "border-gray-200 bg-white text-gray-700 focus:border-gray-400 focus:ring-4 focus:ring-gray-100"
                      }`}
                    />
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-orange-50/30 px-6 py-4">
              <button
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                onClick={handleCloseModal}
              >
                Close
              </button>

              <button
                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-600 active:scale-[0.98]"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
