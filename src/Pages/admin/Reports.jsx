import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Navbar from "../../Components/Technician/Navbar";
import ReportOverviewCards from "../../Components/admin/reports/ReportOverviewCards";
import ReportCharts from "../../Components/admin/reports/ReportCharts";
import InstituteSummaryTable from "../../Components/admin/reports/InstituteSummaryTable";
import InstrumentCategoryTable from "../../Components/admin/reports/InstrumentCategoryTable";
import InstrumentsByImpressionTable from "../../Components/admin/reports/InstrumentsByImpressionTable";
import TechniciansByImpressionTable from "../../Components/admin/reports/TechniciansByImpressionTable";
import InstituteReport from "../../Components/admin/reports/InstituteReport";
import ReportFilterSidebar from "../../Components/admin/reports/ReportFilterSidebar";
import ServiceRequestStatusModal from "../../Components/admin/reports/ServiceRequestStatusModal";
import { fetchWithAuth } from "../../Components/utils/api";
import {
  formatDateRange,
  getPresetRange,
  toISODate,
} from "../../Components/admin/reports/reportUtils";
import { API_BASE } from "../../config";

const emptyFilters = {
  institutes: [],
  types: [],
  conditions: [],
  faculties: [],
  years: [],
  statuses: [],
  date_from: "",
  date_to: "",
};

const emptyReport = {
  filters: emptyFilters,
  impressions_tracked_from: "",
  technician_impressions_tracked_from: "",
  overview: {},
  instruments_by_institute: [],
  instruments_by_type: [],
  instruments_by_condition: [],
  instruments_by_faculty: [],
  instruments_by_year: [],
  instruments_by_impression: [],
  technicians_by_impression: [],
  service_requests_by_status: [],
  service_requests_monthly: [],
  service_requests: [],
  technicians_by_institute: [],
  institute_summary: [],
};

const statusRequestMap = {
  pending_requests: "Pending",
  in_progress_requests: "In Progress",
  completed_requests: "Completed",
  rejected_requests: "Rejected",
};

const tabs = [
  { id: "general", label: "General" },
  { id: "specific", label: "Specific" },
];

