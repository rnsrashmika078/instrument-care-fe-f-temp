import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { API_BASE } from "../../config";

const steps = [
  { label: "Instruments" },
  { label: "Instrument Categories" },
  { label: "Laboratory Categories" },
  { label: "Instrument Care Categories" },
];

// Sentinel for instruments the technician typed in by hand. Those rows carry
// new_instrument_id and a NULL instrument_id, so they must be kept out of the
// `instruments` id list and re-sent through `new_instruments` instead.
const MANUAL_INSTRUMENT = "__manual__";

const TechnicalExpertise = forwardRef(function TechnicalExpertise(
  {
    userId: userIdProp,
    sectionId = "profile-expertise",
    readOnly = false,
  },
  ref,
) {
  const userId = userIdProp || sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("token");

  const [tech_id, setTechId] = useState(null);

const [labCategories, setLabCategories] = useState([]);
  const [instrumentCategories, setInstrumentCategories] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [newInstruments, setNewInstruments] = useState([]);
  const [instrumentCareCategories, setInstrumentCareCategories] = useState([]);

const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [attention, setAttention] = useState(false);

  const [showDropdowns, setShowDropdowns] = useState([]);
  const [options, setOptions] = useState([]);

const [showDropdownInstCat, setShowDropdownInstCat] = useState([]);
  const [instrCatOptions, setInstrCatOptions] = useState([]);

  const [showDropdownInstruments, setShowDropdownInstruments] = useState([]);
  const [instrumentOptions, setInstrumentOptions] = useState([]);

  const [showDropdownInstCareCat, setShowDropdownInstCareCat] = useState([]);
  const [instCareCatOptions, setInstCareCatOptions] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedInstrumentCategories, setSelectedInstrumentCategories] =
    useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedNewInstruments, setSelectedNewInstruments] = useState([]);
  const [selectedInstrumentCareCategories, setSelectedInstrumentCareCategories] =
    useState([]);

  const [manualInstrumentName, setManualInstrumentName] = useState("");

  const [customLabCatValues, setCustomLabCatValues] = useState({});
  const [customInstrCatValues, setCustomInstrCatValues] = useState({});
  const [customInstrumentValues, setCustomInstrumentValues] = useState({});
  const [customInstCareCatValues, setCustomInstCareCatValues] = useState({});

useEffect(() => {
    fetchTechnicianID();
  }, []);

