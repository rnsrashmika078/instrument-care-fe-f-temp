import React from "react";
import { Link } from "react-router-dom";

export default function ServiceRequestTable_Request({ data, onView }) {
  // ✅ Filter only pending requests
  const pendingRequests = Array.isArray(data)
    ? data.filter((req) => req.status?.toUpperCase() === "PENDING")
    : [];

  return (
    <div className="bg-[#ffffff80] rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Pending Service Request</h3>
        <Link to="/tech/all-service-request">
          <button className="bg-orange-600 text-white px-4 py-1 rounded-md text-sm hover:bg-orange-400">
            View all
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Request ID</th>
              <th className="p-2">Client Name</th>
              <th className="p-2">Instrument Name</th>
              <th className="p-2">Request Date</th>
              <th className="p-2">Location</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          {/* </table> */}

          {/* Scrollable Body */}
          {/* <div className="max-h-[230px] overflow-y-auto"> */}
          {/* <table className="w-full text-sm text-left border-collapse"> */}
          <tbody>
            {pendingRequests.length > 0 ? (
              pendingRequests.map((req, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">SR/{req.id}</td>
                  <td className="p-2">{req.full_name}</td>
                  <td className="p-2">{req.instrument_name}</td>
                  <td className="p-2">{req.created_at}</td>
                  <td className="p-2">{req.physical_address}</td>
                  <td className="p-2">
                    <button
                      className="bg-orange-400 text-white px-4 py-1 rounded-md text-sm hover:bg-orange-300"
                      onClick={() => onView(req)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-3 text-gray-500">
                  No pending service requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    // </div>
  );
}
