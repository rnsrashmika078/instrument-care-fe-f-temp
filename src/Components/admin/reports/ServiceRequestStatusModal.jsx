import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StatusBadge } from "./reportHelpers";
import { formatDateTime } from "./reportUtils";

export default function ServiceRequestStatusModal({
  status,
  requests = [],
  total = 0,
  onClose,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const visibleCount = requests.length;
  const hiddenCount = Math.max(total - visibleCount, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-requests-title"
        className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-gradient-to-b from-white to-orange-50/40 px-5 py-4 md:px-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="status-requests-title"
                className="text-lg font-bold tracking-tight text-gray-900 md:text-xl"
              >
                {status} Requests
              </h2>
              <StatusBadge value={status} />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {total.toLocaleString()} request{total === 1 ? "" : "s"} in this
              status
              {hiddenCount > 0
                ? ` · showing the latest ${visibleCount.toLocaleString()}`
                : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 md:px-6">
          {visibleCount === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
              <p className="text-sm font-semibold text-gray-700">
                No requests to show
              </p>
              <p className="mt-1 text-sm text-gray-500">
                There are no {status.toLowerCase()} service requests in the
                latest records.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50/80">
                  <tr>
                    {[
                      "Request",
                      "Requester",
                      "Instrument",
                      "Institution",
                      "Technician",
                      "Requested On",
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                  {requests.map((request) => (
                    <tr
                      key={request.id}
                      className="transition hover:bg-orange-50/40"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-700">
                        REQ-{String(request.id).padStart(4, "0")}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                        {request.full_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {request.instrument_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {request.institute_name || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                        {request.technician_name || "Unassigned"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                        {formatDateTime(request.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {hiddenCount > 0 ? (
            <p className="mt-3 text-xs text-gray-500">
              {hiddenCount.toLocaleString()} older request
              {hiddenCount === 1 ? "" : "s"} are not shown here.
            </p>
          ) : null}
        </div>

        <div className="flex justify-end border-t border-gray-100 bg-orange-50/30 px-5 py-3 md:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
