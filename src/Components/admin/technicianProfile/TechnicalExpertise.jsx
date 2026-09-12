import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { API_BASE } from "../../../config";

export default function TechnicalExpertise({ userId }) {
  const token = sessionStorage.getItem("token");
  const [tech_id, setTechId] = useState(null);

  const [labCategories, setLabCategories] = useState([]);
  const [instrumentCategories, setInstrumentCategories] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [newInstruments, setNewInstruments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showDropdowns, setShowDropdowns] = useState(false);
  const [options, setOptions] = useState([]);

  const [showDropdownInstCat, setShowDropdownInstCat] = useState(false);
  const [instrCatOptions, setInstrCatOptions] = useState([]);

  const [showDropdownInstruments, setShowDropdownInstruments] = useState(false);
  const [instrumentOptions, setInstrumentOptions] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedInstrumentCategories, setSelectedInstrumentCategories] =
    useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedNewInstruments, setSelectedNewInstruments] = useState([]);
  const [manualInstrumentName, setManualInstrumentName] = useState("");

  useEffect(() => {
    fetchTechnicianID();
  }, []);

  useEffect(() => {
    if (tech_id) {
      fetchLaboratoryCategories();
      fetchInstrumentCategories();
      fetchInstruments();
      fetchNewInstruments();
    }
  }, [tech_id]);

  const fetchTechnicianID = async () => {
    if (!userId || !token) return;

    try {
      const res = await fetch(`${API_BASE}/tech/profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Profile fetch failed with ${res.status}`);
      }

      const data = await res.json();
      setTechId(data.id || null);
    } catch (error) {
      console.error("Failed to fetch technician profile", error);
    }
  };

  const fetchLaboratoryCategories = async () => {
    const res = await fetch(
      `${API_BASE}/service-request/${tech_id}/laboratory-categories`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    console.log("Data", data);
    setLabCategories(data.laboratoryCategories || []);
  };

  const fetchInstrumentCategories = async () => {
    const res = await fetch(
      `${API_BASE}/service-request/${tech_id}/instrument-categories`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    setInstrumentCategories(data.instrumentsCategories || []);
  };

  const fetchInstruments = async () => {
    const res = await fetch(
      `${API_BASE}/service-request/${tech_id}/instruments`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    setInstruments(data.instruments || []);
  };

  const fetchNewInstruments = async () => {
    const res = await fetch(
      `${API_BASE}/service-request/${tech_id}/new-instruments`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    setNewInstruments(data.newInstruments || []);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE}/tech/laboratory-categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      const formattedOptions = (data.data || []).map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setOptions(formattedOptions);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInstrumentCategoryData = async () => {
    try {
      const response = await fetch(`${API_BASE}/tech/instrument-categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      const formattedOptions = (data.data || []).map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setInstrCatOptions(formattedOptions);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInstrumentData = async () => {
    try {
      const response = await fetch(`${API_BASE}/tech/instruments`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      const formattedOptions = (data.data || []).map((item) => ({
        value: item.instrument_id,
        label: item.instrument_name,
      }));

      setInstrumentOptions(formattedOptions);
    } catch (error) {
      console.error(error);
    }
  };

  const addDropdown = async () => {
    await fetchData();
    setShowDropdowns((prev) =>
      Array.isArray(prev) ? [...prev, true] : [true],
    );
    setSelectedCategories((prev) =>
      Array.isArray(prev) ? [...prev, null] : [null],
    );
  };

  const addDropdownInstCat = async () => {
    await fetchInstrumentCategoryData();
    setShowDropdownInstCat((prev) =>
      Array.isArray(prev) ? [...prev, true] : [true],
    );
    setSelectedInstrumentCategories((prev) =>
      Array.isArray(prev) ? [...prev, null] : [null],
    );
  };

  const addDropdownInstrument = async () => {
    await fetchInstrumentData();
    setShowDropdownInstruments((prev) =>
      Array.isArray(prev) ? [...prev, true] : [true],
    );
    setSelectedInstruments((prev) =>
      Array.isArray(prev) ? [...prev, null] : [null],
    );
  };

  const addRow = () => {
    setSelectedNewInstruments([...newInstruments, newInstruments]);
  };

  const handleChange = (selected, index) => {
    const updated = [...selectedCategories];
    updated[index] = selected;
    setSelectedCategories(updated);
  };

  const handleInstrumentCategoryChange = (selected, index) => {
    const updated = [...selectedInstrumentCategories];
    updated[index] = selected;
    setSelectedInstrumentCategories(updated);
  };

  const handleInstrumentChange = (selected, index) => {
    const updated = [...selectedInstruments];
    updated[index] = selected;
    setSelectedInstruments(updated);
  };

  const addManualInstrument = () => {
    if (manualInstrumentName.trim()) {
      setSelectedNewInstruments([
        ...selectedNewInstruments,
        manualInstrumentName.trim(),
      ]);
      setManualInstrumentName("");
    }
  };

  const removeManualInstrument = (index) => {
    setSelectedNewInstruments(
      selectedNewInstruments.filter((_, i) => i !== index),
    );
  };

  const removeDropdown = (index) => {
    setShowDropdowns((prev) => prev.filter((_, i) => i !== index));
    setSelectedCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const removeDropdownInstCat = (index) => {
    setShowDropdownInstCat((prev) => prev.filter((_, i) => i !== index));
    setSelectedInstrumentCategories((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  const removeDropdownInstrument = (index) => {
    setShowDropdownInstruments((prev) => prev.filter((_, i) => i !== index));
    setSelectedInstruments((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTechnicalExpertise = async () => {
    try {
      setLoading(true);

      if (!tech_id || !token) {
        toast.warn("Technician profile is not loaded yet.");
        return;
      }

      const payload = {
        tech_id,
        laboratory_categories: selectedCategories.map((c) => c?.value),
        instrument_categories: selectedInstrumentCategories.map(
          (c) => c?.value,
        ),
        instruments: selectedInstruments.map((c) => c?.value),
        new_instruments: selectedNewInstruments,
      };

      const res = await fetch(`${API_BASE}/tech/profile/expertise/${tech_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resultText = await res.text();
      let result = {};

      try {
        result = resultText ? JSON.parse(resultText) : {};
      } catch {
        result = { message: resultText };
      }

      if (res.ok) {
        toast.success("Technical expertise updated successfully");
      } else {
        console.error("Update error", result);
        toast.error(result.message || result.error || "Failed to update expertise");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating expertise");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#ffffff80] shadow rounded-xl p-6 space-y-8">
      <h2 className="text-lg font-semibold">Technical Expertise</h2>

      <div>
        <h3 className="font-medium mb-3">Laboratory Categories</h3>
        <div className="flex flex-wrap gap-2">
          {labCategories.map((lab, i) => (
            <span
              key={i}
              className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-orange-200"
            >
              {lab.name}
            </span>
          ))}
        </div>

        {Array.isArray(showDropdowns) &&
          showDropdowns.map((show, i) => (
            <div key={i} className="mt-3 w-64">
              <Select
                options={options}
                value={selectedCategories[i] || null}
                onChange={(selected) => handleChange(selected, i)}
                isSearchable
              />
              <button
                type="button"
                onClick={() => removeDropdown(i)}
                className="text-red-500 text-sm mt-1"
              >
                × Remove
              </button>
            </div>
          ))}

        <button onClick={addDropdown} className="text-orange-500 text-sm mt-2">
          + Add Laboratory Category
        </button>
      </div>

      <div>
        <h3 className="font-medium mb-2">Instrument Categories </h3>
        <div className="flex flex-wrap gap-2">
          {instrumentCategories.map((instrumentCat, i) => (
            <span
              key={i}
              className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-orange-200"
            >
              {instrumentCat.name}
            </span>
          ))}
        </div>

        {Array.isArray(showDropdownInstCat) &&
          showDropdownInstCat.map((show, i) => (
            <div key={i} className="mt-3 w-64">
              <Select
                options={instrCatOptions}
                value={selectedInstrumentCategories[i] || null}
                onChange={(selected) =>
                  handleInstrumentCategoryChange(selected, i)
                }
                isSearchable
              />
              <button
                type="button"
                onClick={() => removeDropdownInstCat(i)}
                className="text-red-500 text-sm mt-1"
              >
                × Remove
              </button>
            </div>
          ))}

        <button
          onClick={addDropdownInstCat}
          className="text-orange-500 text-sm mt-2"
        >
          + Add Instrument Category
        </button>
      </div>

      <div>
        <h3 className="font-medium mb-2">Instruments</h3>
        <div className="flex flex-wrap gap-2">
          {instruments.map((instrument, i) => (
            <span
              key={i}
              className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-orange-200"
            >
              {instrument.instrument_name}
            </span>
          ))}
        </div>

        {Array.isArray(showDropdownInstruments) &&
          showDropdownInstruments.map((show, i) => (
            <div key={i} className="mt-3 w-64">
              <Select
                options={instrumentOptions}
                value={selectedInstruments[i] || null}
                onChange={(selected) => handleInstrumentChange(selected, i)}
                isSearchable
              />
              <button
                type="button"
                onClick={() => removeDropdownInstrument(i)}
                className="text-red-500 text-sm mt-1"
              >
                × Remove
              </button>
            </div>
          ))}

        <button
          onClick={addDropdownInstrument}
          className="text-orange-500 text-sm mt-2"
        >
          + Add Instrument
        </button>
      </div>

      <div>
        <h3 className="font-medium mb-2">Any other Instruments</h3>
        <div className="flex flex-wrap gap-2">
          {newInstruments.map((instrument, i) => (
            <span
              key={i}
              className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-orange-200"
            >
              {instrument.instrument_name}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {selectedNewInstruments.map((instrument, i) => (
            <span
              key={i}
              className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1"
            >
              {instrument}
              <button
                type="button"
                onClick={() => removeManualInstrument(i)}
                className="text-red-500 text-xs"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={manualInstrumentName}
            onChange={(e) => setManualInstrumentName(e.target.value)}
            placeholder="Enter instrument name"
            className="px-3 py-1 border border-gray-300 rounded-md flex-1"
          />
          <button
            type="button"
            onClick={addManualInstrument}
            className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={updateTechnicalExpertise}
          disabled={loading}
          className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-500"
        >
          {loading ? "Updating..." : "Update Technical Expertise"}
        </button>
      </div>
    </div>
  );
}
