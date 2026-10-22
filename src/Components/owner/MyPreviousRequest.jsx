import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { fetchWithAuth } from "../utils/api";
import { API_BASE } from "../../config";
import { dateOnly } from "../utils/format";
import { formatPhone } from "../utils/phone";
import {
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
  { value: "Cancelled", label: "Cancelled" },
];

const DETAIL_GROUPS = [
  {
    title: "Instrument",
    fields: [
      ["Instrument Name", "instrument_name"],
      ["Instrument Brand", "instrument_brand"],
      ["Instrument Model", "instrument_model"],
      ["Manufacturer", "instrument_manufacturer"],
      ["Manufactured Year", "manufactured_year"],
      ["Product Testing Type", "product_testing_type"],
      ["Testing Parameter", "testing_parameter"],
      ["Consumption Period", "consumption_period"],
    ],
  },
  {
    title: "Technician",
    fields: [
      ["Technician Name", "technician_name"],
      ["Technician Email", "technician_email"],
      ["Technician Contact", "personal_number"],
      ["Institute Name", "institute_name"],
    ],
  },
];

function DetailItem({ label, children, wide = false }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <div className="mt-1 text-sm text-gray-700">{children ?? "\u2014"}</div>
    </div>
  );
}

export default function MyPreviousRequestHistoryTable() {
  const token = sessionStorage.getItem("token");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const query = searchTerm.trim().toLowerCase();
    const haystack = [
      `SR/${job.id}`,
      `SR-${String(job.id).padStart(4, "0")}`,
      job.instrument_name,
      job.issue_description,
      job.technician_name,
      job.status,
      job.created_at,
      job.start_date,
      job.end_date,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !query || haystack.includes(query);
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;

    const jobDate = dateOnly(job.created_at);
    let matchesDate = true;
    if (fromDate && (!jobDate || jobDate < fromDate)) matchesDate = false;
    if (toDate && (!jobDate || jobDate > toDate)) matchesDate = false;

    return matchesSearch && matchesStatus && matchesDate;
  });

  useEffect(() => {
    const fetchServiceRequests = async () => {
      setLoading(true);
      try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) throw new Error("User not logged in");

        const response = await fetchWithAuth(`${API_BASE}/user/my-requests`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (!response) return;

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No data found or server error");
        }

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
  }, [token]);

  return (
    <>
      <TableCard>
        <TableHead
          title="Service Request History"
          subtitle="Every instrument service request you have raised"
        />

        <TableToolbar>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by ID, instrument, status…"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
            className="sm:max-w-[10.5rem]"
          />
          <DateField label="From" value={fromDate} onChange={setFromDate} />
          <DateField label="To" value={toDate} onChange={setToDate} />
          <RecordsBadge count={filteredJobs.length} noun="requests" />
        </TableToolbar>

        {loading ? (
          <TableSkeleton rows={8} columns={7} />
        ) : filteredJobs.length === 0 ? (
          <TableEmpty
            title="No service requests"
            message="No requests match the current search, status or date range."
            hint="Try clearing the filters"
          />
        ) : (
          <TableScroll>
            <thead>
              <tr>
                <Th>Request</Th>
                <Th>Instrument</Th>
                <Th>Problem Description</Th>
                <Th>Technician</Th>
                <Th>Status</Th>
                <Th>Requested On</Th>
                <Th>Accepted On</Th>
                <Th>Completed On</Th>
                <Th align="center">Actions</Th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.map((job) => (
                <Tr key={job.id} onClick={() => setSelectedJob(job)}>
                  <Td>
                    <IdTag value={`SR-${String(job.id).padStart(4, "0")}`} />
                  </Td>
                  <Td>
                    <span className="text-gray-600">{job.instrument_name}</span>
                  </Td>
                  <Td>
                    <span className="line-clamp-2" title={job.issue_description}>
                      {job.issue_description || "\u2014"}
                    </span>
                  </Td>
                  <Td>{job.technician_name || "Unassigned"}</Td>
                  <Td>
                    <StatusPill status={job.status} />
                  </Td>
                  <Td>
                    <span className="whitespace-nowrap text-xs text-gray-500">
                      {dateOnly(job.created_at)}
                    </span>
                  </Td>
                  <Td>
                    <span className="whitespace-nowrap text-xs text-gray-500">
                      {dateOnly(job.start_date)}
                    </span>
                  </Td>
                  <Td>
                    <span className="whitespace-nowrap text-xs text-gray-500">
                      {dateOnly(job.end_date)}
                    </span>
                  </Td>
                  <Td align="center">
                    <div className="flex items-center justify-center gap-1.5">
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

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-gradient-to-b from-white to-orange-50/40 px-6 py-4">
              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-gray-900">
                  Service Request Details
                </h2>
                <div className="mt-1.5 flex items-center gap-2">
                  <IdTag prefix="SR-" value={String(selectedJob.id).padStart(4, "0")} />
                  <StatusPill status={selectedJob.status} />
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                title="Close"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="flex-grow space-y-6 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailItem label="Problem Description" wide>
                  {selectedJob.issue_description}
                </DetailItem>
                <DetailItem label="Request Date">{dateOnly(selectedJob.created_at)}</DetailItem>
                <DetailItem label="Accept Date">{dateOnly(selectedJob.start_date)}</DetailItem>
                <DetailItem label="Completed Date">{dateOnly(selectedJob.end_date)}</DetailItem>
                <DetailItem label="Institute Address" wide>
                  {selectedJob.institute_address}
                </DetailItem>
              </div>

              {DETAIL_GROUPS.map((group) => (
                <section key={group.title}>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-orange-600">
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {group.fields.map(([label, key]) => (
                      <DetailItem key={key} label={label}>
                        {key === "personal_number"
                          ? formatPhone(selectedJob[key])
                          : selectedJob[key]}
                      </DetailItem>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-orange-50/30 px-6 py-4">
              <button
                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-600 active:scale-[0.98]"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
