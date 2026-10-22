import React from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-wrap items-center w-full max-w-7xl mx-auto p-2 gap-2 font-poppins"
    >
      {/* Input field */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          aria-label="Search Instrument or Technician"
          placeholder="Search Instrument or Technician"
          className="w-full rounded-md border-2 border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-800 placeholder:text-gray-400 transition-colors hover:border-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400/30"
        />
      </div>

      {/* Search button */}
      <div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-md bg-orange-500 px-10 py-2 font-bold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98]"
        >
          <Search className="h-4 w-4" />
          SEARCH
        </button>
      </div>
    </form>
  );
}
