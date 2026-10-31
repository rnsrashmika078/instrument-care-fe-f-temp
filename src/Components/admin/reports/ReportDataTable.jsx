import { useMemo, useState } from "react";
import { Search } from "lucide-react";

const renderValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return value;
};

export default function ReportDataTable({
  title,
  subtitle,
  columns,
  rows,
  searchable = false,
  searchPlaceholder = "Search",
  emptyMessage = "No records found.",
  maxHeightClass = "",
  showPagination = true,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalRows = Array.isArray(rows) ? rows.length : 0;
  const totalPages = Math.ceil(totalRows / pageSize);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return Array.isArray(rows) ? rows.slice(start, end) : [];
  }, [rows, page, pageSize]);

  const filteredRows = useMemo(() => {
    const list = pagedRows;
    const term = search.trim().toLowerCase();

    if (!term) return list;

    return list.filter((row) =>
      columns.some((column) =>
        String(row[column.key] ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [pagedRows, columns, search]);

  return (
    <section className="rounded-[1.5rem] border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-200 p-4 md:flex-row md:items-center md:justify-between md:p-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-xs text-gray-500">
            {subtitle ?? `${filteredRows.length} record(s)`}
          </p>
        </div>

        {showPagination ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages || 1}
            </span>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Next
            </button>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-gray-50 py-1.5 px-3 text-sm text-gray-700 outline-none transition focus:border-orange-300 focus:bg-white w-24"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <span className="text-sm text-gray-500">rows per page</span>
          </div>
        ) : null}

        {searchable ? (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-orange-300 focus:bg-white sm:w-64"
            />
          </div>
        ) : null}
      </div>

      {filteredRows.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div className={`overflow-x-auto ${maxHeightClass}`}>
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-orange-50/70 text-[11px] uppercase tracking-[0.12em] text-orange-700">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`whitespace-nowrap px-4 py-3 font-semibold ${
                      column.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, rowIndex) => (
                <tr
                  key={row.id ?? row.instrument_id ?? row.user_id ?? rowIndex}
                  className="border-t border-gray-100 transition hover:bg-orange-50/40"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 text-gray-600 ${
                        column.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      {column.render
                        ? column.render(row)
                        : renderValue(row[column.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}