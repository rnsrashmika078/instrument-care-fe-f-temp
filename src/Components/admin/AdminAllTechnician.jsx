import { API_BASE } from "../../config";
import { formatPhone } from "../utils/phone";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCheck,
  FaFileCsv,
  FaTimes,
  FaTrash,
  FaUserPlus,
  FaEye,
} from "react-icons/fa";
import ProfileForm from "../Technician/ProfileEditForm";
// import AreasOfTechnicalExpertiseView from "../Technician/AreasOfTechnicalExpertiseView";
// import Register from "../auth/Technician-Registration"
import Register from "./AddTechnician";
import { toast } from "react-toastify";
import {
  ActionButton,
  ConfirmDialog,
  DateField,
  FilterSelect,
  IconButton,
  IdTag,
  RecordsBadge,
  SearchInput,
  StatusPill,
  TableCard,
  TableEmpty,
  TableHead,
  TableScroll,
  TableToolbar,
  Td,
  Th,
  Tr,
} from "./TableUI";

const STATUS_OPTIONS = [
  { value: "All", label: "All Statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Submitted", label: "Submitted" },
  { value: "Approved", label: "Approved" },
  { value: "Declined", label: "Declined" },
];

const GENDER_OPTIONS = [
  { value: "All", label: "All Genders" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const DISTRICTS = [
  "All", "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy",
  "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara",
  "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam",
  "Ratnapura", "Trincomalee", "Vavuniya",
];

const DISTRICT_OPTIONS = DISTRICTS.map((d) => ({
  value: d,
  label: d === "All" ? "All Districts" : d,
}));

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
  const [statusAction, setStatusAction] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Keep in sync if the parent refetches the list.
  useEffect(() => {
    setUsers(usersData || []);
  }, [usersData]);

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

  const requestStatusUpdate = (user, newStatus) => {
    setStatusAction({
      id: user.id,
      newStatus,
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "This technician",
    });
  };

  const closeStatusDialog = () => {
    if (statusUpdating) return;
    setStatusAction(null);
  };

  const handleStatusUpdate = async () => {
    if (!statusAction) return;

    const { id, newStatus } = statusAction;
    setStatusUpdating(true);

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
        setStatusAction(null);
      } else {
        toast.error(result.error || "Failed to update technician status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating the status.");
    } finally {
      setStatusUpdating(false);
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
      "Supervisor Confirmation",
      "Registration Date",
    ];

    const csvRows = [headers.join(",")];

    filteredUsers.forEach((user) => {
      const row = [
        user.id || "",
        `"${(user.first_name || "").replace(/"/g, '""')}"`,
        `"${(user.last_name || "").replace(/"/g, '""')}"`,
        `"${(user.email || "").replace(/"/g, '""')}"`,
        `"${(formatPhone(user.mobile_number) || "").replace(/"/g, '""')}"`,
        `"${(user.gender || "").replace(/"/g, '""')}"`,
        `"${(user.title || "").replace(/"/g, '""')}"`,
        `"${(user.designation || "").replace(/"/g, '""')}"`,
        `"${(user.institute_name || "").replace(/"/g, '""')}"`,
        `"${(user.district || "").replace(/"/g, '""')}"`,
        `"${user.status || ""}"`,
        `"${user.supervisor_invite_status || "No Invitation"}"`,
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

  return (
    <>
      <TableCard>
        <TableHead
          title="All Technicians"
          subtitle="Registered technicians, approval status and supervisor confirmation"
          actions={
            <>
              <ActionButton
                tone="green"
                icon={FaFileCsv}
                onClick={handleExportCSV}
              >
                Export CSV
              </ActionButton>
              <ActionButton
                tone="orange"
                icon={FaUserPlus}
                onClick={() => setShowRegister(true)}
              >
                Add Technician
              </ActionButton>
            </>
          }
        />

        <TableToolbar>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search anything…"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
            className="sm:max-w-[10rem]"
          />
          <FilterSelect
            value={genderFilter}
            onChange={setGenderFilter}
            options={GENDER_OPTIONS}
            className="sm:max-w-[9.5rem]"
          />
          <FilterSelect
            value={districtFilter}
            onChange={setDistrictFilter}
            options={DISTRICT_OPTIONS}
            className="sm:max-w-[11rem]"
          />
          <DateField label="From" value={fromDate} onChange={setFromDate} />
          <DateField label="To" value={toDate} onChange={setToDate} />
          <RecordsBadge count={filteredUsers.length} noun="technicians" />
        </TableToolbar>

        {filteredUsers.length === 0 ? (
          <TableEmpty
            title="No technicians found"
            message="No technicians match the current search and filters."
            hint="Try clearing the filters"
          />
        ) : (
          <TableScroll>
            <thead>
              <tr>
                <Th>Ref</Th>
                <Th>Technician</Th>
                <Th>Email</Th>
                <Th>Contact</Th>
                <Th>Organization</Th>
                <Th>Status</Th>
                <Th>Supervisor</Th>
                <Th align="center">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => {
                const hasSupervisor = Number(user.has_supervisor) === 1;
                const consentGiven =
                  user.supervisor_invite_status === "consented";
                const canReview =
                  user.status === "Submitted" &&
                  (!hasSupervisor || consentGiven);

                return (
                  <Tr key={i} onClick={() => handleOpenModal(user)}>
                    <Td>
                      <IdTag value={`TECH-${String(user.id).padStart(4, "0")}`} />
                    </Td>
                    <Td>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-gray-800">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.title || user.designation || "Technician"}
                        </span>
                      </div>
                    </Td>
                    <Td>
                      <span className="text-gray-600">{user.email || "—"}</span>
                    </Td>
                    <Td>
                      <span className="whitespace-nowrap text-gray-600">
                        {formatPhone(user.mobile_number) || "—"}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-gray-600">
                        {user.institute_name || "—"}
                      </span>
                    </Td>
                    <Td>
                      {canReview ? (
                        <div className="flex items-center gap-1.5">
                          <StatusPill status={user.status} />
                          <IconButton
                            tone="green"
                            icon={FaCheck}
                            title="Approve"
                            onClick={(e) => {
                              e.stopPropagation();
                              requestStatusUpdate(user, "Approved");
                            }}
                          />
                          <IconButton
                            tone="red"
                            icon={FaTimes}
                            title="Decline"
                            onClick={(e) => {
                              e.stopPropagation();
                              requestStatusUpdate(user, "Declined");
                            }}
                          />
                        </div>
                      ) : (
                        <StatusPill status={user.status} />
                      )}
                    </Td>
                    <Td>
                      {user.supervisor_invite_status ? (
                        <Link
                          to={`/admin/supervisor-view/${user.user_id}`}
                          onClick={(e) => e.stopPropagation()}
                          title="View supervisor confirmation details"
                          className="inline-flex items-center gap-2"
                        >
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-sky-600 transition hover:bg-sky-50">
                            <FaEye className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <StatusPill status={user.supervisor_invite_status} />
                        </Link>
                      ) : (
                        <span className="text-xs italic text-gray-300">
                          No Invitation
                        </span>
                      )}
                    </Td>
                    <Td align="center">
                      <div className="flex items-center justify-center gap-1.5">
                        <IconButton
                          tone="blue"
                          icon={FaEye}
                          title="View / Edit Details"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(user);
                          }}
                        />
                        <IconButton
                          tone="red"
                          icon={FaTrash}
                          title="Delete Technician"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(user.id);
                          }}
                        />
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </TableScroll>
        )}
      </TableCard>

      <ConfirmDialog
        open={Boolean(statusAction)}
        icon={statusAction?.newStatus === "Declined" ? FaTimes : FaCheck}
        tone={statusAction?.newStatus === "Declined" ? "red" : "green"}
        title={
          statusAction?.newStatus === "Declined"
            ? "Decline this technician?"
            : "Approve this technician?"
        }
        message={
          statusAction?.newStatus === "Declined"
            ? "They will not be able to accept service requests until they are approved."
            : "They will be able to accept service requests and appear in client search results."
        }
        detail={statusAction?.name}
        confirmLabel={
          statusAction?.newStatus === "Declined" ? "Decline" : "Approve"
        }
        cancelLabel="Cancel"
        busy={statusUpdating}
        onConfirm={handleStatusUpdate}
        onCancel={closeStatusDialog}
      />

      {/* UNIFIED VIEW / EDIT MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-8 flex justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="relative mb-auto flex w-full max-w-6xl flex-col rounded-2xl bg-[#f8f9fa] shadow-2xl">
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl font-light text-gray-400 shadow-sm transition hover:text-gray-800"
              title="Close"
              aria-label="Close"
            >
              &times;
            </button>

            <ProfileForm userId={selectedUser.user_id} readOnly />

            {/* <div className="mt-6">
              <AreasOfTechnicalExpertiseView
                userId={selectedUser.user_id}
              />
            </div> */}
          </div>
        </div>
      )}

      {showRegister && (
        <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-8 flex justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="relative mb-auto flex w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl font-light text-gray-400 shadow-sm transition hover:text-gray-800"
              title="Close"
              aria-label="Close"
            >
              &times;
            </button>

            <Register />
          </div>
        </div>
      )}
    </>
  );
}
