import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { API_BASE } from "../../config";
import { toast } from "react-toastify";
import { formatPhone } from "../utils/phone";
import { fileNameFromPath } from "../utils/format";
import SelectedFileChip from "./SelectedFileChip";

const SERVICE_TYPES = [
    "Instrument Installation",
    "Preventive Maintenance",
    "Corrective Maintenance",
    "Repair and Servicing",
    "Calibration",
    "Performance Verification",
    "Troubleshooting",
    "User Training",
    "Other",
];

const STANDARD_SERVICE_TYPES = SERVICE_TYPES.slice(0, -1);
const OTHER_SERVICE_TYPE = SERVICE_TYPES[SERVICE_TYPES.length - 1];

const isCustomServiceType = (value) =>
    !!value && !STANDARD_SERVICE_TYPES.includes(value);

const emptyEntry = () => ({
    service_type: "",
    client_name: "",
    client_email: "",
    client_contact: "",
    service_completion_month_year: "",
    proof_document_title: "",
    proof_document: null,
});

const appendEntry = (formData, prefix, data) => {
    formData.append(`${prefix}[service_type]`, data.service_type || "");
    formData.append(`${prefix}[client_name]`, data.client_name || "");
    formData.append(`${prefix}[client_email]`, data.client_email || "");
    formData.append(`${prefix}[client_contact]`, data.client_contact || "");
    formData.append(
        `${prefix}[service_completion_month_year]`,
        data.service_completion_month_year || "",
    );
    formData.append(
        `${prefix}[proof_document_title]`,
        data.proof_document_title || "",
    );
    if (data.proof_document instanceof File) {
        formData.append(`${prefix}[proof_document]`, data.proof_document);
    }
};

