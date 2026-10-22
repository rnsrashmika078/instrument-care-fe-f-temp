import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Menu, X, Star, Search } from "lucide-react";
import { API_BASE } from "../../config";

const statusClass = (status) =>
  status === "Completed"
    ? "bg-green-100 text-green-800 border-green-300"
    : status === "Cancelled"
      ? "bg-red-100 text-red-800 border-red-300"
      : status === "In Progress"
        ? "bg-blue-100 text-blue-800 border-blue-300"
        : status === "Pending"
          ? "bg-amber-100 text-amber-800 border-gray-300"
          : "bg-gray-100 text-gray-800 border-gray-300";

export default function JobSummaryTable_UserPage() {
  const token = sessionStorage.getItem("token");
  const { id: techId } = useParams(); // Get technician ID from URL
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);


  // for pagination and search bar
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Filter jobs based on search query
  const filteredJobs = useMemo(() => {
    if (!search) return jobs;
    return jobs.filter(
      (job) =>
        job.instrument_name.toLowerCase().includes(search.toLowerCase()) ||
        job.institute_name.toLowerCase().includes(search.toLowerCase()) ||
        job.laboratory_name?.toLowerCase().includes(search.toLowerCase()) ||
        job.status.toLowerCase().includes(search.toLowerCase())
    );
  }, [jobs, search]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / recordsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  useEffect(() => {
    if (!techId) return;

    const fetchServiceRequests = async () => {
      try {
        const response = await fetch(`${API_BASE}/user/service-request/${techId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("No data found or server error");
        const data = await response.json();
        // console.log("THis is data", data);
        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching service requests:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, [techId]);

  // return (
  //   <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins">
  //     <div className="flex justify-between items-center mb-4">
  //       <h2 className="font-bold">Service Record</h2>
  //       {/* Search Bar */}
  //       <div className="mb-4">
  //         <input
  //           type="text"
  //           placeholder="Search records..."
  //           value={search}
  //           onChange={(e) => {
  //             setSearch(e.target.value);
  //             setCurrentPage(1); // reset to first page when searching
  //           }}
  //           className="w-full md:w-3/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
  //         />
  //       </div>
  //     </div>

  //     <div className="overflow-x-auto">
  //       <div className="max-h-[420px] overflow-y-auto">
  //         <table className="w-full text-left text-sm border-collapse">
  //           <thead>
  //             <tr className="border-b">
  //               <th className="p-2">Instrument Name</th>
  //               <th className="p-2">Institute Name</th>
  //               <th className="p-2">Laboratory Name</th>
  //               <th className="p-2">Status</th>
  //               <th className="p-2">Rate</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {loading ? (
  //               <tr>
  //                 <td colSpan={5} className="text-center text-gray-500 italic p-4">
  //                   Loading...
  //                 </td>
  //               </tr>
  //             ) : jobs.length === 0 ? (
  //               <tr>
  //                 <td colSpan={5} className="text-center text-gray-500 italic p-4">
  //                   No job summaries found.
  //                 </td>
  //               </tr>
  //             ) : (
  //               paginatedJobs.map((job) => (
  //                 <tr key={job.id} className="border-b">
  //                   <td className="p-2">{job.instrument_name}</td>
  //                   <td className="p-2">{job.institute_name}</td>
  //                   <td className="p-2">-</td>
  //                   {/* <td className="p-2">{job.updated_at.split(" ")[0]}</td> */}
  //                   <td
  //                     className={`p-2 font-bold ${job.status === "In Progress"
  //                       ? "text-blue-500"
  //                       : job.status === "Cancelled"
  //                         ? "text-red-500"
  //                         : job.status === "Pending"
  //                           ? "text-yellow-500"
  //                           : job.status === "Completed"
  //                             ? "text-green-500"
  //                             : ""
  //                       }`}
  //                   >
  //                     {job.status}
  //                   </td>
  //                   <td className="p-2">
  //                     <div className="flex gap-1">
  //                       {job.rate > 0 ? (
  //                         [...Array(job.rate)].map((_, i) => (
  //                           <Star key={i} className="w-4 h-4 fill-orange-300 text-orange-500" />
  //                         ))
  //                       ) : null}
  //                     </div>
  //                   </td>
  //                   {/* <td className="p-2">4</td> need to insert a rate column in the database and fetch it here instead of hardcoding 4 */}
  //                 </tr>
  //               ))
  //             )}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //     {/* Pagination */}
  //     {totalPages > 1 && (
  //       <div className="mt-4 flex justify-center gap-2">
  //         <button
  //           disabled={currentPage === 1}
  //           onClick={() => setCurrentPage((prev) => prev - 1)}
  //           className="px-3 py-1 border rounded disabled:opacity-50"
  //         >
  //           Prev
  //         </button>
  //         {Array.from({ length: totalPages }, (_, i) => (
  //           <button
  //             key={i}
  //             onClick={() => setCurrentPage(i + 1)}
  //             className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-orange-500 text-white" : ""
  //               }`}
  //           >
  //             {i + 1}
  //           </button>
  //         ))}
  //         <button
  //           disabled={currentPage === totalPages}
  //           onClick={() => setCurrentPage((prev) => prev + 1)}
  //           className="px-3 py-1 border rounded disabled:opacity-50"
  //         >
  //           Next
  //         </button>
  //       </div>
  //     )}
  //   </div>
  // );
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 font-poppins border-2 border-gray-200">

      {/* Header + Search */}
      <div className="flex flex-col gap-3 border-b-2 border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">Service Record</h2>
          <p className="text-xs text-gray-500">
            {loading
              ? "Loading..."
              : `${jobs.length} record${jobs.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            aria-label="Search service records"
            placeholder="Search records..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 transition-colors placeholder:text-gray-400 hover:border-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400/30"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="mt-4 hidden md:block overflow-x-auto">
        <div className="max-h-[420px] overflow-y-auto rounded-lg border-2 border-gray-200">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-100 text-gray-700">
              <tr className="border-b">
                <th className="p-3">Instrument Name</th>
                <th className="p-3">Institute Name</th>
                <th className="p-3">Laboratory Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Rate</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 italic p-4">Loading...</td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 italic p-4">No job summaries found.</td>
                </tr>
              ) : (
                paginatedJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b hover:bg-orange-50 transition-colors"
                  >
                    <td className="p-3 font-medium text-gray-800">{job.instrument_name}</td>
                    <td className="p-3 text-gray-600">{job.institute_name}</td>
                    <td className="p-3 text-gray-400">-</td>
                    <td className="p-3">
                      <span className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClass(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-0.5">
                        {job.rate > 0 && [...Array(job.rate)].map((_, k) => (
                          <Star key={k} className="w-4 h-4 fill-orange-400 text-orange-500" />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="mt-4 md:hidden space-y-3">
        {loading ? (
          <p className="text-center text-gray-500 italic p-4">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500 italic p-4">No job summaries found.</p>
        ) : (
          paginatedJobs.map((job) => (
            <div key={job.id} className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-1">
              <p className="font-semibold text-gray-800 truncate">{job.instrument_name}</p>
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-600">Institute:</span> {job.institute_name}
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-600">Laboratory:</span> -
              </p>
              <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClass(job.status)}`}>
                {job.status}
              </span>
              <div className="flex gap-0.5 pt-1">
                {job.rate > 0 && [...Array(job.rate)].map((_, k) => (
                  <Star key={k} className="w-4 h-4 fill-orange-400 text-orange-500" />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-gray-100 pt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              aria-current={currentPage === i + 1 ? "page" : undefined}
              className={`h-8 min-w-8 rounded-lg border px-2 text-sm font-semibold transition ${
                currentPage === i + 1
                  ? "border-gray-500 bg-orange-500 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-orange-50 hover:text-orange-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}
