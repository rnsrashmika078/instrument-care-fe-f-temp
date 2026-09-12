import React, { useEffect, useState } from "react";
import { API_BASE } from "../../config";

export default function ProfileFormLeft({ formData, handleChange }) {
  const [instruments, setInstruments] = useState([]);

  // ✅ Fetch instrument names from backend on component mount
  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/tech/instruments`
        );
        const result = await response.json();
        if (result.success && result.data) {
          setInstruments(result.data);
        } else {
          console.error("Failed to fetch instruments:", result);
        }
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };

    fetchInstruments();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h5 className="font-bold">Affiliation</h5>
      <label className="pl-4">
        Institute Name 
        <input
          type="text"
          name="institute_name"
          value={formData.institute_name}
          onChange={handleChange}
          className="border rounded p-1 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </label>
      <label className="pl-4">
        Designation
        <input
          type="text"
          name="current_designation"
          value={formData.current_designation}
          onChange={handleChange}
          className="border rounded p-1 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </label>

      <h5 className="font-bold">Details of the Supervisor</h5>

      <label className="pl-4">
        Name 
        <input
          type="text"
          name="supervisor_name"
          value={formData.supervisor_name}
          onChange={handleChange}
          className="border rounded p-1 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </label>

      <label className="pl-4">
        Designation 
        <input
          type="text"
          name="supervisor_Designation"
          value={formData.supervisor_Designation}
          onChange={handleChange}
          className="border rounded p-1 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </label>

      <label className="pl-4">
        Email 
        <input
          type="email"
          name="supervisor_Email"
          value={formData.supervisor_Email}
          onChange={handleChange}
          className="border rounded p-1 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </label>

      <h5 className="font-bold">Techinical Expertise</h5>

      <label className="pl-4">
        Laboratory Category
        <select
          name="laboratory_category"
          value={formData.laboratory_category}
          onChange={handleChange}
          className="border rounded p-2 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        >
          <option value="">Select Laboratory Category</option>
          <option value="1">Chemical Testing</option>
          <option value="2">Biological Testing</option>
          <option value="3">Physical & Mechanical Testing</option>
          <option value="4">Calibration Service</option>
          <option value="5">Biochemistry, Chemical Pathology, Clinical Pathology</option>
          <option value="6">Hematology and Immuno Hematology</option>
          <option value="7">Microbiology and Serology</option>
          <option value="8">Histopathology/Cytopathology</option>
          <option value="9">Immunology</option>
          <option value="10">Molecular Biology</option>
          <option value="11">Pharmacology</option>
          <option value="12">Andrology Clinical</option>
          <option value="13">Nuclear Medicine</option>
          <option value="14">Embryology</option>
        </select>
      </label>

      <label className="pl-4">
        Instrument Category
        <select
          name="instrument_category"
          value={formData.instrument_category}
          onChange={handleChange}
          className="border rounded p-2 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        >
          <option value="">Select Instrument Category</option>
          <option value="1">Analiytical Balance</option>
          <option value="2">Microscope</option>
          <option value="3">Centrifuger</option>
          <option value="4">Gas Chromatograph & GC/MS</option>
          <option value="5">High Performance Liquid Chromatograph (HPLC)</option>
          <option value="6">Ion Chromatograph</option>
          <option value="7">Spectrophotometers (AAS, ICPMS, ICPOES, FTIR, IRMS, UV-Visible, NMP, RAMAN, etc)</option>
          <option value="8">X-Ray Fluorescance Analyzers</option>
          <option value="9">Distillation Apparatus</option>
          <option value="10">Digestor</option>
          <option value="11">PCR System</option>
          <option value="12">Mixers/Shakers</option>
          <option value="13">pH & Conductivity Meter</option>
          <option value="14">Oven/Vacuum Oven</option>
          <option value="15">Muffle Furnace</option>
          <option value="16">Fume Hood</option>
          <option value="17">Water Bath</option>
          <option value="18">Incubator</option>
          <option value="19">Hot Plate</option>
          <option value="20">Evaporators</option>
          <option value="21">Sonicating Apparatus</option>
          <option value="22">Biochemistry Analyzers</option>
          <option value="23">Particle Size Analyzer</option>
          <option value="24">Bomb Calory Meters</option>
          <option value="25">Shakers</option>
          <option value="26">Dryers</option>
          <option value="27">Distill Water Plant</option>
          <option value="28">Glass Blowing Apparatus</option>
          <option value="29">Other Instruments/Apparatus</option>
          <option value="30">Machinery</option>
        </select>
      </label>

      <label className="pl-4">
        Instrument
        <select
          name="instrument"
          value={formData.instrument}
          onChange={handleChange}
          className="border rounded p-2 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        >
          <option value="">Select Instrument</option>
          {instruments.map((inst, index) => (
            <option key={index} value={inst.instrument_name.trim()}>
              {inst.instrument_name.trim()}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
