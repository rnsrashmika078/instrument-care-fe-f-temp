import React from "react";
import { IdTag, StatusPill } from "../admin/TableUI";
import { formatDate } from "../utils/format";
import { formatPhone } from "../utils/phone";

const readField = (row, keys) => {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
};

const SECTIONS = [
  {
    title: "Client",
    fields: [
      ["Client Name", ["full_name"]],
      ["Email", ["email"]],
      ["Contact Number", ["contact_number"]],
      ["Physical Address", ["physical_address"]],
    ],
  },
  {
    title: "Institute",
    fields: [
      ["Institute Name", ["institute_name"]],
      ["Institute Address", ["institute_address"]],
    ],
  },
  {
    title: "Instrument",
    fields: [
      ["Instrument Name", ["instrument_name"]],
      ["Instrument Brand", ["instrument_brand"]],
      ["Instrument Model", ["instrument_model"]],
      ["Manufacturer", ["instrument_manufacturer"]],
      ["Manufactured Year", ["manufactured_year", "instrument_manufactured_year"]],
      [
        "Product Testing Type",
        ["product_testing_type", "instrument_product_testing_type"],
      ],
      ["Testing Parameter", ["testing_parameter", "instrument_testing_parameter"]],
      ["Consumption Period", ["consumption_period", "instrument_consumption_period"]],
    ],
  },
];

function DetailItem({ label, children, wide = false }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <div className="mt-1 break-words text-sm text-gray-700">{children ?? "\u2014"}</div>
    </div>
  );
}

export default function ServiceRequestModal({ request, onClose, children }) {
  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-gradient-to-b from-white to-orange-50/40 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Service Request Details
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <IdTag prefix="SR-" value={String(request.id).padStart(4, "0")} />
              <StatusPill status={request.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            title="Close"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="flex-grow space-y-6 overflow-y-auto p-6">
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-orange-600">
              Timeline
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <DetailItem label="Request Date">{formatDate(request.created_at)}</DetailItem>
              <DetailItem label="Accept Date">{formatDate(request.start_date)}</DetailItem>
              <DetailItem label="Completed Date">{formatDate(request.end_date)}</DetailItem>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-orange-600">
              Problem
            </h3>
            <div className="rounded-xl border border-gray-100 bg-orange-50/50 px-4 py-3 text-sm leading-relaxed text-gray-700">
              {request.issue_description ?? "\u2014"}
            </div>
          </section>

          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-orange-600">
                {section.title}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {section.fields.map(([label, keys]) => {
                  const value = readField(request, keys);
                  return (
                    <DetailItem key={label} label={label}>
                      {label === "Contact Number" ? formatPhone(value) : value}
                    </DetailItem>
                  );
                })}
              </div>
            </section>
          ))}

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-orange-600">
              Feedback
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <DetailItem label="Rating">{readField(request, ["rate"])}</DetailItem>
              <DetailItem label="Review" wide>
                {readField(request, ["review"])}
              </DetailItem>
            </div>
          </section>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 bg-orange-50/30 px-6 py-4">
          {children}
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
