import React from "react";
import { Link } from "react-router-dom";

export default function ServiceRequestDetails({ details }) {
  const placeholder = !details;

  const Field = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">
        {placeholder ? "-" : value || "-"}
      </span>
    </div>
  );

  return (
    <div className="bg-[#ffffff80] rounded-lg p-5 mt-4 shadow-sm">
      <h3 className="font-bold text-lg mb-4">Detailed View</h3>

      {/* Owner Details */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Client Details</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-lg p-4 border">
          <Field label="Full Name" value={details?.full_name} />
          <Field label="Email Address" value={details?.email} />
          <Field label="Physical Address" value={details?.institute_address} />
          <Field label="Contact Number" value={details?.contact_number} />
        </div>
      </div>

      {/* Instrument Details */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Instrument Details</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-lg p-4 border">
          <Field label="Instrument Name" value={details?.instrument_name} />
          <Field label="Instrument Brand" value={details?.instrument_brand} />
          <Field label="Instrument Model" value={details?.instrument_model} />
          <Field label="Instrument Manufacturer" value={details?.instrument_manufacturer} />
        </div>
        <br />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-lg p-4 border">
          <Field label="Manufactured Year" value={details?.manufactured_year} />
          <Field label="Product Testing Type" value={details?.product_testing_type} />
          <Field label="Testing Parameters" value={details?.testing_parameter} />
          <Field label="Consumption Period" value={details?.consumption_period} />
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-2">Issue Description</h4>
        <div className="bg-white border rounded-lg p-4 text-gray-800">
          {placeholder ? "-" : details?.issue_description || "-"}
        </div>
      </div>

      {/* Institute Details */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Institute Details</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-lg p-4 border">
          <Field label="Institute Name" value={details?.institute_name} />
          <Field label="Institute Address" value={details?.institute_address} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 sm:justify-end">
        <Link to="/tech/reject-service-request"
          state={{
            request_id: details?.id,
            email: details?.email
          }}
        >
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold">
            Reject
          </button>
        </Link>

        <Link to="/tech/accept-service-request"
          state={{
            request_id: details?.id,
            email: details?.email
          }}
        >
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold">
            Accept
          </button>
        </Link>
      </div>
    </div>
  );
}