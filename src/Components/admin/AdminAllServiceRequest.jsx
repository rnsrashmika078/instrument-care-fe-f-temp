import { fetchWithAuth } from '../utils/api';
import { API_BASE } from "../../config";
import React, { useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-orange-600";
      case "in progress":
        return "text-blue-600";
      case "cancelled":
      case "canceled":
        return "text-red-600";
      case "completed":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins min-h-[720px]">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h3 className="font-bold text-lg text-gray-800">
          All Service Requests
        </h3>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded outline-none focus:border-blue-500 sm:w-48 text-sm flex-grow sm:flex-grow-0"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded outline-none focus:border-blue-500 text-sm bg-white min-w-[130px] flex-grow sm:flex-grow-0"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">To</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <label className="font-semibold text-gray-700 bg-white px-3 py-2 rounded-md border text-sm shadow-sm shrink-0">Records: {filteredRequests.length}</label>

        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredRequests.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center">
            No service requests found.
          </p>
        ) : (
          <div className="max-h-[720px] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b bg-gray-100 text-gray-700">
                  <th className="p-3">Request ID</th>
                  <th className="p-3">Requester Name</th>
                  <th className="p-3">Technician Name</th>
                  <th className="p-3">Instrument Name</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Requested On</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((req, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-orange-50 transition-colors"
                  >
                    <td className="p-3">ID/{req.id}</td>
                    <td className="p-3">{req.requesterName}</td>
                    <td className="p-3">{req.technicianName}</td>
                    <td className="p-3">{req.instrument}</td>
                    <td
                      className={`p-3 font-semibold ${getStatusColor(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </td>
                    <td className="p-3">{req.requestedOn}</td>

                    <td className="p-3 flex gap-4 text-lg items-center h-full mt-1">
                      <FaEye
                        className="text-blue-500 hover:text-blue-700 transition transform hover:scale-110 cursor-pointer"
                        title="View / Edit Details"
                        size={18}
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(req); }}
                      />
                      <FaTrash
                        className="text-red-500 hover:text-red-700 transition transform hover:scale-110 cursor-pointer"
                        title="Delete Request"
                        size={18}
                        onClick={(e) => { e.stopPropagation(); handleDelete(req.id); }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white w-full max-w-4xl max-h-[85vh] rounded-lg shadow-xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-gray-100 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Service Request Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-800 transition text-2xl font-light"
                title="Close"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(selectedRequest).map(([key, value]) => {
                const isReadOnly =
                  key === "id" || key === "created_at" || key === "updated_at" ||
                  key === "requesterName" || key === "technicianName" || key === "instrument" || key === "requestedOn";

                return (
                  <label key={key} className="flex flex-col text-sm">
                    <span className="mb-1 font-semibold text-gray-600 capitalize tracking-wide">
                      {key.replace(/_/g, " ")}
                    </span>
                    <input
                      type="text"
                      name={key}
                      value={value ?? ""}
                      readOnly={isReadOnly}
                      onChange={handleChange}
                      className={`rounded px-3 py-2 border ${isReadOnly
                        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                        : "bg-white border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        }`}
                    />
                  </label>
                );
              })}
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                className="px-5 py-2 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
                onClick={handleCloseModal}
              >
                Close
              </button>

              <button
                className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-sm"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
