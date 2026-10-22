import React from "react";

export default function ServiceRequestRejectSuccess({ onBack = () => {} }) {
  return (
    <div className="rounded-lg p-4 sm:p-6 w-full mx-auto shadow-sm bg-white border-2 border-gray-200 font-poppins">
      {/* Title */}
      <h3 className="font-bold text-lg text-gray-800">Reject Service Request</h3>

      {/* Subtitle */}
      <p className="mt-1 text-sm text-gray-500">
        Successful Response to the Service Request
      </p>

      <div className="h-px bg-gray-200 my-4" />

      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="bg-green-500 rounded-full w-24 h-24 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Main Message */}
      <p className="mt-6 text-center font-bold text-base text-gray-800">
        The service request rejection has been sent to the request owner successfully.
      </p>
      <p className="text-center text-sm text-gray-500">
        The request owner will be notified shortly.
      </p>

      <div className="h-px bg-gray-200 mt-6" />

      {/* Back Button */}
      <div className="flex justify-center sm:justify-end mt-4">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}
