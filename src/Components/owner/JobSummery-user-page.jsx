import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Menu, X, Star } from "lucide-react";
import { API_BASE } from "../../config";

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
  //           className="w-full md:w-3/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
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
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins">

      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="font-bold text-lg">Service Record</h2>
        <input
          type="text"
          placeholder="Search records..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="max-h-[420px] overflow-y-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Instrument Name</th>
                <th className="p-2">Institute Name</th>
                <th className="p-2">Laboratory Name</th>
                <th className="p-2">Status</th>
                <th className="p-2">Rate</th>
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
                  <tr key={job.id} className="border-b">
                    <td className="p-2">{job.instrument_name}</td>
                    <td className="p-2">{job.institute_name}</td>
                    <td className="p-2">-</td>
                    <td className={`p-2 font-bold ${
                      job.status === "In Progress" ? "text-blue-500"
                      : job.status === "Cancelled" ? "text-red-500"
                      : job.status === "Pending" ? "text-yellow-500"
                      : job.status === "Completed" ? "text-green-500"
                      : ""
                    }`}>
                      {job.status}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        {job.rate > 0 && [...Array(job.rate)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-orange-300 text-orange-500" />
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
      <div className="md:hidden space-y-3">
        {loading ? (
          <p className="text-center text-gray-500 italic p-4">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500 italic p-4">No job summaries found.</p>
        ) : (
          paginatedJobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-1">
              <p className="font-semibold text-gray-800 truncate">{job.instrument_name}</p>
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-600">Institute:</span> {job.institute_name}
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-600">Laboratory:</span> -
              </p>
              <p className={`text-xs font-bold ${
                job.status === "In Progress" ? "text-blue-500"
                : job.status === "Cancelled" ? "text-red-500"
                : job.status === "Pending" ? "text-yellow-500"
                : job.status === "Completed" ? "text-green-500"
                : ""
              }`}>
                {job.status}
              </p>
              <div className="flex gap-1 pt-1">
                {job.rate > 0 && [...Array(job.rate)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-300 text-orange-500" />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-orange-500 text-white" : ""}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}

