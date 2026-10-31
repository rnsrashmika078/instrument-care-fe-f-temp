import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
} from "lucide-react";
import { fetchWithAuth } from "../../utils/api";
import { API_BASE } from "../../../config";
import InstituteOverviewCards from "./InstituteOverviewCards";
import InstituteReportCharts from "./InstituteReportCharts";
import InstrumentCategoryTable from "./InstrumentCategoryTable";
import ReportDataTable from "./ReportDataTable";
import ReportFilterSidebar from "./ReportFilterSidebar";
import ServiceRequestStatusModal from "./ServiceRequestStatusModal";
import TechnicianStatsSection from "./TechnicianStatsSection";
import { StatusBadge } from "./reportHelpers";
import { formatDateTime, getPresetRange } from "./reportUtils";

const emptySpecificFilters = {
  types: [],
  conditions: [],
  faculties: [],
  years: [],
  statuses: [],
  date_from: "",
  date_to: "",
};

const buildFilterQuery = (activeFilters) => {
  const search = new URLSearchParams();

  Object.entries(activeFilters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        search.set(key, value.join(","));
      }
    } else if (typeof value === "string" && value.trim() !== "") {
      search.set(key, value.trim());
    }
  });

  return search.toString();
};

const statusRequestMap = {
  pending_requests: "Pending",
  in_progress_requests: "In Progress",
  completed_requests: "Completed",
  rejected_requests: "Rejected",
};

const instrumentColumns = [
  { key: "instrument_name", label: "Instrument" },
  { key: "instrument_type", label: "Testing Service" },
  { key: "faculty_name", label: "Faculty" },
  { key: "department_name", label: "Department" },
  { key: "laboratory_name", label: "Laboratory" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "model", label: "Model" },
  { key: "year_of_manufacture", label: "Year" },
  { key: "instrument_condition", label: "Condition" },
];

const technicianColumns = [
  { key: "name", label: "Technician" },
  { key: "email", label: "Email" },
  { key: "mobile_number", label: "Mobile" },
  { key: "designation", label: "Designation" },
  { key: "district", label: "District" },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge value={row.status} />,
  },
];

const laboratoryColumns = [
  { key: "laboratory_name", label: "Laboratory" },
  { key: "accreditation_status", label: "Accreditation" },
  { key: "accreditation_type", label: "Type" },
  { key: "phone_number", label: "Phone" },
  { key: "email", label: "Email" },
];

const serviceRequestColumns = [
  { key: "id", label: "Request", render: (row) => `SR-${row.id}` },
  { key: "full_name", label: "Requested By" },
  { key: "instrument_name", label: "Instrument" },
  { key: "technician_name", label: "Technician" },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge value={row.status} />,
  },
  {
    key: "created_at",
    label: "Created",
    render: (row) => formatDateTime(row.created_at),
  },
];

const facultyColumns = [
  { key: "faculty_name", label: "Faculty" },
  { key: "phone_number", label: "Phone" },
  { key: "email", label: "Email" },
];

const departmentColumns = [
  { key: "department_name", label: "Department" },
  { key: "faculty_name", label: "Faculty" },
];

