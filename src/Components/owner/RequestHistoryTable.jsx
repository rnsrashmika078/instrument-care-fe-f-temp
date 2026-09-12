import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../../config";

export default function RequestHistoryTable() {
  const { id: techId } = useParams(); // Technician ID
  const token = sessionStorage.getItem("token");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  // Review states
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const searchLower = searchTerm.toLowerCase();
    const idMatch = `SR/${job.id}`.toLowerCase().includes(searchLower);
    const instrumentMatch = job.instrument_name?.toLowerCase().includes(searchLower);
    const descriptionMatch = job.issue_description?.toLowerCase().includes(searchLower);
    const statusMatch = job.status?.toLowerCase().includes(searchLower);
    const requestDateMatch = job.created_at?.toLowerCase().includes(searchLower);
    const acceptedDateMatch = job.accepted_at?.toLowerCase().includes(searchLower);
    const completedDateMatch = job.completed_at?.toLowerCase().includes(searchLower);

    const matchesSearch = !searchTerm || idMatch || instrumentMatch || descriptionMatch || statusMatch || requestDateMatch || acceptedDateMatch || completedDateMatch;

    const jobDate = job.created_at?.split(" ")[0] || "";
    let matchesDate = true;
    if (fromDate && jobDate < fromDate) matchesDate = false;
    if (toDate && jobDate > toDate) matchesDate = false;

    return matchesSearch && matchesDate;
  });

  useEffect(() => {
    if (!techId) return;

    const fetchServiceRequests = async () => {
      setLoading(true);
      try {
        const userId = sessionStorage.getItem("user_id"); // ✅ get logged-in user ID
        if (!userId) throw new Error("User not logged in");

        const response = await fetch(
          `${API_BASE}/user/service-request/${techId}/my-requests`,
          {
            method: "POST", // POST request to send user_id
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId }), // ✅ send user_id in body
          }
        );
        console.log(response);

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          throw new Error(data.error || "No data found or server error");
        }

        // ✅ Support both array and object responses
        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data.data && Array.isArray(data.data)) {
          setJobs(data.data);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching service requests:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, [techId]);

  // Reset review form when modal opens with a new job
  useEffect(() => {
    if (selectedJob) {
      setRating(0);
      setReviewText("");
      setReviewStatus("");
    }
  }, [selectedJob]);

  const submitReview = async () => {
    if (!selectedJob || !rating || !reviewText.trim()) return;

    setIsSubmittingReview(true);
    setReviewStatus("");

    try {
      const response = await fetch(
        `${API_BASE}/service-request/rate/${selectedJob.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ rate: rating, review: reviewText }),
        }
      );

      if (response.ok) {
        setReviewStatus("Review submitted successfully!");
      } else {
        setReviewStatus("Error submitting review. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setReviewStatus("Error connecting to server. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // return (
  //   <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins">
  //     <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
  //       <h3 className="font-bold text-lg">Service Request History</h3>
  //       <div className="flex flex-col xl:flex-row gap-3 w-full md:w-auto items-start xl:items-center">
  //         <input
  //           type="text"
  //           placeholder="Search by ID, instrument, status..."
  //           className="border px-3 py-2 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-orange-400"
  //           value={searchTerm}
  //           onChange={(e) => setSearchTerm(e.target.value)}
  //         />
  //         <div className="flex items-center gap-2">
  //           <span className="text-sm font-medium text-gray-600">Request Date</span>
  //           <input
  //             type="date"
  //             className="border px-2 py-1.5 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
  //             value={fromDate}
  //             onChange={(e) => setFromDate(e.target.value)}
  //           />
  //           <span className="text-sm font-medium text-gray-600">To</span>
  //           <input
  //             type="date"
  //             className="border px-2 py-1.5 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
  //             value={toDate}
  //             onChange={(e) => setToDate(e.target.value)}
  //           />
  //         </div>
  //       </div>
  //     </div>

  //     <div className="mb-2">
  //       <p className="text-gray-500 italic text-sm">*Please click on the row if available to view more details</p>
  //     </div>

  //     <div className="overflow-x-auto">
  //       <div className="max-h-[540px] overflow-y-auto">
  //         <table className="w-full text-left text-sm border-collapse">
  //           <thead>
  //             <tr className="border-b">
  //               <th className="p-2">Request ID</th>
  //               <th className="p-2">Instrument Name</th>
  //               <th className="p-2">Problem Description</th>
  //               <th className="p-2">Request Date</th>
  //               <th className="p-2">Accepted Date</th>
  //               <th className="p-2">Completed Date</th>
  //               <th className="p-2">Status</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {loading ? (
  //               <tr>
  //                 <td colSpan={7} className="text-center text-gray-500 italic p-4">
  //                   Loading...
  //                 </td>
  //               </tr>
  //             ) : filteredJobs.length === 0 ? (
  //               <tr>
  //                 <td colSpan={7} className="text-center text-gray-500 italic p-4">
  //                   No matching job summaries found.
  //                 </td>
  //               </tr>
  //             ) : (
  //               filteredJobs.map((job) => (
  //                 <tr
  //                   key={job.id}
  //                   className="border-b hover:bg-gray-100 cursor-pointer"
  //                   onClick={() => setSelectedJob(job)}
  //                 >
  //                   <td className="p-2">SR/{job.id}</td>
  //                   <td className="p-2">{job.instrument_name}</td>
  //                   <td className="p-2">{job.issue_description}</td>
  //                   <td className="p-2">{job.created_at?.split(" ")[0]}</td>
  //                   <td className="p-2">{job.start_date?.split(" ")[0]}</td>
  //                   <td className="p-2">{job.end_date?.split(" ")[0]}</td>
  //                   <td
  //                     className={`p-2 font-bold ${job.status === "In Progress"
  //                       ? "text-blue-500"
  //                       : job.status === "Rejected"
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
  //                 </tr>
  //               ))
  //             )}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>

  //     {/* Popup Modal */}
  //     {selectedJob && (
  //       <div className="fixed inset-0 bg-[#00000090] flex items-center justify-center z-50">
  //         <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-y-auto">
  //           <h2 className="text-lg font-bold mb-4">
  //             Service Request #{selectedJob.id}
  //           </h2>
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
  //             <p><strong>Full Name:</strong> {selectedJob.full_name}</p>
  //             <p><strong>Email:</strong> {selectedJob.email}</p>
  //             <p><strong>Contact:</strong> {selectedJob.contact_number}</p>
  //             <p><strong>Address:</strong> {selectedJob.physical_address}</p>
  //             <p><strong>Institute Name:</strong> {selectedJob.institute_name}</p>
  //             <p><strong>Institute Address:</strong> {selectedJob.institute_address}</p>
  //             <p><strong>Instrument Name:</strong> {selectedJob.instrument_name}</p>
  //             <p><strong>Instrument Brand:</strong> {selectedJob.instrument_brand}</p>
  //             <p><strong>Instrument Model:</strong> {selectedJob.instrument_model}</p>
  //             <p><strong>Instrument Manufacturer:</strong> {selectedJob.instrument_manufacturer}</p>
  //             <p><strong>ManufacturedYear:</strong> {selectedJob.manufactured_year}</p>
  //             <p><strong>Product Testing Type:</strong> {selectedJob.product_testing_type}</p>
  //             <p><strong>Testing Parameter:</strong> {selectedJob.testing_parameter}</p>
  //             <p><strong>Consumption Period:</strong> {selectedJob.consumption_period}</p>
  //             <p className="col-span-2"><strong>Problem Description:</strong> {selectedJob.issue_description}</p>
  //             <p className="col-span-2">
  //               <strong>Status:</strong>{" "}
  //               <span
  //                 className={`font-bold ${selectedJob.status === "In Progress"
  //                   ? "text-blue-500"
  //                   : selectedJob.status === "Rejected"
  //                     ? "text-red-500"
  //                     : selectedJob.status === "Pending"
  //                       ? "text-yellow-500"
  //                       : selectedJob.status === "Completed"
  //                         ? "text-green-500"
  //                         : ""
  //                   }`}
  //               >
  //                 {selectedJob.status}
  //               </span>
  //             </p>
  //           </div>

  //           {/* Rate & Review Section (Only for Completed jobs) */}
  //           {selectedJob.status === "Completed" && selectedJob.rate === 0 && (
  //             <div className="mt-6 border-t pt-4">
  //               <h3 className="font-bold text-lg mb-2">Rate & Review Technician</h3>
  //               <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
  //                 <div className="flex items-center">
  //                   <span className="mr-3 font-semibold text-gray-700">Rating:</span>
  //                   <div className="flex">
  //                     {[1, 2, 3, 4, 5].map((star) => (
  //                       <button
  //                         key={star}
  //                         onClick={() => setRating(star)}
  //                         className={`text-3xl transition ${rating >= star ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"
  //                           }`}
  //                       >
  //                         ★
  //                       </button>
  //                     ))}
  //                   </div>
  //                 </div>
  //               </div>

  //               <textarea
  //                 className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
  //                 rows="3"
  //                 placeholder="Share your experience working with this technician..."
  //                 value={reviewText}
  //                 onChange={(e) => setReviewText(e.target.value)}
  //                 disabled={reviewStatus === "Review submitted successfully!"}
  //               ></textarea>

  //               <div className="flex justify-between items-center">
  //                 <span
  //                   className={`font-semibold ${reviewStatus.includes("successfully")
  //                     ? "text-green-600"
  //                     : "text-red-500"
  //                     }`}
  //                 >
  //                   {reviewStatus}
  //                 </span>

  //                 {reviewStatus !== "Review submitted successfully!" && (
  //                   <button
  //                     onClick={submitReview}
  //                     disabled={isSubmittingReview || rating === 0 || !reviewText.trim()}
  //                     className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  //                   >
  //                     {isSubmittingReview ? "Submitting..." : "Submit Review"}
  //                   </button>
  //                 )}
  //               </div>
  //             </div>
  //           )}

  //           <div className="flex justify-end mt-6 border-t pt-4">
  //             <button
  //               onClick={() => setSelectedJob(null)}
  //               className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition"
  //             >
  //               Close
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins">

      {/* Header + Filters */}
      <div className="flex flex-col gap-3 mb-4">
        <h3 className="font-bold text-lg">Service Request History</h3>
        <input
          type="text"
          placeholder="Search by ID, instrument, status..."
          className="border px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-1 focus:ring-orange-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Request Date</span>
          <input
            type="date"
            className="border px-2 py-1.5 rounded-md text-sm w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-orange-400"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <span className="text-sm font-medium text-gray-600">To</span>
          <input
            type="date"
            className="border px-2 py-1.5 rounded-md text-sm w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-orange-400"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      <p className="text-gray-500 italic text-sm mb-2">
        *Please click on the row/card if available to view more details
      </p>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="max-h-[540px] overflow-y-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Request ID</th>
                <th className="p-2">Instrument Name</th>
                <th className="p-2">Problem Description</th>
                <th className="p-2">Request Date</th>
                <th className="p-2">Accepted Date</th>
                <th className="p-2">Completed Date</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 italic p-4">Loading...</td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 italic p-4">No matching job summaries found.</td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <td className="p-2">SR/{job.id}</td>
                    <td className="p-2">{job.instrument_name}</td>
                    <td className="p-2">{job.issue_description}</td>
                    <td className="p-2">{job.created_at?.split(" ")[0]}</td>
                    <td className="p-2">{job.start_date?.split(" ")[0]}</td>
                    <td className="p-2">{job.end_date?.split(" ")[0]}</td>
                    <td className={`p-2 font-bold ${
                      job.status === "In Progress" ? "text-blue-500"
                      : job.status === "Rejected" ? "text-red-500"
                      : job.status === "Pending" ? "text-yellow-500"
                      : job.status === "Completed" ? "text-green-500"
                      : ""
                    }`}>
                      {job.status}
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
        ) : filteredJobs.length === 0 ? (
          <p className="text-center text-gray-500 italic p-4">No matching job summaries found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-1 cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">SR/{job.id}</p>
                <span className={`text-xs font-bold ${
                  job.status === "In Progress" ? "text-blue-500"
                  : job.status === "Rejected" ? "text-red-500"
                  : job.status === "Pending" ? "text-yellow-500"
                  : job.status === "Completed" ? "text-green-500"
                  : ""
                }`}>
                  {job.status}
                </span>
              </div>
              <p className="text-sm text-gray-700 font-medium">{job.instrument_name}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{job.issue_description}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-gray-400">
                <span><span className="font-medium text-gray-500">Requested:</span> {job.created_at?.split(" ")[0]}</span>
                <span><span className="font-medium text-gray-500">Accepted:</span> {job.start_date?.split(" ")[0] || "-"}</span>
                <span><span className="font-medium text-gray-500">Completed:</span> {job.end_date?.split(" ")[0] || "-"}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-[#00000090] flex items-center justify-center z-50 p-4">
          <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Service Request #{selectedJob.id}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <p><strong>Full Name:</strong> {selectedJob.full_name}</p>
              <p><strong>Email:</strong> {selectedJob.email}</p>
              <p><strong>Contact:</strong> {selectedJob.contact_number}</p>
              <p><strong>Address:</strong> {selectedJob.physical_address}</p>
              <p><strong>Institute Name:</strong> {selectedJob.institute_name}</p>
              <p><strong>Institute Address:</strong> {selectedJob.institute_address}</p>
              <p><strong>Instrument Name:</strong> {selectedJob.instrument_name}</p>
              <p><strong>Instrument Brand:</strong> {selectedJob.instrument_brand}</p>
              <p><strong>Instrument Model:</strong> {selectedJob.instrument_model}</p>
              <p><strong>Manufacturer:</strong> {selectedJob.instrument_manufacturer}</p>
              <p><strong>Manufactured Year:</strong> {selectedJob.manufactured_year}</p>
              <p><strong>Product Testing Type:</strong> {selectedJob.product_testing_type}</p>
              <p><strong>Testing Parameter:</strong> {selectedJob.testing_parameter}</p>
              <p><strong>Consumption Period:</strong> {selectedJob.consumption_period}</p>
              <p className="sm:col-span-2"><strong>Problem Description:</strong> {selectedJob.issue_description}</p>
              <p className="sm:col-span-2">
                <strong>Status:</strong>{" "}
                <span className={`font-bold ${
                  selectedJob.status === "In Progress" ? "text-blue-500"
                  : selectedJob.status === "Rejected" ? "text-red-500"
                  : selectedJob.status === "Pending" ? "text-yellow-500"
                  : selectedJob.status === "Completed" ? "text-green-500"
                  : ""
                }`}>
                  {selectedJob.status}
                </span>
              </p>
            </div>

            {/* Rate & Review */}
            {selectedJob.status === "Completed" && selectedJob.rate === 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-bold text-lg mb-2">Rate & Review Technician</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-semibold text-gray-700">Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-3xl transition ${rating >= star ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
                  rows="3"
                  placeholder="Share your experience working with this technician..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  disabled={reviewStatus === "Review submitted successfully!"}
                />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <span className={`font-semibold text-sm ${reviewStatus.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
                    {reviewStatus}
                  </span>
                  {reviewStatus !== "Review submitted successfully!" && (
                    <button
                      onClick={submitReview}
                      disabled={isSubmittingReview || rating === 0 || !reviewText.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6 border-t pt-4">
              <button
                onClick={() => setSelectedJob(null)}
                className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition w-full sm:w-auto"
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
