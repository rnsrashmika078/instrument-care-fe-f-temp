import {
  CheckCircle,
  Home,
  ArrowUpRight,
  SquareArrowOutUpRight,
  Microscope,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DefaultProfileImage from "../../assets/images/profile-image.jpeg";
import { API_BASE } from "../../config";
import { fetchWithAuth, assetUrl } from "../utils/api";
import { TableEmpty } from "../admin/TableUI";

export default function TechniciansCard() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await fetchWithAuth(
          `${API_BASE}/user/dashboard/approved`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        if (!response) return;
        if (!response.ok) throw new Error("Failed to fetch technicians");

        const data = await response.json();
        setTechnicians(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  const handleViewProfile = async (tech_user_id, tech_id) => {
    const payload = {
      client_id: userId,
      technician_id: tech_user_id,
      search_term: null,
    };

    try {
      const response = await fetch(`${API_BASE}/user/dashboard/search`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload)
      })

      await response.json();
      navigate(`/user/view-profile/${tech_id}`);
    }
    catch (error) {
      console.error("Error navigating to profile:", error);
    }

  };

  return (
    <section className="mt-8 md:mt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-500">
            New on the platform
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
            Recently Joined Technicians
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Approved specialists ready to take service requests
          </p>
        </div>
        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-gray-600">
          {loading ? "Loading…" : `${technicians.length} available`}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm sm:p-5"
            >
              <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-orange-100 sm:h-24 sm:w-24" />
              <div className="mx-auto mt-3 h-4 w-2/3 animate-pulse rounded bg-orange-100 sm:mt-4" />
              <div className="mx-auto mt-2 h-3 w-1/2 animate-pulse rounded bg-orange-100" />
              <div className="mx-auto mt-3 h-3 w-5/6 animate-pulse rounded bg-orange-100 sm:mt-4" />
              <div className="mx-auto mt-1.5 h-3 w-2/3 animate-pulse rounded bg-orange-100" />
              <div className="mt-auto space-y-2 pt-4 sm:pt-5">
                <div className="h-9 w-full animate-pulse rounded-xl bg-orange-100 sm:h-10" />
                <div className="h-9 w-full animate-pulse rounded-xl bg-orange-100 sm:h-10" />
              </div>
            </div>
          ))}
        </div>
      ) : technicians.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white">
          <TableEmpty
            title="No technicians yet"
            message="Approved technicians will appear here as soon as they are onboarded."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {technicians.map((tech, index) => {
            const imageUrl =
              tech.picture !== null && tech.picture !== undefined
                ? assetUrl(tech.picture)
                : DefaultProfileImage;

            const fullName =
              [tech.first_name, tech.last_name].filter(Boolean).join(" ") ||
              "No Name";

            const isOwnProfile =
              tech.user_id && Number(tech.user_id) === Number(userId);

            return (
              <article
                key={tech.user_id ?? tech.id ?? index}
                className="group relative flex min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md sm:p-5"
              >
                {isOwnProfile && (
                  <span className="absolute right-3 top-3 rounded-full bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-600 ring-1 ring-gray-100 sm:right-4 sm:top-4 sm:px-2.5 sm:text-[11px]">
                    This is you
                  </span>
                )}

                <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24">
                  <img
                    src={imageUrl}
                    alt={fullName}
                    className="h-full w-full rounded-full object-cover ring-4 ring-gray-50 transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    title="Approved technician"
                    className="absolute bottom-0 right-0 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 ring-2 ring-white sm:bottom-0.5 sm:right-0.5 sm:h-6 sm:w-6"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
                  </span>
                </div>

                <h3 className="mt-3 flex items-center justify-center gap-1.5 text-base font-bold text-gray-900 sm:mt-4 sm:text-lg">
                  <span className="min-w-0 truncate">{fullName}</span>
                </h3>
                {tech.designation && (
                  <p className="mt-1 text-xs font-medium text-orange-600 sm:text-sm">
                    {tech.designation}
                  </p>
                )}

                {tech.bio && (
                  <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-gray-500 sm:mt-3">
                    {tech.bio}
                  </p>
                )}

                <dl className="mt-3 space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600 sm:mt-4 sm:pt-4 sm:text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-600">
                      <Home className="h-3.5 w-3.5" />
                    </span>
                    <dd className="min-w-0 truncate">
                      {tech.institute_name || "-"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-600">
                      <Microscope className="h-3.5 w-3.5" />
                    </span>
                    <dd className="min-w-0 truncate">{tech.instruments || "-"}</dd>
                  </div>
                </dl>

                <div className="mt-auto space-y-2 pt-4 sm:pt-5">
                  {isOwnProfile ? (
                    <button
                      disabled
                      title="You cannot request service from yourself"
                      className="w-full cursor-not-allowed rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-400 sm:px-4 sm:py-2.5 sm:text-sm"
                    >
                      This is you
                    </button>
                  ) : (
                    <Link to={`/user/service-request/${tech.id}`}>
                      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98] sm:px-4 sm:py-2.5 sm:text-sm">
                        Service Request
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </Link>
                  )}

                  <button
                    onClick={() => handleViewProfile(tech.user_id, tech.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-orange-50 hover:text-orange-700 active:scale-[0.98] sm:px-4 sm:py-2.5 sm:text-sm"
                  >
                    View Profile
                    <SquareArrowOutUpRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
