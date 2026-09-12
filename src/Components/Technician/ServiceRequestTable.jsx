import React, { useEffect, useState } from "react";
import { API_BASE } from "../../config";
import { Link } from "react-router-dom";

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

        const response = await fetch(
          `${API_BASE}/user/service-request/${techId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch service requests");

        const data = await response.json();
        let allRequests = [];

        if (Array.isArray(data)) {
          allRequests = data;
        } else if (data && Array.isArray(data.requests)) {
          allRequests = data.requests;
        }

        const pendingRequests = allRequests.filter(
          (r) => r.status?.toLowerCase() === "pending"
        );

        setRequests(pendingRequests);
      } catch (err) {
        console.error(err);
        setError("Failed to load service requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const handleRowClick = (request) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };


  return (
    <div className="bg-white border border-orange-200 rounded-2xl p-4 mb-6 font-poppins min-h-[288px]">
      <div className="flex justify-between items-center mb-4 gap-3">
        <div>
          <h3 className="font-bold text-gray-800 text-base lg:text-lg">Pending Service Requests</h3>
          <p className="text-xs text-gray-500 mt-1">Review and manage new client requests</p>
        </div>
        <Link to="/tech/all-service-request">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs lg:text-sm font-medium border border-orange-500 hover:bg-orange-600 transition-colors duration-200">
            View all
          </button>
        </Link>
      </div>
      <div className="mb-3">
        <p className="text-gray-500 italic text-xs lg:text-sm">*Please click on a row to view more details</p>
      </div>

      {/* mobile */}
      <div className="sm:hidden space-y-3 max-h-[288px] overflow-y-auto pr-1">
        {requests.map((request) => (
          <div
            key={request.id}
            onClick={() => handleRowClick(request)}
            className="bg-orange-50 border border-orange-200 rounded-2xl p-4 cursor-pointer transition-colors duration-200 hover:bg-orange-100"
          >
            <div className="flex justify-between items-center mb-2 gap-2">
              <span className="font-bold text-orange-600 text-xs">
                SR/{request.id}
              </span>
              <span className="text-[10px] font-semibold text-orange-700 bg-orange-200 px-2 py-1 rounded-full">
                {request.status}
              </span>
            </div>

            <div className="text-[11px] text-gray-700 space-y-1">
              <p><span className="font-semibold text-gray-800">Client:</span> {request.full_name}</p>
              <p><span className="font-semibold text-gray-800">Instrument:</span> {request.instrument_name}</p>
              <p>
                <span className="font-semibold text-gray-800">Date:</span>{" "}
                {new Date(request.created_at).toLocaleDateString()}
              </p>
              <p className="truncate">
                <span className="font-semibold text-gray-800">Location:</span> {request.physical_address}
              </p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 italic p-4 text-center">
          Loading service requests...
        </p>
      ) : error ? (
        <p className="text-red-500 italic p-4 text-center">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500 italic p-4 text-center">
          No pending service requests found.
        </p>
      ) : (
        <div className="hidden sm:block overflow-x-auto max-h-[288px] overflow-y-auto rounded-xl border border-orange-200">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-orange-100 sticky top-0">
              <tr>
                <th className="p-3 font-semibold text-gray-700 text-left">Request ID</th>
                <th className="p-3 font-semibold text-gray-700 text-left">Client Name</th>
                <th className="p-3 font-semibold text-gray-700 text-left">Instrument Name</th>
                <th className="p-3 font-semibold text-gray-700 text-left">Request Date</th>
                <th className="p-3 font-semibold text-gray-700 text-left">Location</th>
                <th className="p-3 font-semibold text-gray-700 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-orange-100 cursor-pointer hover:bg-orange-50 transition-colors duration-200"
                  onClick={() => handleRowClick(request)}
                >
                  <td className="p-3 truncate max-w-[150px] text-gray-700">SR/{request.id}</td>
                  <td className="p-3 truncate max-w-[150px] text-gray-700">{request.full_name}</td>
                  <td className="p-3 truncate max-w-[150px] text-gray-700">{request.instrument_name}</td>
                  <td className="p-3 truncate max-w-[150px] text-gray-700">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 truncate max-w-[150px] text-gray-700">{request.physical_address}</td>
                  <td className="p-3">
                    <span className="inline-flex rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"
            onClick={closeModal}
          />

          <div className="bg-white border border-orange-200 w-11/12 max-w-4xl p-6 z-10 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                Service Request Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 font-bold text-3xl leading-none transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="overflow-x-auto max-h-[70vh] rounded-xl border border-orange-100">
              <table className="w-full text-left text-sm border-collapse">
                <tbody>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Request ID</td>
                    <td className="p-3 text-gray-800 break-words text-xs lg:text-base">SR/{selectedRequest.id}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Client Name</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.full_name}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Email</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.email}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Address</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.physical_address}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Contact Number</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.contact_number}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Institute Name</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.institute_name}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Institute Address</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.institute_address}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Instrument Name</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.instrument_name}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Instrument Brand</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.instrument_brand}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Instrument Model</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.instrument_model}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Instrument Manufacturer</td>
                    <td className="p-3 text-gray-800">{selectedRequest.instrument_manufacturer}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Manufactured Year</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.manufactured_year}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Product Testing Type</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.product_testing_type}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Testing Parameter</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.testing_parameter}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Consumption Period</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.consumption_period}</td>
                  </tr>
                  <tr className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="p-3 font-semibold text-gray-700 w-1/3 bg-orange-50 text-xs lg:text-base">Problem Description</td>
                    <td className="p-3 text-xs lg:text-base text-gray-800">{selectedRequest.issue_description}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={closeModal}
                className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
