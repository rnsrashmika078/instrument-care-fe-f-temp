import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { API_BASE } from "../../config";
import { toast } from "react-toastify";

const WorkExperience = forwardRef(function WorkExperience(
  { userId: userIdProp, sectionId = "profile-work", readOnly = false },
  ref,
) {
    const userId = userIdProp || sessionStorage.getItem("user_id");
    const [tech_id, setTechId] = useState(null);

    const [oldExperience, setOldExperience] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        organization_name: "",
        position_title: "",
        start_date: "",
        end_date: "",
    });

    const [sectionErrors, setSectionErrors] = useState([]);
    const [modalErrors, setModalErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalForm, setModalForm] = useState({
        organization_name: "",
        position_title: "",
        start_date: "",
        end_date: "",
    });

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        fetchTechnicianID();
    }, []);

    const fetchTechnicianID = async () => {
        const res = await fetch(`${API_BASE}/tech/profile/${userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await res.json();
        setTechId(data.id || null);
    };

    useEffect(() => {
        if (tech_id) {
            fetchTechnicianWorkExperience();
        }
    }, [tech_id]);

    const fetchTechnicianWorkExperience = async () => {
        try {
            const res = await fetch(`${API_BASE}/tech/work-experience/${tech_id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            setOldExperience(data.data || []);
        } catch (err) {
            console.error(" Error fetching work experience:", err);
        }
    };

    const addRow = () => {
        setModalForm({
            organization_name: "",
            position_title: "",
            start_date: "",
            end_date: "",
        });
        setModalErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalErrors({});
    };

    const handleModalChange = (e) => {
        setModalForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setModalErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    };

    // Every add / edit / remove is sent straight away so the list on screen
    // always reflects what is stored, without waiting for "Submit Profile".
    const persist = async (payload) => {
        if (!tech_id || !token) {
            toast.warn("Technician profile is not loaded yet.");
            return false;
        }

        setSaving(true);

        try {
            const res = await fetch(
                `${API_BASE}/tech/profile/work/${tech_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        work_experience: [],
                        update_work_experience: [],
                        remove_work_experience: [],
                        ...payload,
                    }),
                },
            );

            const result = await res.json();

            if (res.ok) {
                await fetchTechnicianWorkExperience();
                return true;
            }

            console.error(" API Error:", result);
            toast.error("Failed to update Past Employment");
            return false;
        } catch (err) {
            console.error(" Error updating Past Employment:", err);
            toast.error("Error updating Past Employment");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleModalAdd = async () => {
        const org = modalForm.organization_name.trim();
        const pos = modalForm.position_title.trim();

        const errors = {};
        if (!org) {
            errors.organization_name = "Organization is required.";
        }
        if (!pos) {
            errors.position_title = "Position is required.";
        }
        if (!modalForm.start_date) {
            errors.start_date = "Start date is required.";
        }

        if (Object.keys(errors).length > 0) {
            setModalErrors(errors);
            return;
        }

        const ok = await persist({
            work_experience: [
                {
                    organization_name: org,
                    position_title: pos,
                    start_date: modalForm.start_date,
                    end_date: modalForm.end_date,
                },
            ],
        });

        if (ok) {
            setShowModal(false);
            setModalErrors({});
            toast.success("Employment added");
        }
    };

    const startEdit = (exp) => {
        setEditingId(exp.id);
        setEditForm({
            organization_name: exp.organization_name || "",
            position_title: exp.position_title || "",
            start_date: exp.start_date || "",
            end_date: exp.end_date || "",
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({
            organization_name: "",
            position_title: "",
            start_date: "",
            end_date: "",
        });
    };

    const handleEditFormChange = (e) => {
        setEditForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const saveEdit = async () => {
        const org = editForm.organization_name.trim();
        const pos = editForm.position_title.trim();

        if (!org || !pos || !editForm.start_date) {
            toast.error("Please fill Organization, Position and Start Date (leave End Date blank if this is your current job)");
            return;
        }

        const ok = await persist({
            update_work_experience: [
                {
                    id: editingId,
                    organization_name: org,
                    position_title: pos,
                    start_date: editForm.start_date,
                    end_date: editForm.end_date,
                },
            ],
        });

        if (ok) {
            cancelEdit();
            toast.success("Employment updated");
        }
    };

    const removeEntry = async (id) => {
        if (!window.confirm("Remove this employment entry?")) return;

        if (editingId === id) cancelEdit();

        const ok = await persist({ remove_work_experience: [id] });

        if (ok) {
            toast.success("Employment removed");
        }
    };

    const validate = () => {
        const msgs = [];

        if (editingId !== null) {
            msgs.push("Save or cancel the current edit before submitting.");
        }

        if ((oldExperience || []).length === 0) {
            msgs.push("Add at least one past employment entry.");
        }

        setSectionErrors(msgs);
        return msgs;
    };

    const completion = () => {
        const saved = (oldExperience || []).length;

        return { done: saved > 0 ? 1 : 0, total: 1 };
    };

    // Add / edit / remove already save themselves, so the profile-level submit
    // only has to run validation for this section.
    const handleUpdate = async () => {
        if (saving) return false;
        return true;
    };

    useImperativeHandle(ref, () => ({
        validate,
        submit: handleUpdate,
        completion,
    }));

    const inputCls = "input";

    return (
        <div id={sectionId} className="bg-white shadow-md rounded-2xl p-6 space-y-4 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Past Employment</h3>
                {sectionErrors.length > 0 && (
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600 border border-red-200">
                        Needs attention
                    </span>
                )}
            </div>

            {sectionErrors.length > 0 && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm">
                    <ul className="list-disc list-inside space-y-1">
                        {sectionErrors.map((e, i) => (
                            <li key={i}>{e}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="space-y-3">
            {oldExperience.map((exp) => {
                if (editingId === exp.id) {
                    return (
                        <div key={exp.id} className="border border-gray-200 rounded-lg p-4 bg-white space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    name="organization_name"
                                    value={editForm.organization_name}
                                    onChange={handleEditFormChange}
                                    placeholder="Organization"
                                    className={inputCls}
                                />

                                <input
                                    name="position_title"
                                    value={editForm.position_title}
                                    onChange={handleEditFormChange}
                                    placeholder="Position/Role"
                                    className={inputCls}
                                />

                                <div>
                                    <label className="field-label">Start Date</label>
                                    <input
                                        name="start_date"
                                        value={editForm.start_date}
                                        onChange={handleEditFormChange}
                                        type="date"
                                        className={inputCls}
                                    />
                                </div>

                                <div>
                                    <label className="field-label">End Date</label>
                                    <input
                                        name="end_date"
                                        value={editForm.end_date}
                                        onChange={handleEditFormChange}
                                        type="date"
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:col-span-2">
<button
              type="button"
              onClick={handleModalAdd}
              disabled={saving}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              {saving ? "Adding..." : "Add"}
            </button>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    );
                }

                return (
                    <div
                        key={exp.id}
                        className="border border-gray-200 rounded-lg p-3 bg-white transition hover:bg-gray-50"
                    >
                        <p className="font-medium text-gray-800">
                            {exp.organization_name}
                        </p>

                        <p className="text-sm text-gray-600">{exp.position_title}</p>

                        <p className="text-xs text-gray-500">
                            {exp.years_of_experience} years experience ({exp.start_date} to {exp.end_date || "Present"})
                        </p>

                        {!readOnly && (
                        <div className="mt-2 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => startEdit(exp)}
                                className="inline-flex items-center gap-1.5 border border-gray-200 text-orange-600 hover:bg-orange-50 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => removeEntry(exp.id)}
                                className="inline-flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                            </button>
                        </div>
                        )}
                    </div>
                );
            })}
            </div>

            {oldExperience.length === 0 && (
                <p className="text-sm text-gray-400">
                    No work experience added yet.
                </p>
            )}

            {!readOnly && (
<button
              type="button"
              onClick={addRow}
              disabled={saving}
              className="text-orange-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + {saving ? "Adding..." : "Add Employment"}
            </button>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

                    <div className="bg-white border border-gray-200 w-11/12 max-w-2xl p-6 z-10 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                                Add Employment
                            </h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-800 font-bold text-3xl leading-none transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <input
                                    name="organization_name"
                                    value={modalForm.organization_name}
                                    onChange={handleModalChange}
                                    placeholder="Organization"
                                    className={inputCls}
                                />
                                {modalErrors.organization_name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {modalErrors.organization_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <input
                                    name="position_title"
                                    value={modalForm.position_title}
                                    onChange={handleModalChange}
                                    placeholder="Position/Role"
                                    className={inputCls}
                                />
                                {modalErrors.position_title && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {modalErrors.position_title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="field-label">Start Date</label>
                                <input
                                    name="start_date"
                                    value={modalForm.start_date}
                                    onChange={handleModalChange}
                                    type="date"
                                    className={inputCls}
                                />
                                {modalErrors.start_date && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {modalErrors.start_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="field-label">End Date</label>
                                <input
                                    name="end_date"
                                    value={modalForm.end_date}
                                    onChange={handleModalChange}
                                    type="date"
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
<button
              type="button"
              onClick={handleModalAdd}
              disabled={saving}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              {saving ? "Adding..." : "Add"}
            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

});

export default WorkExperience;