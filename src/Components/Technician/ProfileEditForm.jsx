import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import PersonalInfo from "./PersonalInfo";
import TechnicalExpertise from "./TechnicalExpertise";
import AreasOfTechnicalExpertise from "./AreasOfTechnicalExpertise";
import WorkExperience from "./WorkExperience";
import Certificates from "./Certificates";
import RelatedWorkExperience from "./RelatedWorkExperience";
import ProofDocument from "./ProofDocument";
import TermsAndConditions from "./TermsAndConditions";
import { publishProfileCompletion } from "../utils/profileCompletion";

export default function ProfileEditForm({ userId, readOnly = false }) {
  const personalRef = useRef(null);
  const expertiseRef = useRef(null);
  const areasRef = useRef(null);
  const workRef = useRef(null);
  const certsRef = useRef(null);
  const relatedRef = useRef(null);
  const termsRef = useRef(null);

  const [errorBag, setErrorBag] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [completion, setCompletion] = useState({ done: 0, total: 0 });

  // Refs are stable, so an empty dependency list is correct here and keeps
  // `sections` identity-stable for the measure() callback below.
  const sections = useMemo(
    () => [
      { key: "Personal Information", ref: personalRef, id: "profile-personal" },
      { key: "Areas of Technical Expertise", ref: expertiseRef, id: "profile-expertise" },
      { key: "Service Coverage & Availability", ref: areasRef, id: "profile-areas-expertise" },
      { key: "Past Employment", ref: workRef, id: "profile-work" },
      { key: "Qualification", ref: certsRef, id: "profile-certificates" },
      { key: "Related Work Experience", ref: relatedRef, id: "profile-related" },
      // { key: "Guarantee Of Service", ref: guaranteeRef, id: "profile-guarantee" },
      { key: "Terms and Conditions", ref: termsRef, id: "profile-terms" },
    ],
    [],
  );

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Each section exposes a side-effect-free completion() that only reads its
  // current state, so this is safe to poll while the user is typing.
  const measure = useCallback(() => {
    let done = 0;
    let total = 0;

    for (const s of sections) {
      const result = s.ref.current?.completion?.();
      if (!result) continue;
      done += result.done || 0;
      total += result.total || 0;
    }

    const next = { done, total };
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    setCompletion((prev) =>
      prev.done === next.done && prev.total === next.total ? prev : next,
    );

    publishProfileCompletion(percent);

    return next;
  }, [sections]);

  // Recompute shortly after mount (sections load data asynchronously) and then
  // on a light interval so the banner tracks live edits.
  useEffect(() => {
    const first = setTimeout(measure, 400);
    const id = setInterval(measure, 700);

    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [measure]);

  const handleSubmit = async () => {
    // Validation still runs so incomplete fields get highlighted, but it no
    // longer blocks the save. Whatever has been filled in is persisted.
    const bag = {};

    for (const s of sections) {
      const errs = s.ref.current?.validate?.() || [];
      if (errs.length) {
        bag[s.key] = errs;
      }
    }

    setErrorBag(bag);
    setSubmitting(true);

    const results = [];

    for (const s of sections) {
      let ok = true;
      try {
        ok = (await s.ref.current?.submit?.()) !== false;
      } catch {
        ok = false;
      }
      results.push({ key: s.key, ok });
    }

    setSubmitting(false);

    const failed = results.filter((r) => !r.ok);
    const stillMissing = Object.keys(bag);

    if (failed.length === 0) {
      if (stillMissing.length === 0) {
        toast.success("Profile saved successfully!");
      } else {
        toast.success(
          "Progress saved. " +
            stillMissing.length +
            (stillMissing.length === 1 ? " section is" : " sections are") +
            " still incomplete.",
        );
      }
    } else {
      toast.error(
        "Some sections could not be saved: " +
          failed.map((f) => f.key).join(", "),
      );
    }

    measure();
  };

  const percent =
    completion.total > 0
      ? Math.round((completion.done / completion.total) * 100)
      : 0;
  const isComplete = completion.total > 0 && percent === 100;

  const barColor = isComplete
    ? "bg-green-500"
    : percent >= 60
      ? "bg-orange-500"
      : "bg-amber-500";

  return (
    <div className="w-full mx-auto p-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-700">Technician Profile</h2>

      <div
        className={`rounded-lg border p-4 ${
          isComplete
            ? "bg-green-50 border-green-300"
            : "bg-orange-50 border-gray-300"
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm font-semibold text-gray-700">
            Profile completion
            <span className="ml-2 font-bold text-orange-700">{percent}%</span>
            <span className="ml-2 font-normal text-gray-600">
              ({completion.done} of {completion.total} required fields filled)
            </span>
          </p>
          {isComplete && (
            <span className="text-xs font-semibold text-green-700 border border-green-300 bg-white rounded-full px-2.5 py-0.5">
              Complete
            </span>
          )}
        </div>

        <div className="mt-3 h-2.5 w-full rounded-full bg-white border border-gray-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        {!isComplete && (
          <p className="mt-2 text-xs text-gray-600">
            You can save at any time - anything you have filled in is kept. Finish
            the remaining fields whenever you are ready.
          </p>
        )}
      </div>

      {Object.keys(errorBag).length > 0 && (
        <div className="bg-amber-50 border border-gray-300 text-amber-800 rounded-lg p-4 space-y-2 text-sm">
          <p className="font-semibold">
            Still to complete (your progress has been saved):
          </p>
          <ul className="list-disc list-inside space-y-1">
            {sections
              .filter((s) => errorBag[s.key])
              .map((s) => (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(s.id)}
                    className="underline hover:text-amber-900 text-left font-medium"
                  >
                    {s.key}
                  </button>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-amber-900/80">
                    {errorBag[s.key].map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        </div>
      )}

      <PersonalInfo sectionId="profile-personal" userId={userId} ref={personalRef} />
      <TechnicalExpertise sectionId="profile-expertise" userId={userId} ref={expertiseRef} readOnly={readOnly} />
      <AreasOfTechnicalExpertise sectionId="profile-areas-expertise" userId={userId} ref={areasRef} />
      <WorkExperience sectionId="profile-work" userId={userId} ref={workRef} />
      <Certificates sectionId="profile-certificates" userId={userId} ref={certsRef} />
      <RelatedWorkExperience sectionId="profile-related" userId={userId} ref={relatedRef} />
      {/* <ProofDocument sectionId="profile-guarantee" userId={userId} ref={guaranteeRef} /> */}
      <TermsAndConditions sectionId="profile-terms" userId={userId} ref={termsRef} />

      {!readOnly && (
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {submitting ? "Saving..." : "Submit Profile"}
          </button>
        </div>
      )}
    </div>
  );
}