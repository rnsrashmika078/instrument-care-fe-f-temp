import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function AllInstrument({ instrumentsData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredInstruments = instrumentsData.filter((inst) => {
    // Search Filter
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      String(inst.id).toLowerCase().includes(term) ||
      String("Tech/" + inst.technician_id).toLowerCase().includes(term) ||
      (inst.technician_name && inst.technician_name.toLowerCase().includes(term)) ||
      String("Inst/" + inst.instrument_id).toLowerCase().includes(term) ||
      (inst.instrument_name && inst.instrument_name.toLowerCase().includes(term)) ||
      String("NewInst/" + inst.new_instrument_id).toLowerCase().includes(term) ||
      (inst.new_instrument_name && inst.new_instrument_name.toLowerCase().includes(term));

    // Date Filter
    let withinDateRange = true;
    if (fromDate || toDate) {
      const instDate = new Date(inst.created_at);
      if (fromDate) {
        withinDateRange = withinDateRange && instDate >= new Date(fromDate);
      }
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        withinDateRange = withinDateRange && instDate <= to;
      }
    }

    return matchesSearch && withinDateRange;
  });

  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins min-h-[720px]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="font-bold text-lg text-gray-800 w-full md:w-auto">All Instruments</h3>

        <div className="flex flex-col xl:flex-row gap-4 w-full md:w-auto items-center">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by ID, Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full xl:w-64 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          />

          {/* Date Filters */}
          <div className="flex items-center gap-2 w-full xl:w-auto">
            <span className="text-sm text-gray-500 whitespace-nowrap">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 w-full"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 w-full"
            />
          </div>
          <label className="font-semibold text-gray-700 bg-white px-3 py-2 rounded-md border text-sm shadow-sm shrink-0">Records: {filteredInstruments.length}</label>

        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredInstruments.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center">
            No instruments found matching your criteria.
          </p>
        ) : (
          <div className="max-h-[720px] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b bg-gray-100 text-gray-700">
                  <th className="p-3">ID</th>
                  <th className="p-3">Technician ID</th>
                  {/* <th className="p-3">Technician Name</th> */}
                  <th className="p-3">Instrument ID</th>
                  {/* <th className="p-3">Instrument Name</th> */}
                  <th className="p-3">New Instrument ID</th>
                  {/* <th className="p-3">New Instrument Name</th> */}
                  <th className="p-3">Created At</th>
                </tr>
              </thead>

              <tbody>
                {filteredInstruments.map((inst, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-orange-50 transition-colors"
                  >
                    <td className="p-3">{inst.id}</td>
                    <td className="p-3">Tech/{inst.technician_id} {inst.technician_name ? `- ${inst.technician_name}` : ''}</td>
                    <td className="p-3">{inst.instrument_id ? `Inst/${inst.instrument_id}` : 'N/A'} {inst.instrument_name ? `- ${inst.instrument_name}` : ''}</td>
                    <td className="p-3">{inst.new_instrument_id ? `NewInst/${inst.new_instrument_id}` : 'N/A'} {inst.new_instrument_name ? `- ${inst.new_instrument_name}` : ''}</td>
                    <td className="p-3">{inst.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
