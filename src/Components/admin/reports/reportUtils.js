export function formatDateTime(value) {
  if (!value) return "—";

  const normalized =
    typeof value === "string" ? value.replace(" ", "T") : value;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

export const toISODate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

export function getPresetRange(preset) {
  const today = new Date();
  const end = toISODate(today);

  switch (preset) {
    case "today":
      return { from: end, to: end };
    case "week": {
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      return { from: toISODate(monday), to: end };
    }
    case "month":
      return {
        from: toISODate(new Date(today.getFullYear(), today.getMonth(), 1)),
        to: end,
      };
    case "year":
      return {
        from: toISODate(new Date(today.getFullYear(), 0, 1)),
        to: end,
      };
    default:
      return { from: "", to: "" };
  }
}

export function formatDateRange(from, to) {
  if (!from && !to) {
    return "all time";
  }

  const format = (value) =>
    new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (from && to) {
    return from === to ? format(from) : `${format(from)} - ${format(to)}`;
  }

  return from ? `from ${format(from)}` : `up to ${format(to)}`;
}

export function formatMonth(label) {
  if (typeof label !== "string" || !/^\d{4}-\d{2}$/.test(label)) {
    return label;
  }

  const monthNames = [
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

  const [year, month] = label.split("-");
  return `${monthNames[Number(month) - 1] ?? month} ${year.slice(2)}`;
}
