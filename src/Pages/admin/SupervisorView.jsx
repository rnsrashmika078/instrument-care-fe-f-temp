import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../Components/Technician/Navbar";
import Admin_Sidebar from "../../Components/admin/Sidebar";
import Footer from "../../Components/Common/Footer";
import { fetchWithAuth, assetUrl } from "../../Components/utils/api";
import { formatPhone } from "../../Components/utils/phone";
import { API_BASE } from "../../config";

const statusBadge = (status) => {
  switch (status) {
    case "consented":
      return "bg-green-500";
    case "registered":
      return "bg-blue-500";
    case "declined":
      return "bg-red-500";
    case "pending":
      return "bg-yellow-500";
    default:
      return "bg-gray-400";
  }
};

const statusLabel = (status) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : "No Invitation";

const yesNo = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  return v === 1 || v === "1" || v === true ? "Yes" : "No";
};

const fmtDate = (v) => (v && v !== "0000-00-00 00:00:00" ? v : "—");

export default function SupervisorView() {
  const { userId } = useParams();
  const token = sessionStorage.getItem("token");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetchWithAuth(
          `${API_BASE}/admin/supervisor/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!res) return;
        const result = await res.json();
        if (!res.ok) {
          setError(result.error || "Failed to load supervisor details.");
        } else {
          setData(result);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load supervisor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userId]);

  const techName = data
    ? `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Technician"
    : "Technician";

  const rows = data
    ? [
        { label: "Supervisor Name", value: data.supervisor_name || "—" },
        { label: "Designation", value: data.supervisor_designation || "—" },
        { label: "Email", value: data.supervisor_email || "—" },
        { label: "Contact No", value: formatPhone(data.supervisor_contact_no) || "—" },
        { label: "Knows the Person", value: yesNo(data.knows_person) },
        { label: "Relationship Duration", value: data.relationship_duration || "—" },
        { label: "Comments", value: data.comments || "—" },
        { label: "Invited At", value: fmtDate(data.invited_at) },
        { label: "Responded At", value: fmtDate(data.responded_at) },
        { label: "Consented At", value: fmtDate(data.consented_at) },
        { label: "Expires At", value: fmtDate(data.expires_at) },
      ]
    : [];

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-orange-100">
        <Admin_Sidebar />

          <main className="flex-1 bg-[#ffffff80] rounded-lg p-4 pt-14 md:pt-4 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Supervisor Confirmation Details</h2>
            <Link
              to="/admin/technicians"
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium transition"
            >
              ← Back to Technicians
            </Link>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500 py-8">
              Loading supervisor details...
            </p>
          ) : (
            data && (
              <>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Technician:{" "}
                    <strong>
                      {techName}
                      {data.technician_email ? ` (${data.technician_email})` : ""}
                    </strong>
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${statusBadge(data.invite_status)}`}
                  >
                    {statusLabel(data.invite_status)}
                  </span>
                </div>

                {!data.supervisor_name &&
                !data.supervisor_email &&
                !data.invite_status ? (
                  <p className="rounded-lg bg-white/50 p-8 text-center text-gray-500 italic">
                    No supervisor confirmation has been submitted for this
                    technician yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border-2 border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full w-full text-left text-sm">
                      <tbody>
                        {rows.map((row, i) => (
                          <tr
                            key={row.label}
                            className={`border-b border-gray-100 last:border-0 ${
                              i % 2 === 0 ? "bg-white" : "bg-orange-50/40"
                            }`}
                          >
                            <td className="p-3 align-top w-56 font-semibold text-gray-700 uppercase tracking-wide text-xs">
                              {row.label}
                            </td>
                            <td className="p-3 align-top text-gray-800 break-words">
                              {row.value}
                            </td>
                          </tr>
                        ))}
                        <tr className="last:border-0">
                          <td className="p-3 align-top w-56 font-semibold text-gray-700 uppercase tracking-wide text-xs">
                            Signature
                          </td>
                          <td className="p-3 align-top text-gray-800 break-words">
                            {data.signature ? (
                              data.signature.startsWith("TYPED|") ? (
                                <span className="italic">"{data.signature.slice("TYPED|".length)}"</span>
                              ) : (
                                <a
                                  href={assetUrl(data.signature)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  View Signature
                                </a>
                              )
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}