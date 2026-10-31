const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Submitted: "bg-sky-50 text-sky-700 border-sky-200",
  "In Progress": "bg-sky-50 text-sky-700 border-sky-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Declined: "bg-rose-50 text-rose-700 border-rose-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

export function StatusBadge({ value }) {
  if (!value) {
    return <span className="text-gray-400">—</span>;
  }

  const classes =
    statusStyles[value] ?? "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold ${classes}`}
    >
      {value}
    </span>
  );
}