useEffect(() => {
    if (tech_id) {
      refreshExpertise();
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

const refreshExpertise = async () => {
    try {
      const res = await fetch(`${API_BASE}/tech/profile/expertise/${tech_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setLabCategories(data.laboratoryCategories || []);
      setInstrumentCategories(data.instrumentsCategories || []);
      setInstruments(data.instruments || []);
      setNewInstruments(data.newInstruments || []);
      setInstrumentCareCategories(data.instrumentCareCategories || []);
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

      const seen = new Set();
      const uniqueOptions = formattedOptions.filter((opt) => {
        if (seen.has(opt.value)) return false;
        seen.add(opt.value);
        return true;
      });

      setOptions(ensureOther(uniqueOptions));
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

      const seen = new Set();
      const uniqueOptions = formattedOptions.filter((opt) => {
        if (seen.has(opt.value)) return false;
        seen.add(opt.value);
        return true;
      });

setInstrCatOptions(ensureOther(uniqueOptions));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInstrumentCareCategoryData = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/tech/instrument-care-categories`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();

      const formattedOptions = (data.data || []).map((item) => ({
        value: item.id,
        label: item.name,
      }));

      const seen = new Set();
      const uniqueOptions = formattedOptions.filter((opt) => {
        if (seen.has(opt.value)) return false;
        seen.add(opt.value);
        return true;
      });

      setInstCareCatOptions(ensureOther(uniqueOptions));
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

      const seen = new Set();
      const uniqueOptions = formattedOptions.filter((opt) => {
        if (seen.has(opt.value)) return false;
        seen.add(opt.value);
        return true;
      });

      setInstrumentOptions(ensureOther(uniqueOptions));
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
    setEditingRowIndex(null);
    setEditingGroupId(null);

    setShowDropdowns([]);
    setShowDropdownInstCat([]);
    setShowDropdownInstruments([]);
    setShowDropdownInstCareCat([]);

    setSelectedCategories([]);
    setSelectedInstrumentCategories([]);
    setSelectedInstruments([]);
    setSelectedNewInstruments([]);
    setSelectedInstrumentCareCategories([]);

    setCustomLabCatValues({});
    setCustomInstrCatValues({});
    setCustomInstrumentValues({});
    setCustomInstCareCatValues({});

    setManualInstrumentName("");
  };

  const labRowToOption = (row) => {
    if (!row) return null;
    if (row.custom_category) return { value: "other", label: "Other" };
    return { value: row.id, label: row.name };
  };

  const instCatRowToOption = (row) => {
    if (!row) return null;
    if (row.custom_category) return { value: "other", label: "Other" };
    return { value: row.id, label: row.name };
  };

  const instrumentRowToOption = (row) => {
      if (!row) return null;
      if (row.custom_category) return { value: "other", label: "Other" };
      // Hand-typed instruments live in new_instrument_id with a NULL
      // instrument_id. Returning the NULL id here made the option render in the
      // dropdown but vanish on save, because the payload filters falsy ids out.
      if (row.instrument_id == null && row.new_instrument_id != null) {
        return {
          value: MANUAL_INSTRUMENT,
          label: row.instrument_name,
          isManual: true,
        };
      }
      return { value: row.instrument_id, label: row.instrument_name };
    };

  const instCareCatRowToOption = (row) => {
    if (!row) return null;
    if (row.custom_category) return { value: "other", label: "Other" };
    return { value: row.id, label: row.name };
  };

  const groupedRows = (() => {
    const map = new Map();
    const push = (items, field) => {
      (items || []).forEach((item) => {
        let key;
        if (item.group_id != null) {
          key = `g-${item.group_id}`;
        } else if (item.created_at) {
          key = `legacy-${item.created_at}`;
        } else {
          key = `raw-${field}-${item.row_id}`;
        }
        if (!map.has(key)) {
          map.set(key, {
            key,
            group_id: item.group_id,
            sort: item.created_at
              ? Date.parse(item.created_at) || item.row_id || 0
              : item.row_id || 0,
            labs: [],
            instCats: [],
            instruments: [],
            careCats: [],
          });
        }
        map.get(key)[field].push(item);
      });
    };

    push(labCategories, "labs");
    push(instrumentCategories, "instCats");
    push(instruments, "instruments");
    push(instrumentCareCategories, "careCats");

    return [...map.values()].sort((a, b) => {
      if (a.group_id == null && b.group_id == null) return a.sort - b.sort;
      if (a.group_id == null) return 1;
      if (b.group_id == null) return -1;
      return a.group_id - b.group_id;
    });
  })();

const startEditRow = async (i) => {
    await Promise.all([
      fetchData(),
      fetchInstrumentCategoryData(),
      fetchInstrumentData(),
      fetchInstrumentCareCategoryData(),
    ]);

    const group = groupedRows[i];
    if (!group) return;

    const labOpts = (group.labs || []).map(labRowToOption);
    const instCatOpts = (group.instCats || []).map(instCatRowToOption);
    const instOpts = (group.instruments || []).map(instrumentRowToOption);
    const careOpts = (group.careCats || []).map(instCareCatRowToOption);

    setSelectedCategories(labOpts.filter(Boolean));
    setSelectedInstrumentCategories(instCatOpts.filter(Boolean));
    setSelectedInstruments(instOpts.filter(Boolean));
    setSelectedInstrumentCareCategories(careOpts.filter(Boolean));

    setShowDropdowns(labOpts.map(Boolean));
    setShowDropdownInstCat(instCatOpts.map(Boolean));
    setShowDropdownInstruments(instOpts.map(Boolean));
    setShowDropdownInstCareCat(careOpts.map(Boolean));

    setCustomLabCatValues(
      (group.labs || []).reduce((acc, row, idx) => {
        if (row.custom_category) acc[idx] = row.custom_category;
        return acc;
      }, {}),
    );
    setCustomInstrCatValues(
      (group.instCats || []).reduce((acc, row, idx) => {
        if (row.custom_category) acc[idx] = row.custom_category;
        return acc;
      }, {}),
    );
    setCustomInstrumentValues(
      (group.instruments || []).reduce((acc, row, idx) => {
        if (row.custom_category) acc[idx] = row.custom_category;
        return acc;
      }, {}),
    );
    setCustomInstCareCatValues(
      (group.careCats || []).reduce((acc, row, idx) => {
        if (row.custom_category) acc[idx] = row.custom_category;
        return acc;
      }, {}),
    );

    setSelectedNewInstruments([]);
    setManualInstrumentName("");

    setStep(0);
    setEditingRowIndex(i);
    setEditingGroupId(group.group_id ?? null);
    setIsEditing(true);
  };

const cancelEdit = () => {
    setIsEditing(false);
    setStep(0);
    setEditingRowIndex(null);
    setEditingGroupId(null);

    setShowDropdowns([]);
    setShowDropdownInstCat([]);
    setShowDropdownInstruments([]);
    setShowDropdownInstCareCat([]);

    setSelectedCategories([]);
    setSelectedInstrumentCategories([]);
    setSelectedInstruments([]);
    setSelectedNewInstruments([]);
    setSelectedInstrumentCareCategories([]);

    setCustomLabCatValues({});
    setCustomInstrCatValues({});
    setCustomInstrumentValues({});
    setCustomInstCareCatValues({});

    setManualInstrumentName("");
  };

const deleteRow = async (i) => {
    const group = groupedRows[i];
    if (!group) return;

    const removeLab =
      group.group_id == null
        ? (group.labs || []).map((r) => r.row_id).filter(Boolean)
        : [];
    const removeInstCat =
      group.group_id == null
        ? (group.instCats || []).map((r) => r.row_id).filter(Boolean)
        : [];
    const removeInst =
      group.group_id == null
        ? (group.instruments || []).map((r) => r.row_id).filter(Boolean)
        : [];
    const removeInstCareCat =
      group.group_id == null
        ? (group.careCats || []).map((r) => r.row_id).filter(Boolean)
        : [];
    const removeGroupIds = group.group_id != null ? [group.group_id] : [];

    if (
      !removeLab.length &&
      !removeInstCat.length &&
      !removeInst.length &&
      !removeInstCareCat.length &&
      !removeGroupIds.length
    ) {
      return;
    }

    if (!window.confirm("Remove this Areas of Technical Expertise entry?")) {
      return;
    }

try {
      setLoading(true);

      const payload = {
        tech_id,
        laboratory_categories: [],
        instrument_categories: [],
        instruments: [],
        instrument_care_categories: [],
        lab_cat_custom_value: [],
        inst_cat_custom_value: [],
        inst_custom_value: [],
        inst_care_cat_custom_value: [],
        remove_laboratory_categories: removeLab,
        remove_instrument_categories: removeInstCat,
        remove_instruments: removeInst,
        remove_instrument_care_categories: removeInstCareCat,
        remove_group_ids: removeGroupIds,
      };

      const removeByIds = (rows, ids) =>
        group.group_id != null
          ? rows.filter((r) => !removeGroupIds.includes(r.group_id))
          : rows.filter((r) => !ids.includes(r.row_id));

      setLabCategories((prev) => removeByIds(prev, removeLab));
      setInstrumentCategories((prev) => removeByIds(prev, removeInstCat));
      setInstruments((prev) => removeByIds(prev, removeInst));
      setInstrumentCareCategories((prev) => removeByIds(prev, removeInstCareCat));

      const res = await fetch(`${API_BASE}/tech/profile/expertise/${tech_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await refreshExpertise();
        toast.success("Areas of Technical Expertise entry removed");
      } else {
        const result = await res.json();
        console.error("Delete error", result);
        await refreshExpertise();
        toast.error("Failed to remove expertise");
      }
    } catch (err) {
      console.error(err);
      await refreshExpertise();
      toast.error("Error removing expertise");
    } finally {
      setLoading(false);
    }
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

  const addDropdownInstCareCat = async () => {
    await fetchInstrumentCareCategoryData();

    setShowDropdownInstCareCat((prev) => [...prev, true]);
    setSelectedInstrumentCareCategories((prev) => [...prev, null]);
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

  const handleInstrumentCareCategoryChange = (selected, index) => {
    const updated = [...selectedInstrumentCareCategories];

    updated[index] = selected;

    setSelectedInstrumentCareCategories(updated);

    if (!selected || !isOtherOption(selected)) {
      setCustomInstCareCatValues((prev) => ({
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

  const removeDropdownInstCareCat = (index) => {
    setShowDropdownInstCareCat((prev) => prev.filter((_, i) => i !== index));

    setSelectedInstrumentCareCategories((prev) =>
      prev.filter((_, i) => i !== index),
    );

    setCustomInstCareCatValues((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const updateTechnicalExpertise = async () => {
    try {
      setLoading(true);

const mergingGroup =
        editingRowIndex != null ? groupedRows[editingRowIndex] : null;
      const removeGroupIds = editingGroupId != null ? [editingGroupId] : [];

      const legacyLabs =
        mergingGroup && editingGroupId == null ? mergingGroup.labs || [] : [];
      const legacyInstCats =
        mergingGroup && editingGroupId == null ? mergingGroup.instCats || [] : [];
      const legacyInsts =
        mergingGroup && editingGroupId == null ? mergingGroup.instruments || [] : [];
      const legacyCares =
        mergingGroup && editingGroupId == null ? mergingGroup.careCats || [] : [];

      const removeLab = legacyLabs.map((r) => r.row_id).filter(Boolean);
      const removeInstCat = legacyInstCats.map((r) => r.row_id).filter(Boolean);
      const removeInst = legacyInsts.map((r) => r.row_id).filter(Boolean);
      const removeInstCareCat = legacyCares.map((r) => r.row_id).filter(Boolean);

      const payload = {
        tech_id,

        laboratory_categories: selectedCategories
          .map((c) => (c?.value === "other" ? null : c?.value))
          .filter((v) => v),

        instrument_categories: selectedInstrumentCategories
          .map((c) => (c?.value === "other" ? null : c?.value))
          .filter((v) => v),

        instruments: selectedInstruments
          .map((c) =>
            c?.value === "other" || c?.value === MANUAL_INSTRUMENT
              ? null
              : c?.value,
          )
          .filter((v) => v),

        // Manually typed / unlisted instruments. Two sources feed this: names
        // just added in the form, plus ones that were already on the row being
        // edited (they arrive as MANUAL_INSTRUMENT options). The backend reads
        // this exact key and links each one to the group, so anything missing
        // here is silently dropped on save.
        new_instruments: [
          ...selectedNewInstruments.map((n) => (n || "").trim()),
          ...selectedInstruments
            .filter((c) => c?.value === MANUAL_INSTRUMENT)
            .map((c) => (c?.label || "").trim()),
        ].filter((v) => v),

        instrument_care_categories: selectedInstrumentCareCategories
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

        inst_care_cat_custom_value: selectedInstrumentCareCategories
          .map((c, i) =>
            isOtherOption(c)
              ? (customInstCareCatValues[i] || "").trim()
              : null,
          )
          .filter((v) => v),

        remove_laboratory_categories: removeLab,
        remove_instrument_categories: removeInstCat,
        remove_instruments: removeInst,
        remove_instrument_care_categories: removeInstCareCat,
        remove_group_ids: removeGroupIds,
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
        await refreshExpertise();

        setIsEditing(false);
        setStep(0);
        setEditingRowIndex(null);
        setEditingGroupId(null);

        setShowDropdowns([]);
        setShowDropdownInstCat([]);
        setShowDropdownInstruments([]);
        setShowDropdownInstCareCat([]);

        setSelectedCategories([]);
        setSelectedInstrumentCategories([]);
        setSelectedInstruments([]);
        setSelectedNewInstruments([]);
        setSelectedInstrumentCareCategories([]);

        setCustomLabCatValues({});
        setCustomInstrCatValues({});
        setCustomInstrumentValues({});
        setCustomInstCareCatValues({});

        setManualInstrumentName("");

        toast.success("Areas of Technical Expertise updated successfully");
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
      case 0: {
        // Instruments
        const hasInstrument = selectedInstruments.some((inst) => {
          if (!inst) return false;
          if (isOtherOption(inst)) {
            const index = selectedInstruments.indexOf(inst);
            return (customInstrumentValues[index] || "").trim() !== "";
          }
          return true;
        });
        // A row made up only of manual/unlisted instruments is valid as well,
        // otherwise the form forces one dropdown pick and hides the fact that
        // the manually added ones were being dropped on save.
        const hasManualInstrument = selectedInstruments.some(
          (inst) => inst?.value === MANUAL_INSTRUMENT,
        );
        const hasNewManualInstrument = selectedNewInstruments.some(
          (name) => (name || "").trim() !== "",
        );
        return hasInstrument || hasManualInstrument || hasNewManualInstrument;
      }

      case 1: {
        // Instrument Categories
        const hasInstCategory = selectedInstrumentCategories.some((cat) => {
          if (!cat) return false;
          if (isOtherOption(cat)) {
            const index = selectedInstrumentCategories.indexOf(cat);
            return (customInstrCatValues[index] || "").trim() !== "";
          }
          return true;
        });
        return hasInstCategory;
      }

      case 2: {
        // Laboratory Categories
        const hasLabCategory = selectedCategories.some((cat) => {
          if (!cat) return false;
          if (isOtherOption(cat)) {
            const index = selectedCategories.indexOf(cat);
            return (customLabCatValues[index] || "").trim() !== "";
          }
          return true;
        });
        return hasLabCategory;
      }

      case 3: {
        // Instrument Care Categories
        const hasInstrumentCareCategory = selectedInstrumentCareCategories.some(
          (cat) => {
            if (!cat) return false;
            if (isOtherOption(cat)) {
              const index = selectedInstrumentCareCategories.indexOf(cat);
              return (customInstCareCatValues[index] || "").trim() !== "";
            }
            return true;
},
        );
        return hasInstrumentCareCategory;
      }

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

  const validate = () => {
    const msgs = [];

    if (isEditing) {
      msgs.push("Save or cancel the current change before submitting.");
    }

    if (groupedRows.length === 0) {
      msgs.push("Add at least one Areas of Technical Expertise entry.");
    }

    setAttention(msgs.length > 0);
    return msgs;
  };

  const completion = () => {
    const hasEntry = groupedRows.length > 0 && !isEditing;
    return { done: hasEntry ? 1 : 0, total: 1 };
  };

  useImperativeHandle(ref, () => ({
    validate,
    completion,
  }));

  const renderSavedLabCategories = () => (
    <div className="flex flex-wrap gap-2">
      {labCategories.length > 0 ? (
        labCategories.map((lab, i) => (
          <span
            key={i}
            className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-gray-200"
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
            className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-gray-200"
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
            className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-gray-200"
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

      {!isEditing && renderSavedLabCategories()}

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
              className="input mt-2"
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

      {!isEditing && renderSavedInstrumentCategories()}

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
              className="input mt-2"
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

      {!isEditing && renderSavedInstruments()}

      {/* Instruments are one-per-row, so once one is picked there is nothing
          left to add. Hidden rather than disabled so it stops competing with
          the chosen value. Kept above the select because this list has ~1600
          options and react-select's open menu overlays whatever sits below it. */}
      {!selectedInstruments.some(Boolean) && (
        <button
          type="button"
          onClick={addDropdownInstrument}
          className="text-orange-600 hover:text-orange-700 font-medium text-sm mb-1 flex items-center gap-1 transition-colors"
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
      )}

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
              className="input mt-2"
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
    </div>
  );

  const renderInstrumentCareCategories = () => (
    <div>
      <h3 className="font-medium text-gray-700 mb-3">
        Instrument Care Categories
      </h3>

      {!isEditing && renderSavedInstrumentCareCategories()}

      {showDropdownInstCareCat.map((show, i) => (
        <div key={i} className="mt-3 w-full max-w-xs sm:max-w-sm">
          <Select
            options={instCareCatOptions}
            value={selectedInstrumentCareCategories[i] || null}
            onChange={(selected) =>
              handleInstrumentCareCategoryChange(selected, i)
            }
            isSearchable
            placeholder="Select Instrument Care Category"
          />

          {isOtherOption(selectedInstrumentCareCategories[i]) && (
            <input
              value={customInstCareCatValues[i] || ""}
              onChange={(e) =>
                setCustomInstCareCatValues((prev) => ({
                  ...prev,
                  [i]: e.target.value,
                }))
              }
              className="input mt-2"
              placeholder="Enter Custom Instrument Care Category"
            />
          )}

          <button
            type="button"
            onClick={() => removeDropdownInstCareCat(i)}
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
        onClick={addDropdownInstCareCat}
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
        Add Instrument Care Category
      </button>
    </div>
  );

  const renderSavedInstrumentCareCategories = () => (
    <div className="flex flex-wrap gap-2">
      {instrumentCareCategories.length > 0 ? (
        instrumentCareCategories.map((instCareCat, i) => (
          <span
            key={i}
            className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-gray-200"
          >
            {instCareCat.name || instCareCat.custom_category}
          </span>
        ))
      ) : (
        <span className="text-sm text-gray-400">
          No instrument care categories selected.
        </span>
      )}
    </div>
  );

  const _renderNewInstruments = () => (
    <div>
      <h3 className="font-medium text-gray-700 mb-3">
        Manual / Unlisted Instruments
      </h3>

      <div className="flex flex-wrap gap-2">
        {newInstruments.map((instrument, i) => (
          <span
            key={i}
            className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-gray-200"
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
          className="px-4 py-2 border border-gray-300 rounded-lg flex-1 focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 outline-none transition-all"
        />

        <button
          type="button"
          onClick={addManualInstrument}
          className="bg-white border border-gray-500 text-orange-600 px-5 py-2 rounded-lg hover:bg-orange-50 font-medium transition-colors"
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
            {/* {_renderNewInstruments()} */}
          </div>
        );

      case 1:
        return renderInstrumentCategories();

      case 2:
        return renderLabCategories();

      case 3:
        return renderInstrumentCareCategories();

      default:
        return null;
    }
  };

  return (
    <div id={sectionId} className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins border-2 border-gray-200">
<div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          Areas of Technical Expertise
        </h2>
        {attention && (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600 border border-red-200">
            Needs attention
          </span>
        )}
      </div>

{groupedRows.length === 0 ? (
        <p className="py-8 text-center text-gray-400 text-sm">
          No Areas of Technical Expertise added yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr className="border-b">
                <th className="p-3">Instrument</th>
                <th className="p-3">Instrument Category</th>
                <th className="p-3">Laboratory Category</th>
                <th className="p-3">Instrument Care Category</th>
                {!readOnly && <th className="p-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {groupedRows.map((group, i) => (
                <tr
                  key={group.key}
                  className="border-b hover:bg-orange-50 transition-colors"
                >
                  <td className="p-3">
                    {group.instruments.length > 0 ? (
                      <div className="flex flex-col items-start gap-1.5">
                        {group.instruments.map((it, j) => (
                          <span
                            key={j}
                            className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold whitespace-nowrap"
                          >
                            {it.instrument_name || it.custom_category}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    {group.instCats.length > 0 ? (
                      <div className="flex flex-col items-start gap-1.5">
                        {group.instCats.map((it, j) => (
                          <span
                            key={j}
                            className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold whitespace-nowrap"
                          >
                            {it.name || it.custom_category}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    {group.labs.length > 0 ? (
                      <div className="flex flex-col items-start gap-1.5">
                        {group.labs.map((it, j) => (
                          <span
                            key={j}
                            className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold whitespace-nowrap"
                          >
                            {it.name || it.custom_category}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    {group.careCats.length > 0 ? (
                      <div className="flex flex-col items-start gap-1.5">
                        {group.careCats.map((it, j) => (
                          <span
                            key={j}
                            className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold whitespace-nowrap"
                          >
                            {it.name || it.custom_category}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
{!readOnly && (
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditRow(i)}
                        className="inline-flex items-center gap-1.5 border border-gray-200 text-orange-600 hover:bg-orange-50 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                      >
                        <svg
                          className="w-3.5 h-3.5"
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

                      <button
                        type="button"
                        onClick={() => deleteRow(i)}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
Delete
                      </button>
                    </div>
                  </td>
                )}
</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{!readOnly && (
        <button
          type="button"
          onClick={startEdit}
          className="text-orange-500 text-sm"
        >
          + Add Areas of Technical Expertise
        </button>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

          <div className="bg-white border border-gray-200 w-[95%] max-w-4xl p-6 z-10 rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                {editingRowIndex != null
                  ? "Edit Areas of Technical Expertise"
                  : "Add Areas of Technical Expertise"}
              </h2>
              <button
                type="button"
                onClick={cancelEdit}
                className="text-gray-500 hover:text-gray-800 font-bold text-3xl leading-none transition-colors"
              >
                &times;
              </button>
            </div>

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
                  {loading ? "Updating..." : "Update Areas of Technical Expertise"}
                </button>
              )}
            </div>
</div>
        </div>
      )}
    </div>
  );
});

export default TechnicalExpertise;
