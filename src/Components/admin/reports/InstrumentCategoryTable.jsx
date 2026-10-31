import { useMemo } from "react";
import ReportDataTable from "./ReportDataTable";

export default function InstrumentCategoryTable({ rows, subtitle }) {
  const { tableRows, columns, total } = useMemo(() => {
    const source = Array.isArray(rows) ? rows : [];
    const totalCount = source.reduce(
      (sum, row) => sum + (Number(row.value) || 0),
      0,
    );

    const rowsWithShare = source.map((row, index) => {
      const value = Number(row.value) || 0;

      return {
        id: `${row.label ?? "service"}-${index}`,
        label: row.label ?? "Unclassified",
        value,
        share: totalCount > 0 ? (value / totalCount) * 100 : 0,
      };
    });

    return {
      tableRows: rowsWithShare,
      total: totalCount,
      columns: [
        { key: "label", label: "Testing Service" },
        {
          key: "value",
          label: "Instruments",
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

  const countLabel = `${tableRows.length} testing service${
    tableRows.length === 1 ? "" : "s"
  }`;

  return (
    <ReportDataTable
      title="Testing Services Breakdown"
      subtitle={
        subtitle ?? `${countLabel} - ${total.toLocaleString()} instrument(s)`
      }
      columns={columns}
      rows={tableRows}
      emptyMessage="No testing service data is available."
    />
  );
}
