export const formatDate = (value) => {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export const dateOnly = (value) => (value ? String(value).split(" ")[0] : "");

export const fileNameFromPath = (path) => (path ? path.split("/").pop() : "");
