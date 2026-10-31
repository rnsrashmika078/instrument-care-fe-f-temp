import { Inbox } from "lucide-react";
import { ChartEmptyState } from "../ChartStates";
import ChartCard from "./charts/ChartCard";
import AreaChartComponent from "./charts/AreaChartComponent";
import BarChartComponent from "./charts/BarChartComponent";
import DonutChartComponent from "./charts/DonutChartComponent";
import LineChartComponent from "./charts/LineChartComponent";
import PieChartComponent from "./charts/PieChartComponent";

const hasRows = (rows) =>
  Array.isArray(rows) && rows.some((row) => Number(row.value) > 0);

const toBarSeries = (rows) =>
  (Array.isArray(rows) ? rows : []).map((row) => ({
    label: row.label,
    value: Number(row.value) || 0,
  }));

const toSeries = (rows) =>
  (Array.isArray(rows) ? rows : []).map((row) => ({
    label: row.label,
    value: Number(row.value) || 0,
  }));

const toPieSeries = (rows) =>
  (Array.isArray(rows) ? rows : []).map((row) => ({
    name: row.label,
    value: Number(row.value) || 0,
  }));

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatMonth = (label) => {
  if (typeof label !== "string" || !/^\d{4}-\d{2}$/.test(label)) {
    return label;
  }
  const [year, month] = label.split("-");
  return `${MONTH_NAMES[Number(month) - 1] ?? month} ${year.slice(2)}`;
};

function EmptyChart({ title, message }) {
  return (
    <ChartCard title={title}>
      <ChartEmptyState icon={Inbox} title="No data yet" message={message} />
    </ChartCard>
  );
}

