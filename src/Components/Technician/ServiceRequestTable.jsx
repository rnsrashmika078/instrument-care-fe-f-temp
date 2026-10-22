import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { API_BASE } from "../../config";
import ServiceRequestModal from "./ServiceRequestModal";
import { formatDate } from "../utils/format";
import {
  ActionButton,
  IconButton,
  IdTag,
  StatusPill,
  TableCard,
  TableEmpty,
  TableHead,
  TableScroll,
  TableSkeleton,
  Td,
  Th,
  Tr,
} from "../admin/TableUI";

export default function ServiceRequestTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const token = sessionStorage.getItem("token");

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
        let allRequests = [];

        if (Array.isArray(data)) {
          allRequests = data;
        } else if (data && Array.isArray(data.requests)) {
          allRequests = data.requests;
        }

        setRequests(allRequests.filter((r) => r.status?.toLowerCase() === "pending"));
      } catch (err) {
        console.error(err);
        setError("Failed to load service requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  return (
    <>
      <div>
        <TableCard>
          <TableHead
            title="Pending Service Requests"
            subtitle="Review and manage new client requests"
            actions={
              <Link to="/tech/all-service-request">
                <ActionButton>View all</ActionButton>
              </Link>
            }
          />

          {loading ? (
            <TableSkeleton rows={5} columns={6} />
          ) : error ? (
            <TableEmpty title="Unable to load requests" message={error} />
          ) : requests.length === 0 ? (
            <TableEmpty
              title="No pending requests"
              message="New client requests will appear here as soon as they are raised."
              hint="Nothing waiting on you"
            />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <TableScroll maxHeight="max-h-[320px]">
                  <thead>
                    <tr>
                      <Th>Request</Th>
                      <Th>Client</Th>
                      <Th>Instrument</Th>
                      <Th>Requested On</Th>
                      <Th>Location</Th>
                      <Th>Status</Th>
                      <Th align="center">Actions</Th>
                    </tr>
                  </thead>

                  <tbody>
                    {requests.map((request) => (
                      <Tr key={request.id} onClick={() => setSelectedRequest(request)}>
                        <Td>
                          <IdTag prefix="SR-" value={String(request.id).padStart(4, "0")} />
                        </Td>
                        <Td>{request.full_name}</Td>
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
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className="border-2 border-gray-200 rounded-xl p-4 bg-white hover:bg-orange-50/50 cursor-pointer transition-colors space-y-2"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <IdTag prefix="SR-" value={String(request.id).padStart(4, "0")} />
                      <StatusPill status={request.status} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{request.full_name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{request.instrument_name}</p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span><span className="font-medium">Requested:</span> {formatDate(request.created_at)}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      <span className="font-medium">Location:</span> {request.physical_address}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(request);
                      }}
                      className="w-full mt-2 bg-blue-500 text-white text-xs py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </TableCard>
      </div>

      <ServiceRequestModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </>
  );
}
