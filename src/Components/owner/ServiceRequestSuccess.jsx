import React from "react";

export default function ServiceRequestSuccess({ onBack = () => {} }) {
  return (
    <div className="rounded-lg p-4 sm:p-6 w-full mx-auto shadow bg-[#ffffff80]">
      {/* Title */}
      {/* <h3 className="font-bold text-lg">Accept Service Request</h3> */}

      {/* Subtitle */}
      {/* <p className="mt-1 font-semibold text-sm">
        Successful Response to the Service Request
      </p> */}

      {/* <hr className="my-4" /> */}

      {/* Success Icon */}
      <div className="flex justify-center pt-40">
        <div className="bg-green-500 rounded-full w-40 h-40 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-25 w-25 text-white"
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
      <p className="mt-6 text-center font-bold text-lg">
        Your service request has been created successfully.
      </p>
      <p className="text-center text-gray-500">
         A technician will reach out to you shortly via email or phone.
      </p>

      {/* <hr className="mt-6" /> */}

      {/* Back Button */}
      <div className="flex justify-center sm:justify-end mt-4 gap-5 pt-33">
        <button
          onClick={onBack}
          className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-md font-semibold w-md"
        >
          Back
        </button>

        <button
          onClick={onBack}
          className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-md font-semibold w-md"
        >
          Edit Service Request
        </button>
      </div>
    </div>
  );
}
