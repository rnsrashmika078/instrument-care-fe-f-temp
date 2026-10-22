import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { API_BASE, HOME_BASE } from "../../config";
import { toast } from "react-toastify";
import RegCrumb from "./RegCrumb";
import {
  REG_HEADER_SUBTITLE,
  REG_HEADER_TITLE,
  REG_LABELS,
} from "./registrationMeta";

const INSTITUTION_TYPES = [
  "Government Research Institute",
  "State University",
  "Government Agency",
  "Private Higher Education Institution",
  "Industrial Organization",
  "Other",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+()\-\s]{7,20}$/;

const INITIAL_FORM = {
  institution_name: "",
  institution_type: "",
  institution_type_other: "",
  postal_address: "",
  telephone_number: "",
  official_email: "",
  official_website: "",
  head_full_name: "",
  head_designation: "",
  head_contact_number: "",
  head_email: "",
  focal_full_name: "",
  focal_designation: "",
  focal_department: "",
  focal_contact_number: "",
  focal_email: "",
  authorized_officer_name: "",
  authorized_officer_designation: "",
  declaration_accepted: false,
};

const INPUT_CLASS =
  "w-full h-12 px-3.5 rounded-[9px] border-[1.5px] border-[#e5e7eb] bg-white text-[14.5px] text-[#111827] placeholder:text-[#9ca3af] placeholder:text-sm focus:outline-none focus:border-[#e5e7eb] focus:ring-[3.5px] focus:ring-[rgba(238,147,16,0.22)] transition-all duration-200";

const INVALID_BORDER =
  "!border-[#dc2626] focus:!border-[#dc2626] focus:!ring-[rgba(220,38,38,0.22)]";

function SectionHeader({ step, title }) {
  return (
    <div className="flex items-center gap-3 text-base font-bold text-[#111827] pb-2.5 mb-5 border-b-[1.5px] border-[#f1f3f5] mt-7 first:mt-0">
      <span
        className="w-[26px] h-[26px] rounded-full text-[13px] font-bold inline-flex items-center justify-center shrink-0"
        style={{
          backgroundColor: "rgba(238, 147, 16, 0.08)",
          color: "#ee9310",
        }}
      >
        {step}
      </span>
      {title}
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className="mb-[18px]">
      <label className="block text-[13.5px] font-semibold text-[#111827] mb-[6px]">
        {label}{" "}
        {required && <span className="text-[#dc2626] ml-0.5 font-bold">*</span>}
      </label>
      {children}
      {error && (
        <div className="text-[12.5px] text-[#dc2626] mt-1.5 font-bold">
          {error}
        </div>
      )}
    </div>
  );
}

