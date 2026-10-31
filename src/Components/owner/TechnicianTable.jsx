import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Microscope,
  Search,
  SlidersHorizontal,
  SquareArrowOutUpRight,
} from "lucide-react";
import DefaultProfileImage from "../../assets/images/profile-image.jpeg";
import { fetchWithAuth, assetUrl } from "../utils/api";
import { dateOnly } from "../utils/format";
import { API_BASE } from "../../config";
import { StatusPill, TableEmpty } from "../admin/TableUI";

const RECORDS_PER_PAGE = 12;

const ACTIVE_REQUEST_STATUSES = ["pending", "in progress"];

const SORT_OPTIONS = [
  { value: "default", label: "Default order" },
  { value: "name-asc", label: "Name (A – Z)" },
  { value: "name-desc", label: "Name (Z – A)" },
  { value: "institute", label: "Institute (A – Z)" },
];

const fullNameOf = (tech) =>
  [tech.first_name, tech.last_name].filter(Boolean).join(" ") || "No Name";

const instrumentTags = (raw) =>
  (raw || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const selectClass =
  "w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3.5 pr-9 text-sm text-gray-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100";

function FieldLabel({ children }) {
  return (
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
      {children}
    </span>
  );
}

function Chevron() {
  return (
    <ChevronDown
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      aria-hidden="true"
    />
  );
}

function ResultRow({ tech, myReq, isOwnProfile, onViewProfile }) {
  const fullName = fullNameOf(tech);
  const imageUrl =
    tech.picture !== null && tech.picture !== undefined
      ? assetUrl(tech.picture)
      : DefaultProfileImage;
  const tags = instrumentTags(tech.instruments);
  const hasActiveRequest = myReq
    ? ACTIVE_REQUEST_STATUSES.includes(String(myReq.status || "").trim().toLowerCase())
    : false;

  return (
    <article className="group relative flex h-full min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md sm:p-5">
      <div className="relative mx-auto h-20 w-20 shrink-0 sm:h-24 sm:w-24">
        <img
          src={imageUrl}
          alt={fullName}
          className="h-full w-full rounded-full object-cover ring-4 ring-gray-50 transition-transform duration-300 group-hover:scale-105"
        />
        <span
          title="Approved technician"
          className="absolute bottom-0 right-0 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 ring-2 ring-white sm:h-6 sm:w-6"
        >
          <BadgeCheck className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-3 min-w-0 sm:mt-4">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <h3
            className="min-w-0 truncate text-base font-bold text-gray-900 sm:text-lg"
            title={fullName}
          >
            {fullName}
          </h3>
          {isOwnProfile && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
              You
            </span>
          )}
        </div>

        <p className="mt-1 truncate text-xs font-medium text-orange-600 sm:text-sm">
          {tech.designation || "Technician"}
        </p>

        {myReq && (
          <span
            title={`Request SR/${myReq.id} raised on ${dateOnly(myReq.created_at)}`}
            className="mt-2 inline-flex"
          >
            <StatusPill status={myReq.status} />
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-2 border-t border-gray-100 pt-3 text-xs text-gray-600 sm:mt-4 sm:pt-4 sm:text-sm">
        <div className="flex items-center justify-center gap-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-600">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="min-w-0 truncate" title={tech.institute_name || "-"}>
            {tech.institute_name || "-"}
          </span>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1">
            <Microscope
              className="h-3.5 w-3.5 shrink-0 text-gray-400"
              aria-hidden="true"
            />
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="max-w-[8rem] truncate rounded-md bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-600 ring-1 ring-inset ring-gray-200"
                title={tag}
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="rounded-md bg-gray-50 px-1.5 py-0.5 text-[11px] font-semibold text-gray-500 ring-1 ring-inset ring-gray-200">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {tech.bio && (
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
            {tech.bio}
          </p>
        )}
      </div>

      <div className="mt-auto space-y-2 pt-4">
        {isOwnProfile ? (
          <span
            title="You cannot request service from yourself"
            className="flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-400 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            This is you
          </span>
        ) : (
          <>
            <Link
              to={`/user/service-request/${tech.id}`}
              title={
                hasActiveRequest
                  ? "You already have an active request with this technician"
                  : undefined
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98] sm:px-4 sm:py-2.5 sm:text-sm"
            >
              Service Request
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => onViewProfile(tech.user_id, tech.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-orange-50 hover:text-orange-700 active:scale-[0.98] sm:px-4 sm:py-2.5 sm:text-sm"
            >
              View Profile
              <SquareArrowOutUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function Pager({ page, totalPages, total, onPage }) {
  const from = total === 0 ? 0 : (page - 1) * RECORDS_PER_PAGE + 1;
  const to = Math.min(page * RECORDS_PER_PAGE, total);

  const windowStart = Math.max(1, Math.min(page - 2, totalPages - 4));
  const windowEnd = Math.min(totalPages, windowStart + 4);
  const pages = [];
  for (let i = windowStart; i <= windowEnd; i += 1) pages.push(i);

  const navBtn =
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-600";

  return (
    <nav
      className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-3.5 sm:flex-row"
      aria-label="Technician pages"
    >
      <p className="text-xs text-gray-500">
        Showing <span className="font-semibold text-gray-700">{from}</span>–
        <span className="font-semibold text-gray-700">{to}</span> of{" "}
        <span className="font-semibold text-gray-700">{total}</span> technicians
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className={navBtn}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPage(pageNumber)}
            aria-current={pageNumber === page ? "page" : undefined}
            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-semibold transition ${
              pageNumber === page
                ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                : "border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className={navBtn}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

function CardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm sm:p-5">
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
  );
}

export default function TechnicianTable({ searchTerm, setSearchTerm }) {
  const userId = sessionStorage.getItem("user_id");
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const [instituteFilter, setInstituteFilter] = useState("all");
  const [myRequestMap, setMyRequestMap] = useState(new Map());

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, instituteFilter]);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE}/user/dashboard/approved/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

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

  useEffect(() => {
    const fetchMyRequests = async () => {
      if (!userId) return;
      try {
        const response = await fetchWithAuth(`${API_BASE}/user/my-requests`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (!response || !response.ok) return;

        const data = await response.json();
        const rows = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        const map = new Map();
        rows.forEach((request) => {
          const techId = Number(request.technician_id);
          if (techId && !map.has(techId)) {
            map.set(techId, request);
          }
        });
        setMyRequestMap(map);
      } catch (error) {
        console.error("Error fetching my requests:", error);
      }
    };

    fetchMyRequests();
  }, [userId]);

  const institutes = useMemo(() => {
    const set = new Set();
    technicians.forEach((tech) => {
      if (tech.institute_name) set.add(tech.institute_name);
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [technicians]);

  const filteredTechnicians = useMemo(() => {
    const term = (searchTerm || "").trim().toLowerCase();

    const rows = technicians.filter((tech) => {
      const matchesTerm =
        !term ||
        [
          tech.first_name,
          tech.last_name,
          tech.designation,
          tech.bio,
          tech.institute_name,
          tech.instruments,
        ].some((value) => (value || "").toLowerCase().includes(term));

      const matchesInstitute =
        instituteFilter === "all" || tech.institute_name === instituteFilter;

      return matchesTerm && matchesInstitute;
    });

    const byString = (key) => (a, b) =>
      (a[key] || "").toLowerCase().localeCompare((b[key] || "").toLowerCase());

    switch (sortBy) {
      case "name-asc":
        return [...rows].sort((a, b) => fullNameOf(a).localeCompare(fullNameOf(b)));
      case "name-desc":
        return [...rows].sort((a, b) => fullNameOf(b).localeCompare(fullNameOf(a)));
      case "institute":
        return [...rows].sort(byString("institute_name"));
      default:
        return rows;
    }
  }, [technicians, searchTerm, instituteFilter, sortBy]);

  const totalPages = Math.ceil(filteredTechnicians.length / RECORDS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const currentRecords = filteredTechnicians.slice(
    (safePage - 1) * RECORDS_PER_PAGE,
    safePage * RECORDS_PER_PAGE,
  );

  const hasFilters =
    !!searchTerm || instituteFilter !== "all" || sortBy !== "default";

  const resetFilters = () => {
    setSearchTerm("");
    setInstituteFilter("all");
    setSortBy("default");
  };

  const handleViewProfile = async (techUserId, techId) => {
    const payload = {
      client_id: userId,
      technician_id: techUserId,
      search_term: searchTerm || null,
    };

    try {
      const response = await fetch(`${API_BASE}/user/dashboard/search`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      await response.json();
      navigate(`/user/view-profile/${techId}`);
    } catch (error) {
      console.error("Error navigating to profile:", error);
    }
  };

  return (
    <section id="all-technicians" className="scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
            All technicians
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Browse verified specialists from every institute
          </p>
        </div>
        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-gray-600">
          {loading ? "Loading…" : `${technicians.length} technicians`}
        </span>
      </div>

      {/* Filters — horizontal bar */}
      <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <label className="block w-full lg:max-w-[18rem] lg:flex-1">
            <FieldLabel>Search</FieldLabel>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchTerm || ""}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, instrument…"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </label>

          <label className="block w-full sm:w-60 lg:w-56">
            <FieldLabel>Institute</FieldLabel>
            <div className="relative">
              <select
                value={instituteFilter}
                onChange={(e) => setInstituteFilter(e.target.value)}
                className={selectClass}
              >
                <option value="all">All institutes</option>
                {institutes.map((institute) => (
                  <option key={institute} value={institute}>
                    {institute}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </label>

          <label className="block w-full sm:w-52 lg:w-48">
            <FieldLabel>Sort by</FieldLabel>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={selectClass}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </label>

          <div className="flex items-center gap-2 pb-0.5 lg:ml-auto">
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              >
                Reset filters
              </button>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-200">
              <SlidersHorizontal className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" />
              {filteredTechnicians.length} match
            </span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
          {loading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : technicians.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white">
              <TableEmpty
                title="No technicians yet"
                message="Approved technicians will appear here as soon as they are onboarded."
              />
            </div>
          ) : filteredTechnicians.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white">
              <TableEmpty
                title="No matching technicians"
                message="No technicians match the current filters."
                hint="Try clearing the search or choosing another institute"
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {currentRecords.map((tech, index) => (
                  <ResultRow
                    key={tech.user_id ?? tech.id ?? index}
                    tech={tech}
                    myReq={myRequestMap.get(Number(tech.id))}
                    isOwnProfile={
                      tech.user_id && Number(tech.user_id) === Number(userId)
                    }
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <Pager
                  page={safePage}
                  totalPages={totalPages}
                  total={filteredTechnicians.length}
                  onPage={setCurrentPage}
                />
              </div>
            </>
          )}
      </div>
    </section>
  );
}
