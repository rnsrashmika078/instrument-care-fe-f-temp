import { useMemo } from "react";
import ReportDataTable from "./ReportDataTable";

export default function TechniciansByImpressionTable({ rows, subtitle }) {
  const { tableRows, columns, total } = useMemo(() => {
    const source = Array.isArray(rows) ? rows : [];
    const totalCount = source.reduce(
      (sum, row) => sum + (Number(row.value) || 0),
      0,
    );

    const rowsWithShare = source.map((row, index) => {
      const value = Number(row.value) || 0;

      return {
        id: `${row.label ?? "technician"}-${index}`,
        label: row.label ?? "Unnamed",
        value,
        share: totalCount > 0 ? (value / totalCount) * 100 : 0,
      };
    });

    return {
      tableRows: rowsWithShare,
      total: totalCount,
      columns: [
        { key: "label", label: "Technician Name" },
        {
          key: "value",
          label: "Impressions",
          align: "right",
          render: (row) => row.value.toLocaleString(),
        },
        {
          key: "share",
          label: "Share",
          align: "right",
          render: (row) => `${row.share.toFixed(1)}%`,
        },
      ],
    };
  }, [rows]);

  const countLabel = `${tableRows.length} technician${
    tableRows.length === 1 ? "" : "s"
  }`;

  return (
    <ReportDataTable
      title="Technicians by Impression"
      subtitle={
        subtitle ?? `${countLabel} - ${total.toLocaleString()} impression(s)`
      }
      columns={columns}
      rows={tableRows}
      emptyMessage="No technician impression data is available."
    />
  );
}