export default function InstituteReport({
  filterOptions = {},
  initialInstituteId = "",
  lockedInstitute = false,
}) {
  const [selectedId, setSelectedId] = useState(() =>
    String(initialInstituteId || ""),
  );
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(emptySpecificFilters);
  const [datePreset, setDatePreset] = useState("all");
  const [selectedStatusKey, setSelectedStatusKey] = useState(null);
  const requestRef = useRef(0);
  const lastLoadedIdRef = useRef("");
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (lockedInstitute) {
      setSelectedId(String(initialInstituteId || ""));
    }
  }, [initialInstituteId, lockedInstitute]);

  const effectiveFilterOptions = useMemo(() => {
    const hasOptions = Object.values(filterOptions || {}).some(
      (value) => Array.isArray(value) && value.length > 0,
    );

    return hasOptions ? filterOptions : (data?.filters ?? {});
  }, [filterOptions, data?.filters]);

  const options = useMemo(() => {
    const list = Array.isArray(effectiveFilterOptions?.institutes)
      ? [...effectiveFilterOptions.institutes]
      : [];

    const currentInstitute = data?.institute;
    if (
      currentInstitute &&
      !list.some(
        (item) => String(item.id) === String(currentInstitute.institute_id),
      )
    ) {
      list.push({
        id: currentInstitute.institute_id,
        label: currentInstitute.name,
      });
    }

    return list
      .map((item) => ({
        institute_id: item.id,
        name: item.label,
      }))
      .sort((a, b) =>
        String(a.name ?? "").localeCompare(String(b.name ?? "")),
      );
  }, [effectiveFilterOptions, data?.institute]);

  const loadInstitute = useCallback(
    async (id, isRefresh = false, activeFilters = emptySpecificFilters) => {
      if (!id) return;

      const requestId = ++requestRef.current;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      try {
        const query = buildFilterQuery(activeFilters);
        const response = await fetchWithAuth(
          `${API_BASE}/admin/reports/institute/${id}${query ? `?${query}` : ""}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          },
        );

        if (!response) return;

        if (!response.ok) {
          throw new Error(
            `Institute report request failed (${response.status})`,
          );
        }

        const json = await response.json();

        if (requestId === requestRef.current) {
          setData(json);
        }
      } catch (err) {
        if (requestId === requestRef.current) {
          console.error("Failed to load institute report:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this institution's report.",
          );
        }
      } finally {
        if (requestId === requestRef.current) {
          setLoading(false);
          setRefreshing(false);
          lastLoadedIdRef.current = id;
          hasLoadedRef.current = true;
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!selectedId) {
      requestRef.current += 1;
      lastLoadedIdRef.current = "";
      hasLoadedRef.current = false;
      setData(null);
      setError("");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const isRefresh =
      hasLoadedRef.current && lastLoadedIdRef.current === selectedId;

    if (!isRefresh) {
      setData(null);
    }

    const timer = window.setTimeout(
      () => loadInstitute(selectedId, isRefresh, filters),
      isRefresh ? 250 : 0,
    );

    return () => window.clearTimeout(timer);
  }, [selectedId, filters, loadInstitute]);

  const handleFilterChange = useCallback((group, value, checked) => {
    setFilters((current) => {
      const values = current[group] ?? [];
      const nextValues = checked
        ? Array.from(new Set([...values, value]))
        : values.filter((item) => item !== value);

      return { ...current, [group]: nextValues };
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setDatePreset("all");
    setFilters(emptySpecificFilters);
  }, []);

  const handleDatePresetChange = useCallback((preset) => {
    setDatePreset(preset);

    if (preset === "custom") {
      return;
    }

    const range = getPresetRange(preset);
    setFilters((current) => ({
      ...current,
      date_from: range.from,
      date_to: range.to,
    }));
  }, []);

  const handleDateChange = useCallback((field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  }, []);

  const handleClearDateFilter = useCallback(() => {
    setDatePreset("all");
    setFilters((current) => ({
      ...current,
      date_from: "",
      date_to: "",
    }));
  }, []);

  const handleExportInstituteReport = useCallback(
    async (id) => {
      setLoading(true);
      setError("");
      try {
        const query = buildFilterQuery(filters);
        const response = await fetchWithAuth(
          `${API_BASE}/admin/reports/institute/${id}${query ? `?${query}` : ""}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          },
        );

        if (!response) return;

        if (!response.ok) {
          throw new Error(`Export request failed (${response.status})`);
        }

        const json = await response.json();
        
        // Trigger download
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `institute_report_${id}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        console.error("Failed to export institute report:", err);
        setError("Export failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  const sidebarSelected = {
    ...filters,
    institutes: selectedId ? [String(selectedId)] : [],
  };

  const institute = data?.institute;
  const overview = data?.overview ?? {};
  const selectedStatus = selectedStatusKey
    ? statusRequestMap[selectedStatusKey]
    : null;
  const selectedStatusRequests = selectedStatus
    ? (data?.service_requests ?? []).filter(
        (request) => request.status === selectedStatus,
      )
    : [];
  const selectedStatusTotal = selectedStatusKey
    ? Number(overview?.[selectedStatusKey] ?? 0)
    : 0;

  return (
    <div className="space-y-5">
      <section className="rounded-[1.5rem] border border-gray-200 bg-white p-4 md:p-5">
        <label
          htmlFor="institute-report-select"
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500"
        >
          {lockedInstitute ? "Your institution" : "Select institution"}
        </label>
        {lockedInstitute ? (
          <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-700 md:max-w-xl">
            {institute?.name ??
              (selectedId
                ? "Loading institution..."
                : "No institution is linked to your account.")}
          </div>
        ) : (
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <select
              id="institute-report-select"
              value={selectedId}
              onChange={(event) => {
                setSelectedStatusKey(null);
                setSelectedId(event.target.value);
              }}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-orange-300 focus:bg-white md:max-w-xl"
            >
              <option value="">Choose an institution...</option>
              {options.map((row) => (
                <option key={row.institute_id} value={row.institute_id}>
                  {row.name ?? `Institution #${row.institute_id}`}
                </option>
              ))}
            </select>

            <span className="text-xs text-gray-500">
              {options.length} institution(s) available
            </span>
          </div>
        )}
        <p className="mt-2 text-xs text-gray-500">
          {lockedInstitute
            ? "Your account can view the specific report for its linked institution only."
            : "Select an institution to see its instruments, people, laboratories, facilities and service requests."}
        </p>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="min-w-0 space-y-5">
          {!selectedId ? (
        <section className="flex flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500">
            <Building2 className="h-7 w-7" />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {lockedInstitute
                ? "No institution linked"
                : "No institution selected"}
            </p>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-gray-500">
              {lockedInstitute
                ? "Your account does not have an institution assigned, so no specific report is available."
                : "Use the dropdown above to pick an institution and generate its specific instrument care report."}
            </p>
          </div>
        </section>
      ) : null}

      {error ? (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Could not load institution report</p>
            <p className="mt-1 text-rose-600">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => loadInstitute(selectedId, true, filters)}
            className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            Retry
          </button>
        </div>
      ) : null}

      {loading || !selectedId ? null : (
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => handleExportInstituteReport(selectedId)}
            className="inline-flex items-center gap-2 rounded-xl border border-green-500 bg-green-100 px-4 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15l3-3L9 6l-3 3z" />
            </svg>
            Export All
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-5">
          <div className="h-28 animate-pulse rounded-[1.5rem] border border-gray-200 bg-white" />
          <InstituteOverviewCards overview={{}} loading />
          <TechnicianStatsSection overview={{}} loading />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-[1.5rem] border border-gray-200 bg-white"
              />
            ))}
          </div>
        </div>
      ) : null}

      {!loading && institute ? (
        <>
          <section className="rounded-[1.5rem] border border-gray-200 bg-white p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white">
                  <Building2 className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                    {institute.name ?? `Institution #${institute.institute_id}`}
                  </h2>
                  {institute.ministry ? (
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-orange-600">
                      {institute.ministry}
                    </p>
                  ) : null}

                  <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                    {institute.address ? (
                      <span className="inline-flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        {institute.address}
                      </span>
                    ) : null}
                    {institute.email ? (
                      <span className="inline-flex items-start gap-2">
                        <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        {institute.email}
                      </span>
                    ) : null}
                    {institute.phone_number ? (
                      <span className="inline-flex items-start gap-2">
                        <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        {institute.phone_number}
                      </span>
                    ) : null}
                  </div>

                  {institute.description ? (
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-500">
                      {institute.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={() => loadInstitute(selectedId, true, filters)}
                disabled={refreshing}
                className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </section>

          <InstituteOverviewCards overview={overview} />

          <TechnicianStatsSection
            overview={overview}
            onSelectStatus={setSelectedStatusKey}
          />

          <InstituteReportCharts data={data} />

          <InstrumentCategoryTable
            rows={data?.instruments_by_type}
            subtitle="Popular testing services in this institution"
          />

<ReportDataTable
              title="Instruments"
              subtitle={`${data?.instruments?.length ?? 0} instrument(s) registered under this institution`}
              columns={instrumentColumns}
              rows={data?.instruments}
              searchable
              searchPlaceholder="Search instruments"
              emptyMessage="No instruments are registered under this institution."
              maxHeightClass="max-h-[560px] overflow-y-auto"
              showPagination
            />

          <div className="grid grid-cols-1 gap-5">
            <ReportDataTable
              title="Technicians"
              subtitle={`${data?.technicians?.length ?? 0} technician(s)`}
              columns={technicianColumns}
              rows={data?.technicians}
              searchable
              searchPlaceholder="Search technicians"
              emptyMessage="No technicians are linked to this institution."
              showPagination
            />

            <ReportDataTable
              title="Service Requests"
              subtitle={`${data?.service_requests?.length ?? 0} request(s)`}
              columns={serviceRequestColumns}
              rows={data?.service_requests}
              searchable
              searchPlaceholder="Search requests"
              emptyMessage="No service requests have been raised by this institution."
              showPagination
            />
          </div>

<ReportDataTable
              title="Laboratories"
              subtitle={`${data?.laboratories?.length ?? 0} laboratory/laboratories`}
              columns={laboratoryColumns}
              rows={data?.laboratories}
              searchable
              searchPlaceholder="Search laboratories"
              emptyMessage="No laboratories are registered under this institution."
              showPagination
            />

          <div className="grid grid-cols-1 gap-5">
            <ReportDataTable
              title="Faculties"
              subtitle={`${data?.faculties?.length ?? 0} faculty/faculties`}
              columns={facultyColumns}
              rows={data?.faculties}
              searchable
              searchPlaceholder="Search faculties"
              emptyMessage="No faculties are registered under this institution."
              showPagination
            />

            <ReportDataTable
              title="Departments"
              subtitle={`${data?.departments?.length ?? 0} department(s)`}
              columns={departmentColumns}
              rows={data?.departments}
              searchable
              searchPlaceholder="Search departments"
              emptyMessage="No departments are registered under this institution."
              showPagination
            />
          </div>
        </>
      ) : null}
        </div>

        <div className="order-first xl:order-none xl:sticky xl:top-20 xl:self-start">
          <ReportFilterSidebar
            options={effectiveFilterOptions}
            selected={sidebarSelected}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            loading={Boolean(selectedId) && (loading || refreshing)}
            lockedKeys={["institutes"]}
            showDateFilter
            datePreset={datePreset}
            onDatePresetChange={handleDatePresetChange}
            onDateChange={handleDateChange}
            onClearDateFilter={handleClearDateFilter}
          />
        </div>
      </div>

      {selectedStatus ? (
        <ServiceRequestStatusModal
          status={selectedStatus}
          requests={selectedStatusRequests}
          total={selectedStatusTotal}
          onClose={() => setSelectedStatusKey(null)}
        />
      ) : null}
    </div>
  );
}
