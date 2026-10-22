import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../config";
import { formatDate } from "../utils/format";
import {
  ActionButton,
  IdTag,
  StatusPill,
  TableCard,
  TableEmpty,
  TableHead,
  TableScroll,
  TableSkeleton,
  Td,
  Th,
  Tr,
} from "../admin/TableUI";

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

        const response = await fetch(`${API_BASE}/user/service-request/${techId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch job summaries");
        }

        const data = await response.json();
        const payload = Array.isArray(data) ? data : data?.data ?? data?.requests ?? [];

        setJobs(payload);
      } catch (error) {
        console.error("Error fetching job summaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  return (
    <TableCard>
      <TableHead
        title="Job Summary"
        subtitle="Latest technician activity"
        actions={
          <Link to="/tech/all-job-summary">
            <ActionButton>View all</ActionButton>
          </Link>
        }
      />

      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : jobs.length === 0 ? (
        <TableEmpty
          title="No job summaries"
          message="Jobs you accept will show up here with their latest status."
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <TableScroll maxHeight="max-h-[320px]">
              <thead>
                <tr>
                  <Th>Request</Th>
                  <Th>Client</Th>
                  <Th>Instrument</Th>
                  <Th>Requested On</Th>
                  <Th>Location</Th>
                  <Th>Status</Th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <Tr key={job.id}>
                    <Td>
                      <IdTag prefix="SR-" value={String(job.id).padStart(4, "0")} />
                    </Td>
                    <Td>{job.full_name}</Td>
                    <Td>
                      <span className="text-gray-600">{job.instrument_name}</span>
                    </Td>
                    <Td>
                      <span className="whitespace-nowrap text-xs text-gray-500">
                        {formatDate(job.created_at)}
                      </span>
                    </Td>
                    <Td>
                      <span className="block max-w-[180px] truncate text-gray-600">
                        {job.physical_address}
                      </span>
                    </Td>
                    <Td>
                      <StatusPill status={job.status} />
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableScroll>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-4 space-y-3 max-h-[400px] overflow-y-auto">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border-2 border-gray-200 rounded-xl p-4 bg-white space-y-2"
              >
                <div className="flex justify-between items-start gap-2">
                  <IdTag prefix="SR-" value={String(job.id).padStart(4, "0")} />
                  <StatusPill status={job.status} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{job.full_name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{job.instrument_name}</p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span><span className="font-medium">Requested:</span> {formatDate(job.created_at)}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">
                  <span className="font-medium">Location:</span> {job.physical_address}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </TableCard>
  );
}
