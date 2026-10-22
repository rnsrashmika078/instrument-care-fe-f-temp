import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { toast } from "react-toastify";
import { API_BASE } from "../../config";

const OTHER_LABEL = "Other (Specify)";

const CATEGORIES = [
  {
    key: "service_coverage",
    title: "Service Coverage",
    prompt: "Please indicate the region(s) you provide service coverage for:",
    options: [
      "Island-wide",
      "Western",
      "Central",
      "Southern",
      "Northern",
      "Eastern",
      "North Western",
      "North Central",
      "Uva",
      "Sabaragamuwa",
      OTHER_LABEL,
    ],
  },
  {
    key: "availability",
    title: "Availability",
    prompt: "Please indicate your availability:",
    options: [
      "Full-time Technical Service Provider",
      "Part-time Technical Service Provider",
      "Contractual Basis",
      "Consultancy Basis",
      "Emergency Support Available",
      OTHER_LABEL,
    ],
  },
];

const emptySel = () => ({
  service_coverage: [],
  availability: [],
});

const emptyOther = () => ({
  service_coverage: "",
  availability: "",
});

const AreasOfTechnicalExpertise = forwardRef(function AreasOfTechnicalExpertise(
  { userId: userIdProp, sectionId = "profile-areas-expertise" },
  ref,
) {
  const userId = userIdProp || sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("token");

  const [techId, setTechId] = useState(null);
  const [selections, setSelections] = useState(emptySel);
  const [otherVal, setOtherVal] = useState(emptyOther);
  const [loading, setLoading] = useState(false);
  const [, setSaving] = useState(false);

  const isChecked = (catKey, opt) =>
    (selections[catKey] || []).includes(opt);

  const isOther = (catKey) => isChecked(catKey, OTHER_LABEL);

  const toggle = (catKey, opt) => {
    setSelections((prev) => {
      const list = prev[catKey] || [];
      const on = list.includes(opt)
        ? list.filter((o) => o !== opt)
        : [...list, opt];

      if (opt === OTHER_LABEL && list.includes(opt)) {
        setOtherVal((o) => ({ ...o, [catKey]: "" }));
      }

      return { ...prev, [catKey]: on };
    });
  };

  const load = async () => {
    if (!techId) return;

    setLoading(true);
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

      const next = emptySel();
      const nextOther = emptyOther();

      CATEGORIES.forEach(({ key }) => {
        const rows = grouped[key] || [];

        rows.forEach((row) => {
          const value = (row.value || "").trim();
          if (!value) return;

          if (value.toLowerCase() === "other") {
            if (!next[key].includes(OTHER_LABEL)) {
              next[key].push(OTHER_LABEL);
            }
            if (row.other_specify) nextOther[key] = row.other_specify;
          } else if (!next[key].includes(value)) {
            next[key].push(value);
          }
        });
      });

      setSelections(next);
      setOtherVal(nextOther);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!techId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [techId]);

  const validate = () => {
    const errors = [];

    CATEGORIES.forEach(({ key, title }) => {
      if (!(selections[key] || []).length) {
        errors.push(`${title} section is still required - select at least one option`);
      }

      if (isOther(key) && !(otherVal[key] || "").trim()) {
        errors.push(`${title}: please specify the "Other" value`);
      }
    });

    return errors;
  };

  const submit = async () => {
    if (!techId) return false;
    setSaving(true);

    try {
      const payload = {};

      CATEGORIES.forEach(({ key }) => {
        const list = (selections[key] || []).filter(
          (o) => o !== OTHER_LABEL,
        );

        if (isOther(key)) {
          list.push({
            value: "Other",
            other_specify: (otherVal[key] || "").trim(),
          });
        }
        payload[key] = list;
      });

      const res = await fetch(
        `${API_BASE}/tech/profile/areas-of-expertise/${techId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (res.ok) {
        // No success toast here. This submit() runs on every "Submit Profile"
        // click, whether or not this section was touched, and ProfileEditForm
        // already raises the single "Profile saved successfully!" toast for
        // the whole form. The other sections (PersonalInfo, WorkExperience,
        // Certificates, RelatedWorkExperience, TermsAndConditions) stay silent
        // on success for the same reason - only failures are worth a toast.
        await load();
        return true;
      }

      toast.error(data.error || "Failed to update areas of expertise");
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Error updating areas of expertise");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const completion = () => {
    let done = 0;
    let total = 0;

    CATEGORIES.forEach(({ key }) => {
      total += 1;
      if ((selections[key] || []).length) done += 1;

      if (isOther(key)) {
        total += 1;
        if ((otherVal[key] || "").trim()) done += 1;
      }
    });

    return { done, total };
  };

  useImperativeHandle(ref, () => ({
    validate,
    submit,
    completion,
  }));

  return (
    <div
      id={sectionId}
      className="bg-white shadow-md rounded-2xl p-6 border-2 border-gray-200"
    >
      <div
        className={`flex items-center justify-end ${
          loading ? "mb-6 pb-4 border-b border-gray-100" : ""
        }`}
      >
        {loading && <span className="text-xs text-gray-400">Loading...</span>}
      </div>

      <div className="space-y-8">
        {CATEGORIES.map(({ key, title, prompt, options }) => (
          <div key={key}>
            <h3 className="font-medium text-gray-700 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{prompt}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {options.map((opt) => {
                const checked = isChecked(key, opt);

                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                      checked
                        ? "border-gray-400 bg-orange-50"
                        : "border-gray-100 bg-orange-50/40 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(key, opt)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>

            {isOther(key) && (
              <input
                type="text"
                value={otherVal[key] || ""}
                onChange={(e) =>
                  setOtherVal((o) => ({ ...o, [key]: e.target.value }))
                }
                placeholder={`Specify the ${title} "Other" value`}
                className="mt-3 w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 outline-none transition"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default AreasOfTechnicalExpertise;