const RelatedWorkExperience = forwardRef(function RelatedWorkExperience(
  { userId: userIdProp, sectionId = "profile-related" },
  ref,
) {
    const userId = userIdProp || sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");

    const [tech_id, setTechId] = useState(null);

    const [oldEntries, setOldEntries] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState(emptyEntry());
    const [editDoc, setEditDoc] = useState(null);

    const [sectionErrors, setSectionErrors] = useState([]);
    const [modalErrors, setModalErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalForm, setModalForm] = useState(emptyEntry());

    useEffect(() => {
        fetchTechnicianID();
    }, []);

    const fetchTechnicianID = async () => {
        const res = await fetch(`${API_BASE}/tech/profile/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        setTechId(data.id || null);
    };

    useEffect(() => {
        if (tech_id) {
            fetchRelatedWorkExperience();
        }
    }, [tech_id]);

    const fetchRelatedWorkExperience = async () => {
        try {
            const res = await fetch(
                `${API_BASE}/tech/related-work-experience/${tech_id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await res.json();
            setOldEntries(data.data || []);
        } catch (err) {
            console.error("Error fetching related work experience:", err);
        }
    };

    const addRow = () => {
        setModalForm(emptyEntry());
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

    const handleModalFileChange = (e) => {
        const file = e.target.files[0] || null;
        setModalForm((prev) => ({ ...prev, proof_document: file }));
        setModalErrors((prev) => ({ ...prev, proof_document: undefined }));
        e.target.value = "";
    };

    // Every add / edit / remove is sent straight away so the list on screen
    // always reflects what is stored, without waiting for "Submit Profile".
    const persist = async (buildFormData) => {
        if (!tech_id || !token) {
            toast.warn("Technician profile is not loaded yet.");
            return false;
        }

        setSaving(true);

        try {
            const formData = new FormData();
            buildFormData(formData);
            formData.append("tech_id", tech_id);

            const res = await fetch(
                `${API_BASE}/tech/profile/related-work/${tech_id}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const text = await res.text();
            let result = {};

            try {
                result = text ? JSON.parse(text) : {};
            } catch {
                result = { message: text };
            }

            if (res.ok) {
                await fetchRelatedWorkExperience();
                return true;
            }

            console.error("API Error:", result);
            toast.error(
                result.message || result.error || "Failed to update related work experience",
            );
            return false;
        } catch (err) {
            console.error("Error updating related work experience:", err);
            toast.error("Error updating related work experience");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleModalAdd = async () => {
        const name = modalForm.client_name.trim();
        const email = modalForm.client_email.trim();
        const contact = modalForm.client_contact.trim();
        const badEmail = email && !/^\S+@\S+\.\S+$/.test(email);
        const badContact = contact && !/^0\d{9}$/.test(contact);

        const errors = {};
        if (!modalForm.service_type || modalForm.service_type === OTHER_SERVICE_TYPE) {
            errors.service_type = "Service type is required.";
        }
        if (!name) {
            errors.client_name = "Client name is required.";
        }
        if (!email) {
            errors.client_email = "Client email is required.";
        } else if (badEmail) {
            errors.client_email = "Enter a valid email address.";
        }
        if (!contact) {
            errors.client_contact = "Contact number is required.";
        } else if (badContact) {
            errors.client_contact = "Contact must be 10 digits starting with 0.";
        }
        if (!modalForm.service_completion_month_year) {
            errors.service_completion_month_year = "Service completion date is required.";
        }

        if (Object.keys(errors).length > 0) {
            setModalErrors(errors);
            return;
        }

        const ok = await persist((formData) => {
            appendEntry(formData, "related_work_experiences[0]", {
                service_type: modalForm.service_type,
                client_name: name,
                client_email: email,
                client_contact: contact,
                service_completion_month_year:
                    modalForm.service_completion_month_year,
                proof_document_title: modalForm.proof_document_title.trim(),
                proof_document: modalForm.proof_document,
            });
        });

        if (ok) {
            setShowModal(false);
            setModalErrors({});
            toast.success("Related work experience added");
        }
    };

    const startEdit = (entry) => {
        setEditingId(entry.id);
        setEditDoc(
            entry.proof_document
                ? {
                    name: fileNameFromPath(entry.proof_document),
                    path: entry.proof_document,
                    status: "uploaded",
                }
                : null,
        );
        setEditForm({
            service_type: entry.service_type || "",
            client_name: entry.client_name || "",
            client_email: entry.client_email || "",
            client_contact: entry.client_contact || "",
            service_completion_month_year:
                entry.service_completion_month_year || "",
            proof_document_title: entry.proof_document_title || "",
            proof_document: null,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditDoc(null);
        setEditForm(emptyEntry());
    };

    const handleEditFormChange = (e) => {
        setEditForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleEditFileChange = (e) => {
        const file = e.target.files[0] || null;
        e.target.value = "";

        if (!file) return;

        setEditForm((prev) => ({ ...prev, proof_document: file }));
        setEditDoc({ name: file.name, size: file.size, status: "pending" });
    };

    const saveEdit = async () => {
        if (
            !editForm.service_type ||
            editForm.service_type === OTHER_SERVICE_TYPE ||
            !editForm.client_name.trim()
        ) {
            toast.error("Please fill Service Type and Client Name");
            return;
        }

        const ok = await persist((formData) => {
            formData.append("update_related_work_experiences[0][id]", editingId);
            appendEntry(formData, "update_related_work_experiences[0]", {
                service_type: editForm.service_type,
                client_name: editForm.client_name.trim(),
                client_email: editForm.client_email.trim(),
                client_contact: editForm.client_contact.trim(),
                service_completion_month_year:
                    editForm.service_completion_month_year,
                proof_document_title: editForm.proof_document_title.trim(),
                proof_document: editForm.proof_document,
            });
        });

        if (ok) {
            cancelEdit();
            toast.success("Related work experience updated");
        }
    };

    const removeEntry = async (id) => {
        if (!window.confirm("Remove this related work experience entry?")) return;

        if (editingId === id) cancelEdit();

        const ok = await persist((formData) => {
            formData.append("remove_related_work_experiences[]", id);
        });

        if (ok) {
            toast.success("Related work experience removed");
        }
    };

    const validate = () => {
        const msgs = [];

        if (editingId !== null) {
            msgs.push("Save or cancel the current edit before submitting.");
        }

        setSectionErrors(msgs);
        return msgs;
    };

    const completion = () => {
        const saved = (oldEntries || []).length;

        // This section is optional ("if any"), so it only counts once an
        // entry exists.
        return { done: saved > 0 ? 1 : 0, total: saved > 0 ? 1 : 0 };
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

    const serviceTypeSelect = (value, onChange) => {
        const isCustom = isCustomServiceType(value);

        return (
            <div>
                <select
                    name="service_type"
                    value={isCustom ? OTHER_SERVICE_TYPE : value || ""}
                    onChange={onChange}
                    className={inputCls}
                >
                    <option value="">Select Service Type</option>
                    {STANDARD_SERVICE_TYPES.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                    <option value={OTHER_SERVICE_TYPE}>
                        Other (Specify)
                    </option>
                </select>

                {isCustom && (
                    <input
                        type="text"
                        name="service_type"
                        value={value === OTHER_SERVICE_TYPE ? "" : value}
                        onChange={onChange}
                        placeholder="Specify custom service type"
                        className="input mt-2"
                    />
                )}
            </div>
        );
    };

    const proofDocumentField = (
        current,
        onFileChange,
        onRemove,
    ) => (
        <div className="sm:col-span-2">
            <label className="field-label">Proof Document (if any)</label>
            {current && (
                <SelectedFileChip
                    name={current.name}
                    size={current.size}
                    path={current.path}
                    status={current.status}
                    onRemove={onRemove}
                />
            )}
            <label className="cursor-pointer inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-2 rounded-md text-sm hover:bg-orange-200">
                {current ? "Change File" : "Choose File"}
                <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={onFileChange}
                    className="hidden"
                />
            </label>
        </div>
    );

    return (
        <div id={sectionId} className="bg-white shadow-md rounded-2xl p-6 space-y-4 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                    Related Work Experience
                    <span className="text-sm font-normal text-gray-400">
                        {" "}
                        (if any)
                    </span>
                </h3>
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
                {oldEntries.map((entry) => {
                    if (editingId === entry.id) {
                        return (
                            <div
                                key={entry.id}
                                className="border border-gray-200 rounded-lg p-4 bg-white space-y-4"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="field-label">
                                            Service Type
                                        </label>
                                        {serviceTypeSelect(
                                            editForm.service_type,
                                            handleEditFormChange,
                                        )}
                                    </div>

                                    <div>
                                        <label className="field-label">
                                            Client Name
                                        </label>
                                        <input
                                            name="client_name"
                                            value={editForm.client_name}
                                            onChange={handleEditFormChange}
                                            placeholder="Client Name"
                                            className={inputCls}
                                        />
                                    </div>

                                    <div>
                                        <label className="field-label">
                                            Client Email
                                        </label>
                                        <input
                                            name="client_email"
                                            value={editForm.client_email}
                                            onChange={handleEditFormChange}
                                            type="email"
                                            placeholder="Client Email"
                                            className={inputCls}
                                        />
                                    </div>

                                    <div>
                                        <label className="field-label">
                                            Contact Number
                                        </label>
                                        <input
                                            name="client_contact"
                                            value={editForm.client_contact}
                                            onChange={handleEditFormChange}
                                            placeholder="Contact Number"
                                            className={inputCls + " phone-prefix"}
                                        />
                                    </div>

                                    <div>
                                        <label className="field-label">
                                            Service Completion Date (Year/Month)
                                        </label>
                                        <input
                                            name="service_completion_month_year"
                                            value={
                                                editForm.service_completion_month_year
                                            }
                                            onChange={handleEditFormChange}
                                            type="month"
                                            className={inputCls}
                                        />
                                    </div>

                                    <div>
                                        <label className="field-label">
                                            Proof Document Title
                                        </label>
                                        <input
                                            name="proof_document_title"
                                            value={editForm.proof_document_title}
                                            onChange={handleEditFormChange}
                                            placeholder="e.g. Service Completion Letter"
                                            className={inputCls}
                                        />
                                    </div>

                                    {proofDocumentField(
                                        editDoc,
                                        handleEditFileChange,
                                    )}
                                </div>

                                <div className="flex items-center gap-3 sm:col-span-2">
                                    <button
                                        type="button"
                                        onClick={saveEdit}
                                        disabled={saving}
                                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                                    >
                                        {saving ? "Saving..." : "Save"}
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
                            key={entry.id}
                            className="border border-gray-200 rounded-lg p-3 bg-white transition hover:bg-gray-50"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="font-medium text-gray-800">
                                    {entry.client_name || entry.service_type}
                                </p>

                                {entry.service_type && (
                                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold whitespace-nowrap">
                                        {entry.service_type}
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-gray-600">
                                {[entry.client_email, formatPhone(entry.client_contact)]
                                    .filter(Boolean)
                                    .join("  |  ") || "No contact details"}
                            </p>

                            <p className="text-xs text-gray-500">
                                Completed: {entry.service_completion_month_year || "—"}
                            </p>

                            {entry.proof_document && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-1">
                                        {entry.proof_document_title
                                            ? `Proof Document (if any): ${entry.proof_document_title}`
                                            : "Proof Document (if any)"}
                                    </p>
                                    <SelectedFileChip
                                        name={fileNameFromPath(entry.proof_document)}
                                        path={entry.proof_document}
                                        status="uploaded"
                                    />
                                </div>
                            )}

                            {!entry.proof_document && entry.proof_document_title && (
                                <p className="mt-2 text-xs text-gray-500">
                                    Proof Document (if any): {entry.proof_document_title}
                                </p>
                            )}

                            <div className="mt-2 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => startEdit(entry)}
                                    className="inline-flex items-center gap-1.5 border border-gray-200 text-orange-600 hover:bg-orange-50 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => removeEntry(entry.id)}
                                    className="inline-flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {oldEntries.length === 0 && (
                <p className="text-sm text-gray-400">
                    No related work experience added yet.
                </p>
            )}

            <button
                type="button"
                onClick={addRow}
                className="text-orange-500 text-sm"
            >
                + Add Related Work Experience
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

                    <div className="bg-white border border-gray-200 w-11/12 max-w-2xl p-6 z-10 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                                Add Related Work Experience
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
                                <label className="field-label">
                                    Service Type
                                </label>
                                    {serviceTypeSelect(
                                        modalForm.service_type,
                                        handleModalChange,
                                    )}
                                    {modalErrors.service_type && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {modalErrors.service_type}
                                        </p>
                                    )}
                                </div>

                            <div>
                                <label className="field-label">
                                    Client Name
                                </label>
                                    <input
                                        name="client_name"
                                        value={modalForm.client_name}
                                        onChange={handleModalChange}
                                        placeholder="Client Name"
                                        className={inputCls}
                                    />
                                    {modalErrors.client_name && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {modalErrors.client_name}
                                        </p>
                                    )}
                                </div>

                            <div>
                                <label className="field-label">
                                    Client Email
                                </label>
                                    <input
                                        name="client_email"
                                        value={modalForm.client_email}
                                        onChange={handleModalChange}
                                        type="email"
                                        placeholder="Client Email"
                                        className={inputCls}
                                    />
                                    {modalErrors.client_email && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {modalErrors.client_email}
                                        </p>
                                    )}
                                </div>

                            <div>
                                <label className="field-label">
                                    Contact Number
                                </label>
                                    <input
                                        name="client_contact"
                                        value={modalForm.client_contact}
                                        onChange={handleModalChange}
                                        placeholder="Contact Number"
                                        className={inputCls + " phone-prefix"}
                                    />
                                    {modalErrors.client_contact && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {modalErrors.client_contact}
                                        </p>
                                    )}
                                </div>

                            <div>
                                <label className="field-label">
                                    Service Completion Date (Year/Month)
                                </label>
                                    <input
                                        name="service_completion_month_year"
                                        value={
                                            modalForm.service_completion_month_year
                                        }
                                        onChange={handleModalChange}
                                        type="month"
                                        className={inputCls}
                                    />
                                    {modalErrors.service_completion_month_year && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {modalErrors.service_completion_month_year}
                                        </p>
                                    )}
                                </div>

                            <div>
                                <label className="field-label">
                                    Proof Document Title
                                </label>
                                <input
                                    name="proof_document_title"
                                    value={modalForm.proof_document_title}
                                    onChange={handleModalChange}
                                    placeholder="e.g. Service Completion Letter"
                                    className={inputCls}
                                />
                            </div>

                            {proofDocumentField(
                                modalForm.proof_document,
                                handleModalFileChange,
                                () =>
                                    setModalForm((prev) => ({
                                        ...prev,
                                        proof_document: null,
                                    })),
                            )}
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

export default RelatedWorkExperience;
