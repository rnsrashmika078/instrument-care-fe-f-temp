import { useState, useEffect } from "react";
import { API_BASE } from "../../config";

const GROUPS = [
  { key: "service_coverage", title: "Service Coverage" },
  { key: "availability", title: "Availability" },
];

function AreasOfTechnicalExpertiseView({ userId, technicianId }) {
  const token = sessionStorage.getItem("token");
  const [techId, setTechId] = useState(technicianId || null);
  const [areas, setAreas] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (technicianId) {
      setTechId(technicianId);
      return;
    }
    if (!userId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/tech/profile/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!cancelled) setTechId(data.id || null);
      } catch (error) {
        console.error(error);
        if (!cancelled) setMissing(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, technicianId]);

  useEffect(() => {
    if (!techId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/tech/profile/areas-of-expertise/${techId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        const grouped = data.data || {};

        const any = GROUPS.some((g) => (grouped[g.key] || []).length > 0);

        if (!cancelled) {
          setMissing(!any);
          setAreas(grouped);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setMissing(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [techId]);

  if (missing) return null;
  if (!areas) return null;

  return (
    <div className="space-y-4">
      {GROUPS.map(({ key, title }) => {
        const names = [];

        (areas[key] || []).forEach((row) => {
          const value = (row.value || "").trim();

          if (value.toLowerCase() === "other") {
            const label = row.other_specify
              ? row.other_specify.trim()
              : "Other";
            if (!names.includes(label)) names.push(label);
          } else if (value && !names.includes(value)) {
            names.push(value);
          }
        });

        return (
          <div key={key}>
            <p className="text-sm text-gray-600 font-medium mb-1.5">{title}</p>

            <div className="flex flex-wrap gap-1.5">
              {names.length > 0 ? (
                names.map((name, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 border border-gray-200"
                  >
                    {name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">—</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AreasOfTechnicalExpertiseView;