export default function Reports() {
  const role = Number(sessionStorage.getItem("role") || 0);
  const canViewGeneral = role === 1 || role === 2;
  const rawInstituteId = Number(sessionStorage.getItem("institute_id") || 0);
  const sessionInstituteId =
    Number.isFinite(rawInstituteId) && rawInstituteId > 0
      ? String(rawInstituteId)
      : "";
  const visibleTabs = canViewGeneral
    ? tabs
    : tabs.filter((tab) => tab.id === "specific");

  const [report, setReport] = useState(emptyReport);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(
    canViewGeneral ? "general" : "specific",
  );
  const [selectedStatusKey, setSelectedStatusKey] = useState(null);
  const [filters, setFilters] = useState(emptyFilters);
  const [datePreset, setDatePreset] = useState("all");
  const requestRef = useRef(0);
  const loadedOnceRef = useRef(false);

  const loadReport = useCallback(
    async (isRefresh = false, activeFilters = emptyFilters) => {
      const requestId = requestRef.current + 1;
      requestRef.current = requestId;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      try {
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

        const query = search.toString();
        const response = await fetchWithAuth(
          `${API_BASE}/admin/reports${query ? `?${query}` : ""}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          },
        );

        if (!response) return;

        if (!response.ok) {
          throw new Error(`Report request failed (${response.status})`);
        }

        const data = await response.json();
        if (requestId !== requestRef.current) return;

        setReport({
          ...emptyReport,
          ...data,
          filters: data?.filters ?? emptyFilters,
          overview: data?.overview ?? {},
        });
      } catch (err) {
        if (requestId !== requestRef.current) return;

        console.error("Failed to load reports:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load the report data.",
        );
      } finally {
        if (requestId === requestRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!canViewGeneral) {
      setLoading(false);
      return undefined;
    }

    const isRefresh = loadedOnceRef.current;
    const timer = window.setTimeout(
      () => {
        loadReport(isRefresh, filters).finally(() => {
          loadedOnceRef.current = true;
        });
      },
      isRefresh ? 250 : 0,
    );

    return () => window.clearTimeout(timer);
  }, [filters, loadReport, canViewGeneral]);

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
    setFilters(emptyFilters);
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

  const dateRangeLabel = formatDateRange(filters.date_from, filters.date_to);

  const impressionsTrackedFrom =
    report.impressions_tracked_from || toISODate(new Date());
  const impressionsTrackedFromLabel = formatDateRange(
    impressionsTrackedFrom,
    impressionsTrackedFrom,
  );
  const impressionsNote = (
    <span className="mt-1 block text-[11px] text-gray-400">
      <span className="font-bold text-red-500">*</span> Impressions count
      from {impressionsTrackedFromLabel}
    </span>
  );

  const technicianImpressionsTrackedFrom =
    report.technician_impressions_tracked_from || toISODate(new Date());
  const technicianImpressionsTrackedFromLabel = formatDateRange(
    technicianImpressionsTrackedFrom,
    technicianImpressionsTrackedFrom,
  );
  const technicianImpressionsNote = (
    <span className="mt-1 block text-[11px] text-gray-400">
      <span className="font-bold text-red-500">*</span> Impressions count
      from {technicianImpressionsTrackedFromLabel}
    </span>
  );

  const generatedAt = report.generated_at
    ? new Date(report.generated_at).toLocaleString()
    : null;

  const selectedStatus = selectedStatusKey
    ? statusRequestMap[selectedStatusKey]
    : null;
  const selectedStatusRequests = selectedStatus
    ? (report.service_requests ?? []).filter(
        (request) => request.status === selectedStatus,
      )
    : [];
  const selectedStatusTotal = selectedStatusKey
    ? Number(report.overview?.[selectedStatusKey] ?? 0)
    : 0;

  return (
    <>
      <Navbar hideTitle hideClientView />
      <div className="min-h-screen w-full bg-[#fffaf5]">
        <main className="mx-auto w-full max-w-[1500px] space-y-5 px-4 py-6 md:px-8 md:py-10">
          <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-5 md:flex-row md:items-end md:justify-between md:rounded-[1.5rem] md:border md:px-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-500">
                Insights
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                Statistics
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-500">
                {canViewGeneral
                  ? "Aggregated statistics across institutions, instruments, technicians and service requests."
                  : "Your institution's instruments, technicians and service requests."}
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              {activeTab === "general" ? (
                <button
                  type="button"
                  onClick={() => loadReport(true, filters)}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:opacity-60"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              ) : (
                <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                  Institution-specific view
                </span>
              )}
              {activeTab === "general" ? (
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600">
                  {dateRangeLabel === "all time"
                    ? "All time"
                    : `Date: ${dateRangeLabel}`}
                </span>
              ) : null}
              {activeTab === "general" && generatedAt ? (
                <span className="text-xs text-gray-500">
                  Generated {generatedAt}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex w-fit items-center gap-1 rounded-2xl border border-gray-200 bg-white p-1">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedStatusKey(null);
                }}
                className={`rounded-xl px-6 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-orange-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "general" ? (
            <>
              {error ? (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Could not load reports</p>
                    <p className="mt-1 text-rose-600">{error}</p>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
                <div className="min-w-0 space-y-5">
                  <ReportOverviewCards
                    overview={report.overview}
                    loading={loading}
                    onSelectStatus={setSelectedStatusKey}
                  />

                  {loading ? (
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-80 animate-pulse rounded-[1.5rem] border border-gray-200 bg-white"
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <ReportCharts
                        report={report}
                        impressionSubtitle={
                          <>
                            {`Top 10 instruments by impressions (${dateRangeLabel})`}
                            {impressionsNote}
                          </>
                        }
                        technicianImpressionSubtitle={
                          <>
                            {`Top 10 technicians by impressions (${dateRangeLabel})`}
                            {technicianImpressionsNote}
                          </>
                        }
                      />
                      <InstrumentCategoryTable
                        rows={report.instruments_by_type}
                        subtitle="Popular testing services by registered instruments"
                      />
                      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        <InstrumentsByImpressionTable
                          rows={report.instruments_by_impression}
                          subtitle={
                            <>
                              {`Top instruments by impressions (${dateRangeLabel})`}
                              {impressionsNote}
                            </>
                          }
                        />
                        <TechniciansByImpressionTable
                          rows={report.technicians_by_impression}
                          subtitle={
                            <>
                              {`Top technicians by impressions (${dateRangeLabel})`}
                              {technicianImpressionsNote}
                            </>
                          }
                        />
                      </div>
                    </>
                  )}

                  {loading ? (
                    <div className="h-96 animate-pulse rounded-[1.5rem] border border-gray-200 bg-white" />
                  ) : (
                    <InstituteSummaryTable rows={report.institute_summary} />
                  )}
                </div>

                <div className="order-first xl:order-none xl:sticky xl:top-20 xl:self-start">
                  <ReportFilterSidebar
                    options={report.filters}
                    selected={filters}
                    onChange={handleFilterChange}
                    onClear={handleClearFilters}
                    loading={loading || refreshing}
                    showDateFilter
                    datePreset={datePreset}
                    onDatePresetChange={handleDatePresetChange}
                    onDateChange={handleDateChange}
                    onClearDateFilter={handleClearDateFilter}
                  />
                </div>
              </div>
            </>
          ) : (
            <InstituteReport
              filterOptions={report.filters}
              initialInstituteId={canViewGeneral ? "" : sessionInstituteId}
              lockedInstitute={!canViewGeneral}
            />
          )}
        </main>
      </div>

      {selectedStatus ? (
        <ServiceRequestStatusModal
          status={selectedStatus}
          requests={selectedStatusRequests}
          total={selectedStatusTotal}
          onClose={() => setSelectedStatusKey(null)}
        />
      ) : null}
    </>
  );
}
