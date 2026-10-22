import { useEffect, useState } from "react";
import { assetUrl } from "../utils/api";
import { API_BASE } from "../../config";

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="w-32 flex-shrink-0 font-medium text-gray-500">{label}</span>
      <span className="min-w-0 flex-1 text-gray-800">{value || "—"}</span>
    </div>
  );
}

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");

/**
 * Full-width Qualifications section for the read-only profile view. The data
 * used to be squeezed into the narrow identity column, so each entry now gets
 * a proper card in a two-up grid with room for every labelled field.
 */
export default function Qualifications({ technicianId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!technicianId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/tech/certificates/${technicianId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!cancelled) setItems(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error("Error fetching qualifications:", error);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [technicianId]);

  return (
    <section className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-5 font-poppins">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-gray-900">Qualifications</h3>
        {!loading && items.length > 0 && (
          <span className="text-xs font-medium text-gray-500">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading qualifications...</p>
      ) : items.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((c, i) => (
            <article
              key={c.id || i}
              className="rounded-lg border border-gray-200 p-4 transition hover:border-gray-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {c.certificate_name || "—"}
                  </h4>
                  {c.qualification_type && (
                    <span className="mt-1.5 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                      {c.qualification_type}
                    </span>
                  )}
                </div>

                {c.certificate_file && (
                  <a
                    href={assetUrl(c.certificate_file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-gray-50"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View proof
                  </a>
                )}
              </div>

              <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
                <DetailRow label="Company Name" value={c.oem_company_name} />
                <DetailRow label="Offered Institute" value={c.offered_institute} />
                <DetailRow label="Effective Date" value={formatDate(c.issue_date)} />
                <DetailRow label="Expiry Date" value={formatDate(c.expiry_date)} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No qualifications available</p>
      )}
    </section>
  );
}