export default function ReportCharts({
  report,
  impressionSubtitle = "Top 10 instruments by impression count",
  technicianImpressionSubtitle = "Top 10 technicians by impression count",
}) {
  const instrumentsByInstitute = toSeries(report?.instruments_by_institute);
  const instrumentsByType = toPieSeries(report?.instruments_by_type);
  const instrumentsByImpression = toBarSeries(report?.instruments_by_impression);
  const techniciansByImpression = toBarSeries(
    report?.technicians_by_impression,
  );
  const instrumentsByCondition = toPieSeries(
    report?.instruments_by_condition,
  );
  const instrumentsByFaculty = toSeries(report?.instruments_by_faculty);
  const instrumentsByYear = toSeries(report?.instruments_by_year);
  const serviceRequestsByStatus = toPieSeries(
    report?.service_requests_by_status,
  );
  const serviceRequestsMonthly = toSeries(
    report?.service_requests_monthly,
  ).map((row) => ({
    label: formatMonth(row.label),
    value: row.value,
  }));
  const techniciansByInstitute = toSeries(
    report?.technicians_by_institute,
  );

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {hasRows(instrumentsByInstitute) ? (
        <BarChartComponent
          title="Instruments by Institution"
          subtitle="Top 10 institutions by registered instruments"
          data={instrumentsByInstitute}
          XAxisDataKey="label"
          xAxisAngle={-90}
          xAxisHeight={92}
          xAxisTruncateAt={22}
          legendVerticalAlign="top"
          legendAlign="right"
          keys={[
            {
              dataKey: "value",
              name: "Instruments",
              fillColor: "#f97316",
            },
          ]}
        />
      ) : (
        <EmptyChart
          title="Instruments by Institution"
          message="Register instruments against an institution to populate this chart."
        />
      )}

      {hasRows(instrumentsByType) ? (
        <DonutChartComponent
          title="Instrument By Testing Services"
          subtitle="Popular testing services across registered instruments"
          data={instrumentsByType}
        />
      ) : (
        <EmptyChart
          title="Instrument By Testing Services"
          message="Testing service distribution will appear here once testing services are assigned."
        />
      )}

      {hasRows(instrumentsByYear) ? (
        <AreaChartComponent
          title="Instruments by Manufacture Year"
          subtitle="Age profile of registered instruments"
          data={instrumentsByYear}
          XAxisDataKey="label"
          keys={[
            {
              dataKey: "value",
              name: "Instruments",
              strokeColor: "#f97316",
              fillColor: "#fed7aa",
            },
          ]}
        />
      ) : (
        <EmptyChart
          title="Instruments by Manufacture Year"
          message="Add manufacture years to instruments to see the age profile."
        />
      )}

      {hasRows(serviceRequestsByStatus) ? (
        <PieChartComponent
          title="Service Requests by Status"
          subtitle="Current status split across all requests"
          data={serviceRequestsByStatus}
        />
      ) : (
        <EmptyChart
          title="Service Requests by Status"
          message="No service requests have been recorded yet."
        />
      )}

      {hasRows(serviceRequestsMonthly) ? (
        <LineChartComponent
          title="Service Requests Trend"
          subtitle="Requests received over the last 12 months"
          data={serviceRequestsMonthly}
          XAxisDataKey="label"
          keys={[
            {
              dataKey: "value",
              name: "Requests",
              strokeColor: "#f97316",
            },
          ]}
        />
      ) : (
        <EmptyChart
          title="Service Requests Trend"
          message="Monthly request volume will be plotted once requests arrive."
        />
      )}

      {hasRows(techniciansByInstitute) ? (
        <BarChartComponent
          title="Technicians by Institution"
          subtitle="Top 10 institutions with registered technicians"
          data={techniciansByInstitute}
          XAxisDataKey="label"
          keys={[
            {
              dataKey: "value",
              name: "Technicians",
              fillColor: "#0ea5e9",
            },
          ]}
        />
      ) : (
        <EmptyChart
          title="Technicians by Institution"
          message="Technician institution distribution will appear here."
        />
      )}

      {hasRows(instrumentsByFaculty) ? (
        <BarChartComponent
          title="Instruments by Faculty"
          subtitle="Top 10 faculties by registered instruments"
          data={instrumentsByFaculty}
          XAxisDataKey="label"
          xAxisAngle={-90}
          xAxisHeight={110}
          xAxisTruncateAt={24}
          keys={[
            {
              dataKey: "value",
              name: "Instruments",
              fillColor: "#16a34a",
            },
          ]}
        />
      ) : (
        <EmptyChart
          title="Instruments by Faculty"
          message="Assign faculties to instruments to populate this chart."
        />
      )}

      {hasRows(instrumentsByCondition) ? (
        <DonutChartComponent
          title="Instruments by Condition"
          subtitle="Working condition of registered instruments"
          data={instrumentsByCondition}
        />
      ) : (
        <EmptyChart
          title="Instruments by Condition"
          message="Record instrument condition to see this distribution."
        />
      )}

      {hasRows(instrumentsByImpression) ? (
        <BarChartComponent
          title="Instruments by Impression"
          subtitle={impressionSubtitle}
          data={instrumentsByImpression}
          XAxisDataKey="label"
          xAxisAngle={-90}
          xAxisHeight={92}
          xAxisTruncateAt={22}
          legendVerticalAlign="top"
          legendAlign="right"
          keys={[
            {
              dataKey: "value",
              name: "Impressions",
              fillColor: "#636e72",
            },
          ]}
        />
      ) : (
        <EmptyChart
          title="Instruments by Impression"
          message="Register instruments to see impression distribution."
        />
      )}

      {hasRows(techniciansByImpression) ? (
        <BarChartComponent
          title="Technicians by Impression"
          subtitle={technicianImpressionSubtitle}
          data={techniciansByImpression}
          XAxisDataKey="label"
          xAxisAngle={-90}
          xAxisHeight={92}
          xAxisTruncateAt={22}
          legendVerticalAlign="top"
          legendAlign="right"
          keys={[
            {
              dataKey: "value",
              name: "Impressions",
              fillColor: "#0ea5e9",
            },
          ]}
        />
      ) : (
        <EmptyChart
          title="Technicians by Impression"
          message="Technician profile views will appear here once tracked."
        />
      )}
    </div>
  );
}
