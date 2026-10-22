import React from "react";
import { Link } from "react-router-dom";
import { FaInbox } from "react-icons/fa";

export default function ServiceRequestTable_Request({ data, onView }) {
  //  Filter only pending requests
  const pendingRequests = Array.isArray(data)
    ? data.filter((req) => req.status?.toUpperCase() === "PENDING")
    : [];

  const thClass = "p-3 text-xs font-semibold uppercase tracking-wide text-gray-600";
  const tdClass = "p-3 align-middle text-sm text-gray-700";

  return (
    <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 font-poppins">
      <div className="flex flex-wrap justify-between items-center gap-3 px-4 py-3 border-b border-gray-200">
        <div>
          <h3 className="font-bold text-lg text-gray-800">
            Pending Service Request
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {pendingRequests.length}{" "}
            {pendingRequests.length === 1 ? "request" : "requests"} awaiting a
            response
          </p>
        </div>
        <Link
          to="/tech/all-service-request"
          className="bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto rounded-b-lg">
        <table className="w-full min-w-[720px] text-left border-collapse">
          <thead className="bg-gray-100">
            <tr className="border-b border-gray-200">
              <th scope="col" className={thClass}>Request ID</th>
              <th scope="col" className={thClass}>Client Name</th>
              <th scope="col" className={thClass}>Instrument Name</th>
              <th scope="col" className={thClass}>Request Date</th>
              <th scope="col" className={thClass}>Location</th>
              <th scope="col" className={thClass}>Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((req, index) => (
                <tr
                  key={index}
                  className="hover:bg-orange-50 transition-colors"
                >
                  <td className={tdClass}>
                    <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      SR/{req.id}
                    </span>
                  </td>
                  <td className={`${tdClass} font-medium text-gray-800`}>
                    {req.full_name}
                  </td>
                  <td className={tdClass}>{req.instrument_name}</td>
                  <td className={`${tdClass} text-gray-500`}>
                    {req.created_at}
                  </td>
                  <td className={`${tdClass} max-w-[220px] truncate`}>
                    {req.physical_address}
                  </td>
                  <td className={tdClass}>
                    <button
                      type="button"
                      className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 active:bg-orange-700 transition-colors"
                      onClick={() => onView(req)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-10 text-center">
                  <FaInbox className="mx-auto text-3xl text-gray-300" />
                  <p className="mt-3 text-sm font-medium text-gray-600">
                    No pending service requests
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    New requests will appear here automatically.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
