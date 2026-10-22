import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultProfileImage from "../../assets/images/profile-image.jpeg";
import { assetUrl } from "../utils/api";
import { API_BASE } from "../../config";
import AreasOfTechnicalExpertiseView from "../Technician/AreasOfTechnicalExpertiseView";

// One labelled block in the identity column. Sections sit on the card's white
// background separated by hairline rules, so the column reads as a single
// profile summary rather than a stack of little boxes.
function Section({ title, children }) {
  return (
    <section className="px-4 py-4">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-2">
        {title}
      </h3>
      {children}
    </section>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="w-28 flex-shrink-0 font-medium text-gray-500">{label}</span>
      <span className="min-w-0 flex-1 text-gray-800">{value || "—"}</span>
    </div>
  );
}

export default function ProfileCard({ onTechLoaded }) {
  const { id } = useParams(); // get technician id from URL
  const [tech, setTech] = useState(null);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchTechnician = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/user/dashboard/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch technician");
        const data = await response.json();
        setTech(data);
        // Technical Expertise needs this userId but is rendered outside this
        // card, so hand it up instead of fetching the same endpoint twice.
        onTechLoaded?.(data.technician_user_id || data.user_id || "");
      } catch (error) {
        console.error("Error fetching technician:", error);
      }
    };

    fetchTechnician();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!tech) {
    return (
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 font-poppins text-sm text-gray-500">
        Loading profile...
      </div>
    );
  }

  // assetUrl returns null for an empty path, which would render a broken
  // <img>. Fall back to the placeholder whenever no picture is stored.
  const profileImageUrl =
    (tech.picture && assetUrl(tech.picture)) || DefaultProfileImage;

  // `a + " " + b || "fallback"` never falls back: `+` binds tighter than `||`,
  // so a missing name rendered "undefined undefined". Build the name first.
  const name = [tech.first_name, tech.last_name]
    .filter((part) => part && String(part).trim())
    .join(" ");
  const fullName = name || "Technician";
  const displayName = [tech.title, fullName].filter(Boolean).join(" ");

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 font-poppins h-full flex flex-col">
      {/* Identity */}
      <div className="flex flex-col items-center text-center px-4 pt-6 pb-5">
        <img
          src={profileImageUrl}
          alt={fullName}
          className="h-24 w-24 rounded-full object-cover ring-2 ring-gray-100 hover:scale-105 transition flex-shrink-0"
        />
        <h2 className="mt-3 text-base font-bold text-gray-900 leading-snug">
          {displayName}
        </h2>
        {tech.designation && (
          <p className="mt-0.5 text-sm text-gray-600">{tech.designation}</p>
        )}
        {tech.institute_name && (
          <p className="mt-1.5 text-xs text-gray-500">{tech.institute_name}</p>
        )}
        {tech.district && (
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {tech.district}
          </span>
        )}
      </div>

      <div className="border-t border-gray-100" />

      <Section title="About">
        {tech.bio && (
          <p className="text-sm text-gray-600 leading-relaxed">{tech.bio}</p>
        )}
      </Section>

      <div className="border-t border-gray-100" />

      <Section title="Institute">
        <div className="space-y-2">
          <DetailRow label="Designation" value={tech.designation} />
          <DetailRow label="Institute" value={tech.institute_name} />
          <DetailRow label="Email" value={tech.email} />
          <DetailRow label="Mobile" value={tech.mobile_number} />
        </div>
      </Section>

      <div className="border-t border-gray-100" />

      <Section title="Service Coverage & Availability">
        <AreasOfTechnicalExpertiseView technicianId={id} />
      </Section>
    </div>
  );
}
