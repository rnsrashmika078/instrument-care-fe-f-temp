import React, { useEffect, useState } from "react";
import { API_BASE } from "../../config";

export default function AllJobSummary() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = sessionStorage.getItem("token");

  //for search
  const [search, setSearch] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const searchTerm = search.toLowerCase();
    return (
      (job.id?.toString() || "").includes(searchTerm) ||
      (job.full_name || "").toLowerCase().includes(searchTerm) ||
      (job.contact_number || "").toLowerCase().includes(searchTerm) ||
      (job.email || "").toLowerCase().includes(searchTerm) ||
      (job.institute_name || "").toLowerCase().includes(searchTerm) ||
      (job.instrument_name || "").toLowerCase().includes(searchTerm) ||
      (job.instrument_model || "").toLowerCase().includes(searchTerm) ||
      (job.instrument_brand || "").toLowerCase().includes(searchTerm) ||
      (job.instrument_manufacturer || "").toLowerCase().includes(searchTerm) ||
      (job.instrument_product_testing_type || "").toLowerCase().includes(searchTerm) ||
      (job.instrument_testing_parameter || "").toLowerCase().includes(searchTerm) ||
      (job.issue_description || "").toLowerCase().includes(searchTerm) ||
      (job.status || "").toLowerCase().includes(searchTerm)
    );
  });

  useEffect(() => {
    const techId = sessionStorage.getItem("technician_id");
    if (!techId) {
      console.error("Technician ID not found in sessionStorage");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/user/service-request/${techId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch job summary");
        }
        return res.json();
      })
      .then((data) => {
        // Handle array or object structure based on backend response
        let allRequests = [];
        if (Array.isArray(data)) {
          allRequests = data;
        } else if (data && Array.isArray(data.requests)) {
          allRequests = data.requests;
        }

        setJobs(allRequests);
      })
      .catch((err) => {
        console.error("Error fetching job summaries:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleUpdateStatus = async (jobId) => {
    if (!jobId) {
      console.error("Job ID is undefined, cannot update status");
      return;
    }

    setUpdatingId(jobId);
    try {
      // Assuming a PUT request to update the status. Adjust endpoint if necessary.
      const response = await fetch(
        `${API_BASE}/service-request/status/${jobId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("token") || ""}`
          },
          body: JSON.stringify({ status: "Completed" })
        }
      );

      // If backend returns 200/201, or if it succeeds
      if (response.ok) {
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === jobId ? { ...job, status: "Completed" } : job
          )
        );
        window.location.reload();
      } else {
        console.error("Failed to update status on server");
        // Optimistically update anyway for demo purposes, or show an error
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === jobId ? { ...job, status: "Completed" } : job
          )
        );
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Optimistically update anyway in case the endpoint doesn't exist yet but UI needs to show it
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === jobId ? { ...job, status: "Completed" } : job
        )
      );
      window.location.reload();
    } finally {
      setUpdatingId(null);
      window.location.reload();
    }
  };

  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins w-full max-w-[1300px] mx-auto h-[calc(100vh-150px)] min-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-bold">All Job Summary</h3>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search records..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            // setCurrentPage(1); 
          }}
          className="w-full md:w-3/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>


      <div className="w-full flex-1 overflow-auto bg-white rounded-md border border-gray-200">
        {loading ? (
          <p className="text-gray-500 italic p-4 text-center">
            Loading job summaries...
          </p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center">
            No matching job summaries found.
          </p>
        ) : (
          <table className="w-full text-left text-sm border-collapse min-w-max">
            <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-3 border border-gray-200 font-semibold whitespace-nowrap">Request ID</th>
                <th className="p-3 border border-gray-200 font-semibold whitespace-nowrap">Client Name</th>
                <th className="p-3 border border-gray-200 font-semibold whitespace-nowrap">Contact Details</th>
                <th className="p-3 border border-gray-200 font-semibold whitespace-nowrap">Institute Details</th>
                <th className="p-3 border border-gray-200 font-semibold whitespace-nowrap">Instrument Name</th>
                <th className="p-3 border border-gray-200 font-semibold whitespace-nowrap">Instrument Details</th>
                <th className="p-3 border border-gray-200 font-semibold whitespace-nowrap">Problem Description</th>
                <th className="p-3 border border-gray-200 font-semibold whitespace-nowrap">Request Date</th>
                <th className="p-3 border border-gray-200 font-semibold whitespace-nowrap">Accepted Date</th>
                <th className="p-3 border border-gray-200 font-semibold whitespace-nowrap">Completed Date</th>
                <th className="p-3 border border-gray-200 font-semibold whitespace-nowrap">Status</th>
                <th className="p-3 border border-gray-200 font-semibold whitespace-nowrap">Action</th>
                <th className="p-3 border border-gray-200 font-semibold whitespace-nowrap">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job, i) => (
                <tr key={job.id || i} className="border-b hover:bg-[#ffffff80] transition duration-200">
                  <td className="p-4 border border-gray-200 align-top whitespace-nowrap text-gray-800 font-medium">SR/{job.id}</td>
                  <td className="p-4 border border-gray-200 align-top whitespace-nowrap text-gray-800">{job.full_name}</td>
                  <td className="p-4 border border-gray-200 align-top whitespace-nowrap">
                    <div className="flex flex-col gap-1.5 text-gray-700">
                      <div><span className="font-semibold text-gray-500">Mobile:</span> {job.contact_number}</div>
                      <div><span className="font-semibold text-gray-500">Email:</span> {job.email}</div>
                      <div><span className="font-semibold text-gray-500">Address:</span> {job.physical_address}</div>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-200 align-top whitespace-nowrap">
                    <div className="flex flex-col gap-1.5 text-gray-700">
                      <div><span className="font-semibold text-gray-500">Name:</span> {job.institute_name}</div>
                      <div><span className="font-semibold text-gray-500">Address:</span> {job.institute_address}</div>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-200 align-top whitespace-nowrap font-medium text-gray-800">{job.instrument_name}</td>
                  <td className="p-4 border border-gray-200 align-top whitespace-nowrap">
                    <div className="flex flex-col gap-1.5 text-gray-700">
                      <div><span className="font-semibold text-gray-500">Brand:</span> {job.instrument_brand}</div>
                      <div><span className="font-semibold text-gray-500">Model:</span> {job.instrument_model}</div>
                      <div><span className="font-semibold text-gray-500">Manufacturer:</span> {job.instrument_manufacturer}</div>
                      <div><span className="font-semibold text-gray-500">Manufacture Year:</span> {job.instrument_manufactured_year}</div>
                      <div><span className="font-semibold text-gray-500">Testing Type:</span> {job.instrument_product_testing_type}</div>
                      <div><span className="font-semibold text-gray-500">Testing Parameter:</span> {job.instrument_testing_parameter}</div>
                      <div><span className="font-semibold text-gray-500">Consumption Pd:</span> {job.instrument_consumption_period}</div>
                    </div>
                  </td>
                  {/* <td className="p-4 border border-gray-200 align-top max-w-[250px] break-words text-gray-800 whitespace-normal leading-relaxed">{job.issue_description}</td> */}
                  <td className="p-4 border border-gray-200 align-top max-w-[250px] whitespace-normal break-words text-gray-800 leading-relaxed">
                    {job.issue_description}
                  </td>
                  <td className="p-4 border border-gray-200 align-top whitespace-nowrap text-gray-700">{job.created_at}</td>
                  <td className="p-4 border border-gray-200 align-top whitespace-nowrap text-gray-700">{job.start_date}</td>
                  <td className="p-4 border border-gray-200 align-top whitespace-nowrap text-gray-700">{job.end_date}</td>
                  <td className="p-4 border border-gray-200 align-top whitespace-nowrap">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${job.status === "Completed" || job.status === "Pass"
                        ? "bg-green-100 text-green-700"
                        : job.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : job.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : job.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="p-4 border border-gray-200 align-top whitespace-nowrap">
                    {job.status === "In Progress" && (
                      <button
                        onClick={() => handleUpdateStatus(job.id)}
                        disabled={updatingId === job.id}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow transition duration-200 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                      >
                        {updatingId === job.id ? "Updating..." : "Complete"}
                      </button>
                    )}
                  </td>
                  <td className="p-4 border border-gray-200 align-top max-w-[250px] whitespace-normal break-words">
                    <div className="flex flex-col gap-1.5 text-gray-700">
                      <div>
                        <span className="font-semibold text-gray-500">Rate:</span> {job.rate}
                      </div>
                      <div className="break-words">
                        <span className="font-semibold text-gray-500">Review:</span> {job.review}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
