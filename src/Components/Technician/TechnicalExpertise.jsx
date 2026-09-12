import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { API_BASE } from "../../config";

const steps = [
  { label: "Instruments" },
  { label: "Instrument Categories" },
  { label: "Laboratory Categories" },
];

export default function TechnicalExpertise() {
  const userId = sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("token");

  const [tech_id, setTechId] = useState(null);

  const [labCategories, setLabCategories] = useState([]);
  const [instrumentCategories, setInstrumentCategories] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [newInstruments, setNewInstruments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const [showDropdowns, setShowDropdowns] = useState([]);
  const [options, setOptions] = useState([]);

  const [showDropdownInstCat, setShowDropdownInstCat] = useState([]);
  const [instrCatOptions, setInstrCatOptions] = useState([]);

  const [showDropdownInstruments, setShowDropdownInstruments] = useState([]);
  const [instrumentOptions, setInstrumentOptions] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedInstrumentCategories, setSelectedInstrumentCategories] =
    useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedNewInstruments, setSelectedNewInstruments] = useState([]);

  const [manualInstrumentName, setManualInstrumentName] = useState("");

  const [recentInstruments, setRecentInstruments] = useState([]);

  const [customLabCatValues, setCustomLabCatValues] = useState({});
  const [customInstrCatValues, setCustomInstrCatValues] = useState({});
  const [customInstrumentValues, setCustomInstrumentValues] = useState({});

  useEffect(() => {
    fetchTechnicianID();
    fetchRecentInstruments();
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
    try {
      const res = await fetch(`${API_BASE}/tech/profile/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setTechId(data.id || null);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentInstruments = async () => {
    try {
      const res = await fetch(`${API_BASE}/tech/recent-instruments`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRecentInstruments(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLaboratoryCategories = async () => {
    try {
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
      setLabCategories(data.laboratoryCategories || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInstrumentCategories = async () => {
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInstruments = async () => {
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNewInstruments = async () => {
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE}/tech/laboratory-categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();

      const formattedOptions = (data.data || []).map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setOptions(ensureOther(formattedOptions));
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

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();

      const formattedOptions = (data.data || []).map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setInstrCatOptions(ensureOther(formattedOptions));
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

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();

      const formattedOptions = (data.data || []).map((item) => ({
        value: item.instrument_id,
        label: item.instrument_name,
        custom_category: item.custom_category,
      }));

      setInstrumentOptions(ensureOther(formattedOptions));
    } catch (error) {
      console.error(error);
    }
  };

  const isOtherOption = (option) => {
    const label = option?.label ?? option ?? "";

    return ["other", "others"].includes(String(label).trim().toLowerCase());
  };

  const ensureOther = (opts) => {
    const hasOther = opts.some((o) => isOtherOption(o));

    return hasOther ? opts : [...opts, { value: "other", label: "Other" }];
  };

  const startEdit = () => {
    setIsEditing(true);
    setStep(0);

    setShowDropdowns([]);
    setShowDropdownInstCat([]);
    setShowDropdownInstruments([]);

    setSelectedCategories([]);
    setSelectedInstrumentCategories([]);
    setSelectedInstruments([]);
    setSelectedNewInstruments([]);

    setCustomLabCatValues({});
    setCustomInstrCatValues({});
    setCustomInstrumentValues({});

    setManualInstrumentName("");
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setStep(0);

    setShowDropdowns([]);
    setShowDropdownInstCat([]);
    setShowDropdownInstruments([]);

    setSelectedCategories([]);
    setSelectedInstrumentCategories([]);
    setSelectedInstruments([]);
    setSelectedNewInstruments([]);

    setCustomLabCatValues({});
    setCustomInstrCatValues({});
    setCustomInstrumentValues({});

    setManualInstrumentName("");
  };

  const addDropdown = async () => {
    await fetchData();

    setShowDropdowns((prev) => [...prev, true]);
    setSelectedCategories((prev) => [...prev, null]);
  };

  const addDropdownInstCat = async () => {
    await fetchInstrumentCategoryData();

    setShowDropdownInstCat((prev) => [...prev, true]);
    setSelectedInstrumentCategories((prev) => [...prev, null]);
  };

  const addDropdownInstrument = async () => {
    await fetchInstrumentData();

    setShowDropdownInstruments((prev) => [...prev, true]);
    setSelectedInstruments((prev) => [...prev, null]);
  };

  const handleChange = (selected, index) => {
    const updated = [...selectedCategories];

    updated[index] = selected;

    setSelectedCategories(updated);

    if (!selected || !isOtherOption(selected)) {
      setCustomLabCatValues((prev) => ({
        ...prev,
        [index]: "",
      }));
    }
  };

  const handleInstrumentCategoryChange = (selected, index) => {
    const updated = [...selectedInstrumentCategories];

    updated[index] = selected;

    setSelectedInstrumentCategories(updated);

    if (!selected || !isOtherOption(selected)) {
      setCustomInstrCatValues((prev) => ({
        ...prev,
        [index]: "",
      }));
    }
  };

  const handleInstrumentChange = (selected, index) => {
    const updated = [...selectedInstruments];

    updated[index] = selected;

    setSelectedInstruments(updated);

    if (!selected || !isOtherOption(selected)) {
      setCustomInstrumentValues((prev) => ({
        ...prev,
        [index]: "",
      }));
    }
  };

  const addManualInstrument = () => {
    if (manualInstrumentName.trim()) {
      setSelectedNewInstruments((prev) => [
        ...prev,
        manualInstrumentName.trim(),
      ]);

      setManualInstrumentName("");
    }
  };

  const removeManualInstrument = (index) => {
    setSelectedNewInstruments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeDropdown = (index) => {
    setShowDropdowns((prev) => prev.filter((_, i) => i !== index));

    setSelectedCategories((prev) => prev.filter((_, i) => i !== index));

    setCustomLabCatValues((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const removeDropdownInstCat = (index) => {
    setShowDropdownInstCat((prev) => prev.filter((_, i) => i !== index));

    setSelectedInstrumentCategories((prev) =>
      prev.filter((_, i) => i !== index),
    );

    setCustomInstrCatValues((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const removeDropdownInstrument = (index) => {
    setShowDropdownInstruments((prev) => prev.filter((_, i) => i !== index));

    setSelectedInstruments((prev) => prev.filter((_, i) => i !== index));

    setCustomInstrumentValues((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const updateTechnicalExpertise = async () => {
    try {
      setLoading(true);

      const payload = {
        tech_id,

        laboratory_categories: selectedCategories
          .map((c) => (c?.value === "other" ? null : c?.value))
          .filter((v) => v),

        instrument_categories: selectedInstrumentCategories
          .map((c) => (c?.value === "other" ? null : c?.value))
          .filter((v) => v),

        instruments: selectedInstruments
          .map((c) => (c?.value === "other" ? null : c?.value))
          .filter((v) => v),

        lab_cat_custom_value: selectedCategories
          .map((c, i) =>
            isOtherOption(c) ? (customLabCatValues[i] || "").trim() : null,
          )
          .filter((v) => v),

        inst_cat_custom_value: selectedInstrumentCategories
          .map((c, i) =>
            isOtherOption(c)
              ? (customInstrCatValues[i] || "").trim()
              : null,
          )
          .filter((v) => v),

        inst_custom_value: selectedInstruments
          .map((c, i) =>
            isOtherOption(c)
              ? (customInstrumentValues[i] || "").trim()
              : null,
          )
          .filter((v) => v),
      };

      console.log(payload);

      const res = await fetch(`${API_BASE}/tech/profile/expertise/${tech_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        await fetchLaboratoryCategories();
        await fetchInstrumentCategories();
        await fetchInstruments();
        await fetchNewInstruments();

        setIsEditing(false);
        setStep(0);

        setShowDropdowns([]);
        setShowDropdownInstCat([]);
        setShowDropdownInstruments([]);

        setSelectedCategories([]);
        setSelectedInstrumentCategories([]);
        setSelectedInstruments([]);
        setSelectedNewInstruments([]);

        setCustomLabCatValues({});
        setCustomInstrCatValues({});
        setCustomInstrumentValues({});

        setManualInstrumentName("");

        toast.success("Technical expertise updated successfully");
      } else {
        console.error("Update error", result);
        toast.error("Failed to update expertise");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating expertise");
    } finally {
      setLoading(false);
    }
  };

  const stepValid = () => {
    switch (step) {
      case 0: // Instruments
        // Check if at least one instrument is selected
        const hasInstrument = selectedInstruments.some((inst) => {
          if (!inst) return false;
          // If it's "Other", check if custom value is filled
          if (isOtherOption(inst)) {
            const index = selectedInstruments.indexOf(inst);
            return (customInstrumentValues[index] || "").trim() !== "";
          }
          return true;
        });
        return hasInstrument;

      case 1: // Instrument Categories
        // Check if at least one instrument category is selected
        const hasInstCategory = selectedInstrumentCategories.some((cat) => {
          if (!cat) return false;
          // If it's "Other", check if custom value is filled
          if (isOtherOption(cat)) {
            const index = selectedInstrumentCategories.indexOf(cat);
            return (customInstrCatValues[index] || "").trim() !== "";
          }
          return true;
        });
        return hasInstCategory;

      case 2: // Laboratory Categories
        // Check if at least one category is selected
        const hasLabCategory = selectedCategories.some((cat) => {
          if (!cat) return false;
          // If it's "Other", check if custom value is filled
          if (isOtherOption(cat)) {
            const index = selectedCategories.indexOf(cat);
            return (customLabCatValues[index] || "").trim() !== "";
          }
          return true;
        });
        return hasLabCategory;

      default:
        return true;
    }
  };

  const goNext = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      updateTechnicalExpertise();
    }
  };

  const goBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const renderSavedLabCategories = () => (
    <div className="flex flex-wrap gap-2">
      {labCategories.length > 0 ? (
        labCategories.map((lab, i) => (
          <span
            key={i}
            className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-orange-200"
          >
            {lab.name || lab.custom_category}
          </span>
        ))
      ) : (
        <span className="text-sm text-gray-400">
          No laboratory categories selected.
        </span>
      )}
    </div>
  );

  const renderSavedInstrumentCategories = () => (
    <div className="flex flex-wrap gap-2">
      {instrumentCategories.length > 0 ? (
        instrumentCategories.map((instrumentCat, i) => (
          <span
            key={i}
            className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-orange-200"
          >
            {instrumentCat.name || instrumentCat.custom_category}
          </span>
        ))
      ) : (
        <span className="text-sm text-gray-400">
          No instrument categories selected.
        </span>
      )}
    </div>
  );

  const renderSavedInstruments = () => (
    <div className="flex flex-wrap gap-2">
      {instruments.length > 0 ? (
        instruments.map((instrument, i) => (
          <span
            key={i}
            className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-orange-200"
          >
            {instrument.instrument_name || instrument.custom_category}
          </span>
        ))
      ) : (
        <span className="text-sm text-gray-400">
          No instruments selected.
        </span>
      )}
    </div>
  );

  const renderLabCategories = () => (
    <div>
      <h3 className="font-medium text-gray-700 mb-3">
        Laboratory Categories
      </h3>

      {renderSavedLabCategories()}

      {showDropdowns.map((show, i) => (
        <div key={i} className="mt-3 w-full max-w-xs sm:max-w-sm">
          <Select
            options={options}
            value={selectedCategories[i] || null}
            onChange={(selected) => handleChange(selected, i)}
            isSearchable
            placeholder="Select Laboratory Category"
          />

          {isOtherOption(selectedCategories[i]) && (
            <input
              value={customLabCatValues[i] || ""}
              onChange={(e) =>
                setCustomLabCatValues((prev) => ({
                  ...prev,
                  [i]: e.target.value,
                }))
              }
              className="bg-white border mt-2 border-gray-300 p-2 rounded-md w-full"
              placeholder="Enter Custom Laboratory Category"
            />
          )}

          <button
            type="button"
            onClick={() => removeDropdown(i)}
            className="text-red-500 hover:text-red-600 text-sm mt-1.5 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addDropdown}
        className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-3 flex items-center gap-1 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Laboratory Category
      </button>
    </div>
  );

  const renderInstrumentCategories = () => (
    <div>
      <h3 className="font-medium text-gray-700 mb-3">
        Instrument Categories
      </h3>

      {renderSavedInstrumentCategories()}

      {showDropdownInstCat.map((show, i) => (
        <div key={i} className="mt-3 w-full max-w-xs sm:max-w-sm">
          <Select
            options={instrCatOptions}
            value={selectedInstrumentCategories[i] || null}
            onChange={(selected) =>
              handleInstrumentCategoryChange(selected, i)
            }
            isSearchable
            placeholder="Select Instrument Category"
          />

          {isOtherOption(selectedInstrumentCategories[i]) && (
            <input
              value={customInstrCatValues[i] || ""}
              onChange={(e) =>
                setCustomInstrCatValues((prev) => ({
                  ...prev,
                  [i]: e.target.value,
                }))
              }
              className="bg-white border mt-2 border-gray-300 p-2 rounded-md w-full"
              placeholder="Enter Custom Instrument Category"
            />
          )}

          <button
            type="button"
            onClick={() => removeDropdownInstCat(i)}
            className="text-red-500 hover:text-red-600 text-sm mt-1.5 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addDropdownInstCat}
        className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-3 flex items-center gap-1 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Instrument Category
      </button>
    </div>
  );

  const renderInstruments = () => (
    <div>
      <h3 className="font-medium text-gray-700 mb-3">Instruments</h3>

      {renderSavedInstruments()}

      {showDropdownInstruments.map((show, i) => (
        <div key={i} className="mt-3 w-full max-w-xs sm:max-w-sm">
          <Select
            options={instrumentOptions}
            value={selectedInstruments[i] || null}
            onChange={(selected) => handleInstrumentChange(selected, i)}
            isSearchable
            placeholder="Select Instrument"
          />

          {isOtherOption(selectedInstruments[i]) && (
            <input
              value={customInstrumentValues[i] || ""}
              onChange={(e) =>
                setCustomInstrumentValues((prev) => ({
                  ...prev,
                  [i]: e.target.value,
                }))
              }
              className="bg-white border mt-2 border-gray-300 p-2 rounded-md w-full"
              placeholder="Enter Custom Instrument Name"
            />
          )}

          <button
            type="button"
            onClick={() => removeDropdownInstrument(i)}
            className="text-red-500 hover:text-red-600 text-sm mt-1.5 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addDropdownInstrument}
        className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-3 flex items-center gap-1 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Instrument
      </button>
    </div>
  );

  const renderNewInstruments = () => (
    <div>
      <h3 className="font-medium text-gray-700 mb-3">
        Manual / Unlisted Instruments
      </h3>

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
            className="px-3 py-1.5 text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-2"
          >
            {instrument}

            <button
              type="button"
              onClick={() => removeManualInstrument(i)}
              className="text-blue-400 hover:text-blue-600 focus:outline-none bg-blue-100 rounded-full p-0.5"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={manualInstrumentName}
          onChange={(e) => setManualInstrumentName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addManualInstrument();
            }
          }}
          placeholder="E.g., Custom Centrifuge Model X"
          className="px-4 py-2 border border-gray-300 rounded-lg flex-1 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
        />

        <button
          type="button"
          onClick={addManualInstrument}
          className="bg-white border border-orange-500 text-orange-600 px-5 py-2 rounded-lg hover:bg-orange-50 font-medium transition-colors"
        >
          Add Manual Override
        </button>
      </div>
    </div>
  );

  const stepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-8">
            {renderInstruments()}
            {/* {renderNewInstruments()} */}
          </div>
        );

      case 1:
        return renderInstrumentCategories();

      case 2:
        return renderLabCategories();

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#ffffff80] shadow rounded-xl p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 border-dashed">
        <h2 className="text-xl font-bold text-gray-800">
          Technical Expertise
        </h2>

        {!isEditing ? (
          <button
            type="button"
            onClick={startEdit}
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
              />
            </svg>
            Edit
          </button>
        ) : (
          <button
            type="button"
            onClick={cancelEdit}
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-8">
          <div>
            <h3 className="font-medium text-gray-700 mb-3">
              Laboratory Categories
            </h3>

            {renderSavedLabCategories()}
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-3">
              Instrument Categories
            </h3>

            {renderSavedInstrumentCategories()}
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-3">Instruments</h3>

            {renderSavedInstruments()}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 overflow-x-auto">
            <ol className="flex items-center min-w-[560px]">
              {steps.map((s, i) => {
                const completed = i < step;
                const active = i === step;

                return (
                  <li
                    key={i}
                    className="flex items-center flex-1 last:flex-none"
                  >
                    <div className="flex flex-col items-center">
                      <span
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                          completed || active
                            ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {completed ? (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </span>

                      <span
                        className={`mt-2 text-xs font-medium whitespace-nowrap ${
                          active ? "text-orange-600" : "text-gray-500"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>

                    {i < steps.length - 1 && (
                      <div
                        className={`flex-1 h-[2px] mx-2 mb-5 ${
                          completed ? "bg-orange-500" : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">{stepContent()}</div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-10 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!stepValid()}
                className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-2.5 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-600"
              >
                Next
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={updateTechnicalExpertise}
                disabled={loading || !stepValid()}
                className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Technical Expertise"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}