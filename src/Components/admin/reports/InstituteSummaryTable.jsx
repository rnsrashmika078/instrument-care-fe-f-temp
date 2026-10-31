import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";

const columns = [
  { key: "name", label: "Institution", align: "left" },
  { key: "instruments", label: "Instruments" },
  { key: "faculties", label: "Faculties" },
  { key: "departments", label: "Departments" },
  { key: "laboratories", label: "Laboratories" },
  { key: "owners", label: "Owners" },
  { key: "technicians", label: "Technicians" },
  { key: "service_requests", label: "Requests" },
];

const numericKeys = [
  "instruments",
  "faculties",
  "departments",
  "laboratories",
  "owners",
  "technicians",
  "service_requests",
];

const escapeCsv = (value) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export default function InstituteSummaryTable({ rows }) {
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    const sourceRows = Array.isArray(rows) ? rows : [];
    const term = search.trim().toLowerCase();
    if (!term) return sourceRows;
    return sourceRows.filter((row) =>
      String(row.name ?? "").toLowerCase().includes(term),
    );
  }, [rows, search]);

  const totals = useMemo(
    () =>
      numericKeys.reduce((acc, key) => {
        acc[key] = filteredRows.reduce(
          (sum, row) => sum + (Number(row[key]) || 0),
          0,
        );
        return acc;
      }, {}),
    [filteredRows],
  );

  const exportCsv = () => {
    const header = columns.map((column) => column.label);
    const body = filteredRows.map((row) =>
      columns.map((column) =>
        column.key === "name" ? row.name : Number(row[column.key]) || 0,
      ),
    );

    const csv = [header, ...body]
      .map((line) => line.map(escapeCsv).join(","))
      .join("\n");

    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `institution-report-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-[1.5rem] border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-200 p-4 md:flex-row md:items-center md:justify-between md:p-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Institution Report
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Instruments, laboratories, people and service requests per
            institution.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search institution"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-orange-300 focus:bg-white sm:w-64"
            />
          </div>

          <button
            type="button"
            onClick={exportCsv}
            disabled={filteredRows.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {filteredRows.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-gray-500">
          No institutions match your search.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="bg-orange-50/70 text-[11px] uppercase tracking-[0.12em] text-orange-700">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 font-semibold ${
                      column.align === "left" ? "text-left" : "text-right"
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.institute_id ?? row.name}
                  className="border-t border-gray-100 transition hover:bg-orange-50/40"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 ${
                        column.align === "left"
                          ? "text-left font-medium text-gray-800"
                          : "text-right text-gray-600"
                      }`}
                    >
                      {column.key === "name"
                        ? row.name ?? "Unnamed institution"
                        : (Number(row[column.key]) || 0).toLocaleString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700">
                <td className="px-4 py-3 text-left">
                  Total ({filteredRows.length})
                </td>
                {columns.slice(1).map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-right"
                  >
                    {(totals[column.key] ?? 0).toLocaleString()}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  );
}
