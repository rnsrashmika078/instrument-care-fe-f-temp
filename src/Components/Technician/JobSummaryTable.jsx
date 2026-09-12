import React, { useState, useEffect } from "react";
import { API_BASE } from "../../config";
import { Link } from "react-router-dom";

export default function JobSummaryTable() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const techId = sessionStorage.getItem("technician_id");
        if (!techId) {
          console.error("Technician ID not found in sessionStorage");
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

        if (!response.ok) {
          throw new Error("Failed to fetch job summaries");
        }

        const data = await response.json();

        const transformedData = data.map((job) => [
          "SR/" + job.id,
          job.full_name,
          job.instrument_name,
          job.created_at,
          job.physical_address,
          job.status,
        ]);

        setJobs(transformedData);
      } catch (error) {
        console.error("Error fetching job summaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="bg-white border border-orange-200 rounded-2xl p-4 font-poppins">
      <div className="flex justify-between items-center mb-4 gap-3">
        <div>
          <h3 className="font-bold text-gray-800 text-base lg:text-lg">Job Summary</h3>
          <p className="text-xs text-gray-500 mt-1">Latest technician activity</p>
        </div>
        <Link to="/tech/all-job-summary">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs lg:text-sm font-medium border border-orange-500 hover:bg-orange-600 transition-colors duration-200">
            View all
          </button>
        </Link>
      </div>

      <div className="sm:hidden space-y-3 max-h-[188px] overflow-y-auto pr-1">
        {jobs.map((row, i) => (
          <div
            key={i}
            className="bg-orange-50 border border-orange-200 rounded-2xl p-4 transition-colors duration-200"
          >
            <div className="flex justify-between items-center mb-2 gap-2">
              <span className="font-bold text-orange-600 text-xs">{row[0]}</span>
              <span
                className={`text-[10px] font-semibold px-2 py-1 rounded-full
            ${row[5] === "Completed" ? "bg-green-100 text-green-700" :
                    row[5] === "Rejected" ? "bg-red-100 text-red-700" :
                      row[5] === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        row[5] === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}
          `}
              >
                {row[5]}
              </span>
            </div>

            <div className="text-[11px] text-gray-700 space-y-1">
              <p><span className="font-semibold text-gray-800">Client:</span> {row[1]}</p>
              <p><span className="font-semibold text-gray-800">Instrument:</span> {row[2]}</p>
              <p>
                <span className="font-semibold text-gray-800">Date:</span>{" "}
                {new Date(row[3]).toLocaleDateString()}
              </p>
              <p className="truncate">
                <span className="font-semibold text-gray-800">Location:</span> {row[4]}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 italic p-4 text-center">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center">
            No job summaries found.
          </p>
        ) : (
          <div className="max-h-[188px] overflow-y-auto rounded-xl border border-orange-200">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="sticky top-0 bg-orange-100">
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
                {jobs.map((row, i) => (
                  <tr key={i} className="border-b border-orange-100 hover:bg-orange-50 transition-colors duration-200">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`p-3 text-xs sm:text-sm truncate max-w-[140px] ${
                          cell === "Pass"
                            ? "text-green-600 font-bold"
                            : cell === "Rejected"
                              ? "text-red-600 font-bold"
                              : cell === "Pending"
                                ? "text-yellow-600 font-bold"
                                : cell === "In Progress"
                                  ? "text-blue-600 font-bold"
                                  : cell === "Completed"
                                    ? "text-green-600 font-bold"
                                    : "text-gray-700"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
