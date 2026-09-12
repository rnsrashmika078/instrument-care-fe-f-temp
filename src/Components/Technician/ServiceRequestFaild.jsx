import React from "react";

export default function ServiceRequestFailed({ onBack = () => {} }) {
  return (
    <div className="rounded-lg p-4 sm:p-6 w-full mx-auto shadow bg-[#ffffff80]">
      {/* Title */}
      <h3 className="font-bold text-lg">Accept Service Request</h3>

      {/* Subtitle */}
      <p className="mt-1 font-semibold text-sm">
        Failed to send response to service request.
      </p>

      <hr className="my-4" />

      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="bg-red-500 rounded-full w-40 h-40 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-50 w-50 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
          </svg>
        </div>
      </div>

      {/* Main Message */}
      <p className="mt-6 text-center font-bold text-lg">
        Failed to send the service request acceptance to the request owner.
      </p>
      <p className="text-center text-gray-500">
        Please try again later or contact the system administrator for assistance.
      </p>

      <hr className="mt-6" />

      {/* Back Button */}
      <div className="flex justify-center sm:justify-end mt-4">
        <button
          onClick={onBack}
          className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-md font-semibold w-md"
        >
          Back
        </button>
      </div>
    </div>
  );
}
