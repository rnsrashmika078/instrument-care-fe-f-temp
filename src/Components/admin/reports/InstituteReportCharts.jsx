import { Inbox } from "lucide-react";
import { ChartEmptyState } from "../ChartStates";
import ChartCard from "./charts/ChartCard";
import AreaChartComponent from "./charts/AreaChartComponent";
import BarChartComponent from "./charts/BarChartComponent";
import DonutChartComponent from "./charts/DonutChartComponent";
import LineChartComponent from "./charts/LineChartComponent";
import PieChartComponent from "./charts/PieChartComponent";
import { formatMonth } from "./reportUtils";

const hasRows = (rows) =>
  Array.isArray(rows) && rows.some((row) => Number(row.value) > 0);

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

function EmptyChart({ title, message }) {
  return (
    <ChartCard title={title}>
      <ChartEmptyState icon={Inbox} title="No data yet" message={message} />
    </ChartCard>
  );
}

export default function InstituteReportCharts({ data }) {
  const instrumentsByType = toPieSeries(data?.instruments_by_type);
  const instrumentsByCondition = toPieSeries(
    data?.instruments_by_condition,
  );
  const instrumentsByFaculty = toSeries(data?.instruments_by_faculty);
  const instrumentsByLaboratory = toSeries(
    data?.instruments_by_laboratory,
  );
  const instrumentsByYear = toSeries(data?.instruments_by_year);
  const serviceRequestsByStatus = toPieSeries(
    data?.service_requests_by_status,
  );
  const serviceRequestsMonthly = toSeries(
    data?.service_requests_monthly,
  ).map((row) => ({
    label: formatMonth(row.label),
    value: row.value,
  }));

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {hasRows(instrumentsByType) ? (
        <DonutChartComponent
          title="Instrument By Testing Services"
          subtitle="Popular testing services in this institution"
          data={instrumentsByType}
        />
      ) : (
        <EmptyChart
          title="Instrument By Testing Services"
          message="Testing service distribution will appear once testing services are assigned."
        />
      )}

      {hasRows(instrumentsByCondition) ? (
        <DonutChartComponent
          title="Instruments by Condition"
          subtitle="Working condition of this institution's instruments"
          data={instrumentsByCondition}
        />
      ) : (
        <EmptyChart
          title="Instruments by Condition"
          message="Record instrument condition to see this distribution."
        />
      )}

      {hasRows(instrumentsByFaculty) ? (
        <BarChartComponent
          title="Instruments by Faculty"
          subtitle="Top faculties by registered instruments"
          data={instrumentsByFaculty}
          XAxisDataKey="label"
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
          title="Instruments by Faculty"
          message="Assign faculties to instruments to populate this chart."
        />
      )}

      {hasRows(instrumentsByLaboratory) ? (
        <BarChartComponent
          title="Instruments by Laboratory"
          subtitle="Top laboratories by registered instruments"
          data={instrumentsByLaboratory}
          XAxisDataKey="label"
          keys={[
            {
              dataKey: "value",
              name: "Instruments",
              fillColor: "#0ea5e9",
            },
          ]}
        />
      ) : (
        <EmptyChart
          title="Instruments by Laboratory"
          message="Assign laboratories to instruments to populate this chart."
        />
      )}

      {hasRows(instrumentsByYear) ? (
        <AreaChartComponent
          title="Instruments by Manufacture Year"
          subtitle="Age profile of this institution's instruments"
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
          subtitle="Status split for this institution's requests"
          data={serviceRequestsByStatus}
        />
      ) : (
        <EmptyChart
          title="Service Requests by Status"
          message="No service requests have been raised by this institution."
        />
      )}

      {hasRows(serviceRequestsMonthly) ? (
        <LineChartComponent
          title="Service Requests Trend"
          subtitle="Requests from this institution over the last 12 months"
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
    </div>
  );
}
