import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DefaultProfileImage from "../../assets/images/profile-image.jpeg";
import { fetchWithAuth } from "../utils/api";
import { API_BASE } from "../../config";

export default function TechnicianTable({ searchTerm, setSearchTerm }) {
  const userId = sessionStorage.getItem("user_id");
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await fetchWithAuth(
          `${API_BASE}/user/dashboard/approved/all`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch technicians");

        const data = await response.json();
        console.log("APPROVED USERS", data);
        setTechnicians(data);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };

    fetchTechnicians();
  }, []);

  // Filter technicians
  const filteredTechnicians = technicians.filter((tech) => {
    const term = (searchTerm || "").toLowerCase();
    return (
      (tech.first_name || "").toLowerCase().includes(term) ||
      (tech.last_name || "").toLowerCase().includes(term) ||
      (tech.designation || "").toLowerCase().includes(term) ||
      (tech.bio || "").toLowerCase().includes(term) ||
      (tech.institute_name || "").toLowerCase().includes(term) ||
      (tech.instruments || "").toLowerCase().includes(term)
    );
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredTechnicians.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.ceil(filteredTechnicians.length / recordsPerPage);

  const handleViewProfile = async (tech_user_id, tech_id) => {
    console.log("tech_id", tech_id);

    const payload = {
      client_id: userId,
      technician_id: tech_user_id,
      search_term: searchTerm || null,
    };

    console.log("Payload to send:", payload);

    try {
      const response = await fetch(`${API_BASE}/user/dashboard/search`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log(result);
      navigate(`/user/view-profile/${tech_id}`);
    } catch (error) {
      console.error("Error navigating to profile:", error);
    }
  };

  return (
    <section className="bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                All Technicians
              </h2>
              <div className="max-w-2xl text-sm text-gray-600 space-y-1 mt-2">
                <p>
                  Browse all registered technicians on the platform and easily
                  find the right expert for your needs.
                </p>
              </div>
            </div>

            <div className="w-full max-w-xl rounded-2xl   p-2.5 md:p-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={searchTerm || ""}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by technician name, instrument, or specialty"
                  className="h-12 flex-1 rounded-xl border  bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
                <button
                  type="button"
                  className="h-12 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        {/* Desktop Table */}
        <div className="hidden md:block overflow-hidden rounded-xl shadow-sm border border-gray-200">
          <table className="w-full text-sm text-left border-separate border-spacing-0 min-w-[900px]">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wide">
              <tr>
                <th className="p-3 border-b border-r last:border-r-0 border-gray-200">
                  Profile
                </th>
                <th className="p-3 border-b border-r last:border-r-0 border-gray-200">
                  Name
                </th>
                <th className="p-3 border-b border-r last:border-r-0 border-gray-200">
                  Designation
                </th>
                <th className="p-3 border-b border-r last:border-r-0 border-gray-200">
                  Institute
                </th>
                <th className="p-3 border-b border-r last:border-r-0 border-gray-200">
                  Instruments
                </th>
                <th className="p-3 border-b border-gray-200 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((tech, index) => {
                  const imageUrl =
                    tech.picture !== null
                      ? `${API_BASE}/${tech.picture}`
                      : DefaultProfileImage;
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="p-3 border-b border-r last:border-r-0 border-gray-200">
                        <img
                          src={imageUrl}
                          alt="profile"
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      </td>
                      <td className="p-3 border-b border-r last:border-r-0 border-gray-200 font-medium text-gray-800 whitespace-nowrap">
                        {tech.first_name + " " + tech.last_name || "No Name"}
                      </td>
                      <td className="p-3 border-b border-r last:border-r-0 border-gray-200 text-gray-700 whitespace-nowrap">
                        {tech.designation || "-"}
                      </td>
                      <td className="p-3 border-b border-r last:border-r-0 border-gray-200 text-gray-700 whitespace-nowrap">
                        {tech.institute_name || "-"}
                      </td>
                      <td className="p-3 border-b border-r last:border-r-0 border-gray-200 text-gray-700 max-w-[200px]">
                        {tech.instruments || "-"}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        <div className="flex gap-2 justify-center">
                          <button
                            className="bg-orange-400 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-orange-500 transition"
                            onClick={() =>
                              handleViewProfile(tech.user_id, tech.id)
                            }
                          >
                            View
                          </button>
                          <Link to={`/user/service-request/${tech.id}`}>
                            <button className="bg-gray-800 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-gray-700 transition">
                              Request
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No technicians found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {currentRecords.length > 0 ? (
            currentRecords.map((tech, index) => {
              const imageUrl =
                tech.picture !== null
                  ? `${API_BASE}/${tech.picture}`
                  : DefaultProfileImage;
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex gap-4 items-start"
                >
                  <img
                    src={imageUrl}
                    alt="profile"
                    className="w-14 h-14 rounded-full object-cover border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {tech.first_name + " " + tech.last_name || "No Name"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {tech.designation || "-"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {tech.institute_name || "-"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {tech.instruments || "-"}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="bg-orange-400 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-orange-500 transition"
                        onClick={() => handleViewProfile(tech.user_id, tech.id)}
                      >
                        View
                      </button>
                      <Link to={`/user/service-request/${tech.id}`}>
                        <button className="bg-gray-800 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-gray-700 transition">
                          Request
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-6">
              No technicians found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              Showing {indexOfFirstRecord + 1} to{" "}
              {Math.min(indexOfLastRecord, filteredTechnicians.length)} of{" "}
              {filteredTechnicians.length} entries
            </span>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors bg-white shadow-sm"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-gray-700 mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors bg-white shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