export default function InstituteRegistration() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const setValue = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValue(name, type === "checkbox" ? checked : value);
  };

  const validate = () => {
    const errors = {};

    if (!formData.institution_name.trim()) {
      errors.institution_name = "Name of institution is required.";
    }

    if (!formData.institution_type) {
      errors.institution_type = "Please select a type of institution.";
    }

    if (
      formData.institution_type === "Other" &&
      !formData.institution_type_other.trim()
    ) {
      errors.institution_type_other = "Please specify the institution type.";
    }

    if (!formData.postal_address.trim()) {
      errors.postal_address = "Postal address is required.";
    }

    if (!formData.telephone_number.trim()) {
      errors.telephone_number = "Telephone number is required.";
    } else if (!PHONE_RE.test(formData.telephone_number.trim())) {
      errors.telephone_number = "Enter a valid telephone number.";
    }

    if (!formData.official_email.trim()) {
      errors.official_email = "Official e-mail address is required.";
    } else if (!EMAIL_RE.test(formData.official_email.trim())) {
      errors.official_email = "Enter a valid e-mail address.";
    }

    if (
      formData.official_website.trim() &&
      !/^https?:\/\/\S+\.\S+/.test(formData.official_website.trim())
    ) {
      errors.official_website = "Enter a valid URL (e.g. https://example.lk).";
    }

    if (!formData.head_full_name.trim()) {
      errors.head_full_name = "Full name is required.";
    }
    if (!formData.head_designation.trim()) {
      errors.head_designation = "Designation is required.";
    }
    if (!formData.head_contact_number.trim()) {
      errors.head_contact_number = "Contact number is required.";
    } else if (!PHONE_RE.test(formData.head_contact_number.trim())) {
      errors.head_contact_number = "Enter a valid contact number.";
    }
    if (!formData.head_email.trim()) {
      errors.head_email = "Official e-mail address is required.";
    } else if (!EMAIL_RE.test(formData.head_email.trim())) {
      errors.head_email = "Enter a valid e-mail address.";
    }

    if (!formData.focal_full_name.trim()) {
      errors.focal_full_name = "Full name is required.";
    }
    if (!formData.focal_designation.trim()) {
      errors.focal_designation = "Designation is required.";
    }
    if (!formData.focal_department.trim()) {
      errors.focal_department = "Department / Unit is required.";
    }
    if (!formData.focal_contact_number.trim()) {
      errors.focal_contact_number = "Contact number is required.";
    } else if (!PHONE_RE.test(formData.focal_contact_number.trim())) {
      errors.focal_contact_number = "Enter a valid contact number.";
    }
    if (!formData.focal_email.trim()) {
      errors.focal_email = "Official e-mail address is required.";
    } else if (!EMAIL_RE.test(formData.focal_email.trim())) {
      errors.focal_email = "Enter a valid e-mail address.";
    }

    if (!formData.authorized_officer_name.trim()) {
      errors.authorized_officer_name =
        "Name of authorized officer is required.";
    }
    if (!formData.authorized_officer_designation.trim()) {
      errors.authorized_officer_designation = "Designation is required.";
    }

    if (!formData.declaration_accepted) {
      errors.declaration_accepted =
        "You must accept the declaration to continue.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || redirecting) return;

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please correct the highlighted fields.");
      const first = document.querySelector("[data-invalid='true']");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/register-institute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && (result.status === "success" || result.message)) {
        toast.success(
          result.message || "Institute registration submitted successfully.",
          { autoClose: 5000 },
        );
        setFormData(INITIAL_FORM);
        setIsLoading(false);
        setRedirecting(true);
        setTimeout(() => {
          window.location.href = `${HOME_BASE}/user_authentication`;
        }, 2000);
        return;
      }

      if (result.errors && typeof result.errors === "object") {
        const normalized = {};
        Object.entries(result.errors).forEach(([key, messages]) => {
          normalized[key] = Array.isArray(messages)
            ? messages
            : [String(messages)];
        });
        setFieldErrors(normalized);
      }

      toast.error(result.message || "Registration failed. Please try again.");
      setIsLoading(false);
    } catch (err) {
      console.error("Institute registration failed:", err);
      toast.error("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  const showOther = formData.institution_type === "Other";

  return (
    <div
      className="min-h-screen flex items-start justify-center px-4 sm:px-6 py-6"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="w-full max-w-[880px]">

        <div className="bg-white rounded-[18px] overflow-hidden border border-black/5 shadow-[0_16px_45px_rgba(0,0,0,0.07),0_2px_8px_rgba(0,0,0,0.03)]">
          {/* Card Header */}
          <div
            className="relative text-center text-white pt-9 pb-8 px-6 sm:px-9 overflow-hidden"
            style={{ background: "#fa7901" }}
          >
            <div
              className="pointer-events-none absolute -top-1/2 -right-[20%] w-80 h-80 rounded-full"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
            ></div>

            <span
              className="relative inline-flex items-center mb-3 px-3.5 py-1 rounded-full text-[11.5px] font-bold uppercase tracking-[0.8px] text-white border border-white/30"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              {REG_LABELS.institute}
            </span>
            <h1 className="relative text-[28px] font-extrabold text-white mb-2 tracking-tight">
              {REG_HEADER_TITLE}
            </h1>
            <p className="relative text-[14.5px] text-white/90 leading-relaxed max-w-[580px] mx-auto">
              {REG_HEADER_SUBTITLE}
            </p>
          </div>

          {/* Card Body */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="px-5 sm:px-11 pt-8 sm:pt-10 pb-8 sm:pb-10"
          >
            {/* Section A */}
            <SectionHeader step="A" title="Institutional Information" />

            <Field
              label="Name of Institution"
              required
              error={fieldErrors.institution_name}
            >
              <input
                type="text"
                name="institution_name"
                placeholder="Enter the official name of the institution"
                value={formData.institution_name}
                onChange={handleChange}
                data-invalid={!!fieldErrors.institution_name}
                className={`${INPUT_CLASS} ${fieldErrors.institution_name ? INVALID_BORDER : ""}`}
              />
            </Field>

            <Field
              label="Type of Institution"
              required
              error={fieldErrors.institution_type}
            >
              <div
                data-invalid={!!fieldErrors.institution_type}
                className={`grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-[11px] border-[1.5px] p-3 ${
                  fieldErrors.institution_type
                    ? "border-[#dc2626]"
                    : "border-[#e5e7eb]"
                }`}
              >
                {INSTITUTION_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2.5 text-[13.5px] text-[#374151] cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      name="institution_type"
                      value={type}
                      checked={formData.institution_type === type}
                      onChange={handleChange}
                      className="w-4 h-4 accent-[#ee9310] cursor-pointer shrink-0"
                    />
                    {type}
                  </label>
                ))}

                {showOther && (
                  <input
                    type="text"
                    name="institution_type_other"
                    placeholder="Specify institution type"
                    value={formData.institution_type_other}
                    onChange={handleChange}
                    data-invalid={!!fieldErrors.institution_type_other}
                    className={`${INPUT_CLASS} ${fieldErrors.institution_type_other ? INVALID_BORDER : ""} sm:col-span-2 h-11 mt-1`}
                  />
                )}
              </div>
            </Field>

            <Field
              label="Postal Address"
              required
              error={fieldErrors.postal_address}
            >
              <textarea
                name="postal_address"
                rows={3}
                placeholder="Enter the official postal address of the institution"
                value={formData.postal_address}
                onChange={handleChange}
                data-invalid={!!fieldErrors.postal_address}
                className={`${INPUT_CLASS} ${fieldErrors.postal_address ? INVALID_BORDER : ""} h-auto py-3 resize-y`}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field
                label="Telephone Number"
                required
                error={fieldErrors.telephone_number}
              >
                <input
                  type="tel"
                  name="telephone_number"
                  placeholder="e.g. 0112345678"
                  value={formData.telephone_number}
                  onChange={handleChange}
                  data-invalid={!!fieldErrors.telephone_number}
                  className={`phone-prefix ${INPUT_CLASS} ${fieldErrors.telephone_number ? INVALID_BORDER : ""}`}
                />
              </Field>

              <Field
                label="Official E-mail Address"
                required
                error={fieldErrors.official_email}
              >
                <input
                  type="email"
                  name="official_email"
                  placeholder="name@institution.lk"
                  value={formData.official_email}
                  onChange={handleChange}
                  data-invalid={!!fieldErrors.official_email}
                  className={`${INPUT_CLASS} ${fieldErrors.official_email ? INVALID_BORDER : ""}`}
                />
              </Field>
            </div>

            <Field
              label="Official Website"
              error={fieldErrors.official_website}
            >
              <input
                type="url"
                name="official_website"
                placeholder="https://www.example.lk"
                value={formData.official_website}
                onChange={handleChange}
                data-invalid={!!fieldErrors.official_website}
                className={`${INPUT_CLASS} ${fieldErrors.official_website ? INVALID_BORDER : ""}`}
              />
            </Field>

            {/* Section B */}
            <SectionHeader step="B" title="Head of the Institution" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field
                label="Full Name"
                required
                error={fieldErrors.head_full_name}
              >
                <input
                  type="text"
                  name="head_full_name"
                  placeholder="Enter the full name"
                  value={formData.head_full_name}
                  onChange={handleChange}
                  data-invalid={!!fieldErrors.head_full_name}
                  className={`${INPUT_CLASS} ${fieldErrors.head_full_name ? INVALID_BORDER : ""}`}
                />
              </Field>

              <Field
                label="Designation"
                required
                error={fieldErrors.head_designation}
              >
                <input
                  type="text"
                  name="head_designation"
                  placeholder="e.g. Director General"
                  value={formData.head_designation}
                  onChange={handleChange}
                  data-invalid={!!fieldErrors.head_designation}
                  className={`${INPUT_CLASS} ${fieldErrors.head_designation ? INVALID_BORDER : ""}`}
                />
              </Field>

              <Field
                label="Contact Number"
                required
                error={fieldErrors.head_contact_number}
              >
                <input
                  type="tel"
                  name="head_contact_number"
                  placeholder="e.g. 0771234567"
                  value={formData.head_contact_number}
                  onChange={handleChange}
                  data-invalid={!!fieldErrors.head_contact_number}
                  className={`phone-prefix ${INPUT_CLASS} ${fieldErrors.head_contact_number ? INVALID_BORDER : ""}`}
                />
              </Field>

              <Field
                label="Official E-mail Address"
                required
                error={fieldErrors.head_email}
              >
                <input
                  type="email"
                  name="head_email"
                  placeholder="name@institution.lk"
                  value={formData.head_email}
                  onChange={handleChange}
                  data-invalid={!!fieldErrors.head_email}
                  className={`${INPUT_CLASS} ${fieldErrors.head_email ? INVALID_BORDER : ""}`}
                />
              </Field>
            </div>

            {/* Section C */}
            <SectionHeader step="C" title="NID Focal Point" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field
                label="Full Name"
                required
                error={fieldErrors.focal_full_name}
              >
                <input
                  type="text"
                  name="focal_full_name"
                  placeholder="Enter the full name"
                  value={formData.focal_full_name}
                  onChange={handleChange}
                  data-invalid={!!fieldErrors.focal_full_name}
                  className={`${INPUT_CLASS} ${fieldErrors.focal_full_name ? INVALID_BORDER : ""}`}
                />
              </Field>

              <Field
                label="Designation"
                required
                error={fieldErrors.focal_designation}
              >
                <input
                  type="text"
                  name="focal_designation"
                  placeholder="e.g. Senior Assistant Secretary"
                  value={formData.focal_designation}
                  onChange={handleChange}
                  data-invalid={!!fieldErrors.focal_designation}
                  className={`${INPUT_CLASS} ${fieldErrors.focal_designation ? INVALID_BORDER : ""}`}
                />
              </Field>

              <Field
                label="Department / Unit"
                required
                error={fieldErrors.focal_department}
              >
                <input
                  type="text"
                  name="focal_department"
                  placeholder="e.g. Division of Research"
                  value={formData.focal_department}
                  onChange={handleChange}
                  data-invalid={!!fieldErrors.focal_department}
                  className={`${INPUT_CLASS} ${fieldErrors.focal_department ? INVALID_BORDER : ""}`}
                />
              </Field>

              <Field
                label="Contact Number"
                required
                error={fieldErrors.focal_contact_number}
              >
                <input
                  type="tel"
                  name="focal_contact_number"
                  placeholder="e.g. 0771234567"
                  value={formData.focal_contact_number}
                  onChange={handleChange}
                  data-invalid={!!fieldErrors.focal_contact_number}
                  className={`phone-prefix ${INPUT_CLASS} ${fieldErrors.focal_contact_number ? INVALID_BORDER : ""}`}
                />
              </Field>

              <Field
                label="Official E-mail Address"
                required
                error={fieldErrors.focal_email}
              >
                <input
                  type="email"
                  name="focal_email"
                  placeholder="name@institution.lk"
                  value={formData.focal_email}
                  onChange={handleChange}
                  data-invalid={!!fieldErrors.focal_email}
                  className={`${INPUT_CLASS} ${fieldErrors.focal_email ? INVALID_BORDER : ""}`}
                />
              </Field>
            </div>

            {/* Declaration */}
            <SectionHeader step="D" title="Declaration" />

            <div className="rounded-[11px] border-[1.5px] border-[#e5e7eb] bg-[#f8fafc] p-4 mb-[18px]">
              <p className="m-0 text-[13.5px] leading-relaxed text-[#374151]">
                I hereby certify that the information provided herein is true
                and correct to the best of my knowledge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field
                label="Name of Authorized Officer"
                required
                error={fieldErrors.authorized_officer_name}
              >
                <input
                  type="text"
                  name="authorized_officer_name"
                  placeholder="Enter the authorized officer's name"
                  value={formData.authorized_officer_name}
                  onChange={handleChange}
                  data-invalid={!!fieldErrors.authorized_officer_name}
                  className={`${INPUT_CLASS} ${fieldErrors.authorized_officer_name ? INVALID_BORDER : ""}`}
                />
              </Field>

              <Field
                label="Designation"
                required
                error={fieldErrors.authorized_officer_designation}
              >
                <input
                  type="text"
                  name="authorized_officer_designation"
                  placeholder="Enter the designation"
                  value={formData.authorized_officer_designation}
                  onChange={handleChange}
                  data-invalid={!!fieldErrors.authorized_officer_designation}
                  className={`${INPUT_CLASS} ${fieldErrors.authorized_officer_designation ? INVALID_BORDER : ""}`}
                />
              </Field>
            </div>

            <label className="flex items-start gap-2.5 text-[13.5px] text-[#374151] cursor-pointer select-none mb-[22px]">
              <input
                type="checkbox"
                name="declaration_accepted"
                checked={formData.declaration_accepted}
                onChange={handleChange}
                data-invalid={!!fieldErrors.declaration_accepted}
                className="w-4 h-4 mt-0.5 accent-[#ee9310] cursor-pointer shrink-0"
              />
              <span>
                I certify that the above information is true and correct.
              </span>
            </label>
            {fieldErrors.declaration_accepted && (
              <div className="text-[12.5px] text-[#dc2626] mt-[-14px] mb-[18px] font-bold">
                {fieldErrors.declaration_accepted}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || redirecting}
              aria-busy={isLoading}
              className="w-full h-[50px] rounded-[10px] bg-[#EE9310] border-none text-white text-base font-bold uppercase tracking-[0.3px] cursor-pointer transition-all duration-250 hover:bg-[#d88106] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#EE9310]"
            >
              {redirecting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Redirecting to login...
                </span>
              ) : isLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Registration"
              )}
            </button>

            <div className="text-center mt-[22px] text-sm text-[#6b7280]">
              Already have an account?{" "}
              <a
                href={`${HOME_BASE}/user_authentication`}
                className="text-[#ee9310] font-semibold ml-1 no-underline transition-colors duration-200 hover:text-[#d88106] hover:underline"
              >
                Sign In here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
