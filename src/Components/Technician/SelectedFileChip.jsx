import { assetUrl } from "../utils/api";

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function SelectedFileChip({ name, size, path, onRemove, status = "pending" }) {
  const title =
    status === "uploaded" ? "Uploaded document" : "Selected document";

  const sizeLabel = size ? formatSize(size) : "";

  const meta =
    status === "uploading"
      ? `Uploading… ${sizeLabel}`.trim()
      : status === "uploaded"
        ? `Uploaded${sizeLabel ? ` · ${sizeLabel}` : ""}`
        : `${sizeLabel ? `${sizeLabel} · ` : ""}uploads when you save`;

  return (
    <div
      className={`mb-2 flex items-start gap-2 rounded-lg border px-3 py-2 ${
        status === "uploaded"
          ? "border-emerald-200 bg-emerald-50"
          : status === "uploading"
            ? "border-gray-200 bg-amber-50"
            : "border-gray-200 bg-orange-50"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p
          className={`text-[10px] font-semibold uppercase tracking-wider ${
            status === "uploaded"
              ? "text-emerald-600"
              : status === "uploading"
                ? "text-amber-600"
                : "text-orange-600"
          }`}
        >
          {title}
        </p>
        {status === "uploaded" && path ? (
          <a
            href={assetUrl(path)}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-xs font-medium text-blue-600 underline hover:text-blue-800"
            title={name}
          >
            {name}
          </a>
        ) : (
          <p className="truncate text-xs font-medium text-gray-800">{name}</p>
        )}
        <p className="text-[11px] text-gray-500">{meta}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {status === "uploaded" && path && (
          <a
            href={assetUrl(path)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-blue-200 bg-white px-2 py-1 text-[11px] font-semibold text-blue-600 transition hover:border-blue-300 hover:bg-blue-50"
          >
            View
          </a>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            disabled={status === "uploading"}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-[11px] font-semibold text-gray-500 transition hover:border-gray-400 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
