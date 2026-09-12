import React from "react";

export default function SearchBar() {
  return (
    <div className="flex flex-wrap items-center w-full max-w-7xl mx-auto p-2 gap-2 font-poppins">
      {/* Input field */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search Instrument or Technician"
          className="w-full border-2 rounded-md px-4 py-2 focus:outline-none"
        />
      </div>

      {/* Search button */}
      <div>
        <button
          className="bg-orange-400 text-white font-bold px-10 py-2 rounded-md hover:bg-orange-600 transition"
        >
          SEARCH
        </button>
      </div>
    </div>
  );
}
