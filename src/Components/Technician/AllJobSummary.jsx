import React, { useEffect, useState } from "react";
import { FaCheck, FaEye } from "react-icons/fa";
import { API_BASE } from "../../config";
import ServiceRequestModal from "./ServiceRequestModal";
import { formatDate } from "../utils/format";
import { formatPhone } from "../utils/phone";
import {
  ActionButton,
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
  TableSkeleton,
  TableToolbar,
  Td,
  Th,
  Tr,
} from "../admin/TableUI";

const STATUS_OPTIONS = [
  { value: "All", label: "All Statuses" },
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Rejected", label: "Rejected" },
  { value: "Pass", label: "Pass" },
];

export default function AllJobSummary() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const token = sessionStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredJobs = jobs.filter((job) => {
    const query = search.trim().toLowerCase();
    const haystack = [
      `SR/${job.id}`,
      `SR-${String(job.id).padStart(4, "0")}`,
      job.full_name,
      job.contact_number,
      formatPhone(job.contact_number),
      job.email,
      job.institute_name,
      job.institute_address,
      job.physical_address,
      job.instrument_name,
      job.instrument_model,
      job.instrument_brand,
      job.instrument_manufacturer,
      job.issue_description,
      job.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !query || haystack.includes(query);
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const techId = sessionStorage.getItem("technician_id");
    if (!techId) {
      console.error("Technician ID not found in sessionStorage");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/user/service-request/${techId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch job summary");
        }
        return res.json();
      })
      .then((data) => {
        let allRequests = [];
        if (Array.isArray(data)) {
          allRequests = data;
        } else if (data && Array.isArray(data.requests)) {
          allRequests = data.requests;
        } else if (data && Array.isArray(data.data)) {
          allRequests = data.data;
        }

        setJobs(allRequests);
      })
      .catch((err) => {
        console.error("Error fetching job summaries:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleUpdateStatus = async (jobId) => {
    if (!jobId) {
      console.error("Job ID is undefined, cannot update status");
      return;
    }

    setUpdatingId(jobId);
    try {
      const response = await fetch(`${API_BASE}/service-request/status/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (response.ok) {
        setJobs((prevJobs) =>
          prevJobs.map((job) => (job.id === jobId ? { ...job, status: "Completed" } : job))
        );
        window.location.reload();
      } else {
        console.error("Failed to update status on server");
        setJobs((prevJobs) =>
          prevJobs.map((job) => (job.id === jobId ? { ...job, status: "Completed" } : job))
        );
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === jobId ? { ...job, status: "Completed" } : job))
      );
      window.location.reload();
    } finally {
      setUpdatingId(null);
      window.location.reload();
    }
  };

  return (
    <>
      <TableCard>
        <TableHead
          title="All Job Summary"
          subtitle="Complete history of every job assigned to you"
        />

        <TableToolbar>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by ID, client, institute, instrument…"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
            className="sm:max-w-[10.5rem]"
          />
          <RecordsBadge count={filteredJobs.length} noun="jobs" />
        </TableToolbar>

        {loading ? (
          <TableSkeleton rows={8} columns={8} />
        ) : jobs.length === 0 ? (
          <TableEmpty
            title="No job summaries"
            message="Jobs you accept will be listed here with their full history."
          />
        ) : filteredJobs.length === 0 ? (
          <TableEmpty
            title="No matching jobs"
            message="No jobs match the current search or status filter."
            hint="Try clearing the filters"
          />
        ) : (
          <TableScroll>
            <thead>
              <tr>
                <Th>Request</Th>
                <Th>Client</Th>
                <Th>Institute</Th>
                <Th>Instrument</Th>
                <Th>Problem</Th>
                <Th>Requested On</Th>
                <Th>Accepted On</Th>
                <Th>Completed On</Th>
                <Th>Status</Th>
                <Th>Feedback</Th>
                <Th align="center">Actions</Th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.map((job) => (
                <Tr key={job.id} onClick={() => setSelectedJob(job)}>
                  <Td>
                    <IdTag prefix="SR-" value={String(job.id).padStart(4, "0")} />
                  </Td>
                  <Td>{job.full_name}</Td>
                  <Td>
                    <span className="text-gray-600">{job.institute_name || "—"}</span>
                  </Td>
                  <Td>
                    <span className="text-gray-600">{job.instrument_name}</span>
                  </Td>
                  <Td>
                    <span className="line-clamp-2" title={job.issue_description}>
                      {job.issue_description || "—"}
                    </span>
                  </Td>
                  <Td>
                    <span className="whitespace-nowrap text-xs text-gray-500">
                      {formatDate(job.created_at)}
                    </span>
                  </Td>
                  <Td>
                    <span className="whitespace-nowrap text-xs text-gray-500">
                      {formatDate(job.start_date)}
                    </span>
                  </Td>
                  <Td>
                    <span className="whitespace-nowrap text-xs text-gray-500">
                      {formatDate(job.end_date)}
                    </span>
                  </Td>
                  <Td>
                    <StatusPill status={job.status} />
                  </Td>
                  <Td>
                    {job.rate || job.review ? (
                      <div className="max-w-[180px] space-y-0.5">
                        {job.rate ? (
                          <p className="text-xs font-semibold text-orange-600">
                            Rating: {job.rate}
                          </p>
                        ) : null}
                        {job.review ? (
                          <p className="truncate text-xs text-gray-500" title={job.review}>
                            {job.review}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-xs italic text-gray-300">—</span>
                    )}
                  </Td>
                  <Td align="center">
                    <div className="flex items-center justify-center gap-1.5">
                      {job.status === "In Progress" ? (
                        <ActionButton
                          tone="green"
                          icon={FaCheck}
                          disabled={updatingId === job.id}
                          title="Mark as completed"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(job.id);
                          }}
                        >
                          {updatingId === job.id ? "Updating…" : "Complete"}
                        </ActionButton>
                      ) : null}
                      <IconButton
                        tone="blue"
                        icon={FaEye}
                        title="View Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                        }}
                      />
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableScroll>
        )}
      </TableCard>

      <ServiceRequestModal request={selectedJob} onClose={() => setSelectedJob(null)} />
    </>
  );
}
