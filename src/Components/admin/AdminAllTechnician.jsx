import { fetchWithAuth } from "../utils/api";
import { API_BASE } from "../../config";
import React, { useState } from "react";
import {
  FaEye,
  FaTrash,
  FaTimes,
  FaCheck,
  FaFileCsv,
  FaUserPlus,
} from "react-icons/fa";
import DefaultProfileImage from "../../assets/images/profile-image.jpeg";
import ProfileForm from "./TechnicianProfile";
// import Register from "../auth/Technician-Registration"
import Register from "./AddTechnician";
import { toast } from "react-toastify";

export default function AllTechnicianTable({ usersData }) {
  const token = sessionStorage.getItem("token");
  const initialUsers = usersData || [];

  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [districtFilter, setDistrictFilter] = useState("All");

  const [showRegister, setShowRegister] = useState(false);

  const handleOpenModal = (user) => setSelectedUser({ ...user });
  const handleCloseModal = () => setSelectedUser(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this technician?"))
      return;

    try {
      const response = await fetch(`${API_BASE}/admin/technicians/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success(result.message || "Technician deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete technician");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while deleting the technician.");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to mark this technician as ${newStatus}?`,
      )
    )
      return;

    try {
      const response = await fetch(
        `${API_BASE}/admin/technicians/status/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
        );
        toast.success(
          result.message || `Technician status updated to ${newStatus}`,
        );
      } else {
        toast.error(result.error || "Failed to update technician status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating the status.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;
    const matchGender = genderFilter === "All" || user.gender === genderFilter;
    const matchDistrict =
      districtFilter === "All" || user.district === districtFilter;

    let matchesDate = true;
    if (fromDate || toDate) {
      if (!user.created_at) {
        matchesDate = false;
      } else {
        const userDate = new Date(user.created_at);
        userDate.setHours(0, 0, 0, 0);

        if (fromDate) {
          const from = new Date(fromDate);
          from.setHours(0, 0, 0, 0);
          if (userDate < from) matchesDate = false;
        }

        if (toDate) {
          const to = new Date(toDate);
          to.setHours(0, 0, 0, 0);
          if (userDate > to) matchesDate = false;
        }
      }
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchGender &&
      matchDistrict &&
      matchesDate
    );
  });

  const handleExportCSV = () => {
    if (filteredUsers.length === 0) {
      toast.warn("No records to export.");
      return;
    }

    const headers = [
      "TechnicianID",
      "First Name",
      "Last Name",
      "Email",
      "Contact",
      "Gender",
      "Title",
      "Designation",
      "Institute",
      "District",
      "Status",
      "Registration Date",
    ];

    const csvRows = [headers.join(",")];

    filteredUsers.forEach((user) => {
      const row = [
        user.id || "",
        `"${(user.first_name || "").replace(/"/g, '""')}"`,
        `"${(user.last_name || "").replace(/"/g, '""')}"`,
        `"${(user.email || "").replace(/"/g, '""')}"`,
        `"${(user.mobile_number || "").replace(/"/g, '""')}"`,
        `"${(user.gender || "").replace(/"/g, '""')}"`,
        `"${(user.title || "").replace(/"/g, '""')}"`,
        `"${(user.designation || "").replace(/"/g, '""')}"`,
        `"${(user.institute_name || "").replace(/"/g, '""')}"`,
        `"${(user.district || "").replace(/"/g, '""')}"`,
        `"${user.status || ""}"`,
        `"${user.created_at || ""}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `technicians_report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddTechnician = () => {
    setShowRegister(true);
  };

  return (
    <div className="w-full max-w-full rounded-[1.5rem] border border-orange-100 bg-white p-3 sm:p-4 font-poppins min-h-[720px]">
      <div className="mb-5 w-full">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <div className="sm:col-span-2 xl:col-span-2">
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-md outline-none focus:border-orange-500 text-sm bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2.5 rounded-md outline-none focus:border-orange-500 text-sm bg-white w-full"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Declined">Declined</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2.5 rounded-md outline-none focus:border-orange-500 text-sm bg-white w-full"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2.5 rounded-md outline-none focus:border-orange-500 text-sm bg-white w-full"
          >
            <option value="All">All Districts</option>
            <option value="Ampara">Ampara</option>
            <option value="Anuradhapura">Anuradhapura</option>
            <option value="Badulla">Badulla</option>
            <option value="Batticaloa">Batticaloa</option>
            <option value="Colombo">Colombo</option>
            <option value="Galle">Galle</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Hambantota">Hambantota</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Kalutara">Kalutara</option>
            <option value="Kandy">Kandy</option>
            <option value="Kegalle">Kegalle</option>
            <option value="Kilinochchi">Kilinochchi</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Mannar">Mannar</option>
            <option value="Matale">Matale</option>
            <option value="Matara">Matara</option>
            <option value="Monaragala">Monaragala</option>
            <option value="Mullaitivu">Mullaitivu</option>
            <option value="Nuwara Eliya">Nuwara Eliya</option>
            <option value="Polonnaruwa">Polonnaruwa</option>
            <option value="Puttalam">Puttalam</option>
            <option value="Ratnapura">Ratnapura</option>
            <option value="Trincomalee">Trincomalee</option>
            <option value="Vavuniya">Vavuniya</option>
          </select>

          <div className="grid grid-cols-2 gap-2 sm:col-span-2 xl:col-span-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-gray-600">
                From
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2.5 rounded-md outline-none focus:border-orange-500 text-sm bg-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-gray-600">
                To
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2.5 rounded-md outline-none focus:border-orange-500 text-sm bg-white"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex w-fit items-center justify-center rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-gray-700">
            Records: {filteredUsers.length}
          </label>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-md text-sm hover:bg-green-700 transition"
            >
              <FaFileCsv size={16} />
              Export CSV
            </button>

            <button
              onClick={handleAddTechnician}
              className="flex items-center gap-2 px-4 py-2 bg-orange-400 text-white font-medium rounded-md text-sm hover:bg-orange-600 transition"
            >
              <FaUserPlus size={16} />
              Add Technician
            </button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        {filteredUsers.length === 0 ? (
          <p className="rounded-lg bg-white/50 p-8 text-center text-gray-500 italic">
            No technicians found matching your criteria.
          </p>
        ) : (
          <div className="max-h-[720px] overflow-y-auto overflow-x-auto">
            <table className="min-w-[980px] w-full table-fixed border-collapse text-left text-sm">
              <thead>
                <tr className="sticky top-0 border-b border-orange-100 bg-orange-50/80">
                  <th className="p-3 text-[11px] font-semibold uppercase tracking-wide text-gray-700 xl:text-xs">
                    TechnicianID
                  </th>
                  <th className="p-3 text-[11px] font-semibold uppercase tracking-wide text-gray-700 xl:text-xs">
                    Full Name
                  </th>
                  <th className="p-3 text-[11px] font-semibold uppercase tracking-wide text-gray-700 xl:text-xs">
                    Email
                  </th>
                  <th className="p-3 text-[11px] font-semibold uppercase tracking-wide text-gray-700 xl:text-xs">
                    Contact
                  </th>
                  <th className="p-3 text-[11px] font-semibold uppercase tracking-wide text-gray-700 xl:text-xs">
                    Organization
                  </th>
                  <th className="p-3 text-[11px] font-semibold uppercase tracking-wide text-gray-700 xl:text-xs">
                    Status
                  </th>
                  <th className="p-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-700 xl:text-xs">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 transition hover:bg-orange-50/40"
                  >
                    <td
                      className="p-3 align-top text-gray-700 break-words"
                      onClick={() => handleOpenModal(user)}
                    >
                      {user.id}
                    </td>
                    <td
                      className="p-3 align-top text-gray-700 break-words"
                      onClick={() => handleOpenModal(user)}
                    >
                      {user.first_name + " " + user.last_name}
                    </td>
                    <td
                      className="p-3 align-top text-gray-700 break-words"
                      onClick={() => handleOpenModal(user)}
                    >
                      {user.email}
                    </td>
                    <td
                      className="p-3 align-top text-gray-700 break-words"
                      onClick={() => handleOpenModal(user)}
                    >
                      {user.mobile_number}
                    </td>
                    <td
                      className="p-3 align-top text-gray-700 break-words"
                      onClick={() => handleOpenModal(user)}
                    >
                      {user.institute_name}
                    </td>
                    <td className="p-3 align-top">
                      {user.status === "Submitted" ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="mr-1 rounded-full bg-yellow-500 px-2 py-1 text-[10px] font-semibold text-white">
                            {user.status}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(user.id, "Approved");
                            }}
                            className="rounded bg-green-500 px-2 py-1 text-[10px] text-white transition hover:bg-green-600"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(user.id, "Declined");
                            }}
                            className="rounded bg-red-500 px-2 py-1 text-[10px] text-white transition hover:bg-red-600"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`block rounded-full px-2 py-1.5 text-center text-[10px] font-medium text-white ${user.status === "Approved" ? "bg-green-500" : user.status === "Declined" ? "bg-red-500" : "bg-gray-500"}`}
                        >
                          {user.status}
                        </span>
                      )}
                    </td>
                    <td className="p-3 align-top">
                      <div className="flex items-center justify-center gap-4">
                        <FaEye
                          className="cursor-pointer text-blue-500 transition hover:scale-110 hover:text-blue-700"
                          title="View / Edit Details"
                          size={18}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(user);
                          }}
                        />
                        <FaTrash
                          className="cursor-pointer text-red-500 transition hover:scale-110 hover:text-red-700"
                          title="Delete Technician"
                          size={18}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(user.id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UNIFIED VIEW / EDIT MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto px-4 py-8 flex justify-center">
          <div className="bg-[#f8f9fa] rounded-2xl w-full max-w-6xl shadow-2xl relative mb-auto flex flex-col">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-light z-10 transition-colors bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm"
              title="Close"
            >
              &times;
            </button>

            <ProfileForm userId={selectedUser.user_id} />

            <div className="bg-gray-100 rounded-b-2xl p-6 border-t border-gray-200 flex justify-end gap-4 sticky bottom-0 z-10">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition drop-shadow-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showRegister && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto px-4 py-8 flex justify-center">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative mb-auto flex flex-col">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-light z-10 transition-colors bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm"
              title="Close"
            >
              &times;
            </button>

            <Register />
          </div>
        </div>
      )}
    </div>
  );
}
