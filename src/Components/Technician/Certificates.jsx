import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { API_BASE } from "../../config";
import { fileNameFromPath } from "../utils/format";
import SelectedFileChip from "./SelectedFileChip";

const Certificates = forwardRef(function Certificates(
  { userId: userIdProp, sectionId = "profile-certificates" },
  ref,
) {
    const userId = userIdProp || sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");
    const [tech_id, setTechId] = useState(null);

    const [oldCertificates, setOldCertificates] = useState([]);

    const [editingId, setEditingId] = useState(null);
const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        oem_company_name: "",
        instrument_name: "",
        offered_institute: "",
        qualification_type: "",
        certificate_name: "",
        certificate_number: "",
        issue_date: "",
        expiry_date: "",
        certificate_file: null,
    });

    const [sectionErrors, setSectionErrors] = useState([]);
    const [modalErrors, setModalErrors] = useState({});

    // Proof document chosen while editing an existing qualification. It is
    // uploaded as soon as the file is picked, so the chip reflects the server.
    const [editDoc, setEditDoc] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalForm, setModalForm] = useState({
        oem_company_name: "",
        instrument_name: "",
        offered_institute: "",
        qualification_type: "",
        certificate_name: "",
        certificate_number: "",
        issue_date: "",
        expiry_date: "",
        certificate_file: null,
    });

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
            fetchCertificates();
        }
    }, [tech_id]);

    const fetchCertificates = async () => {
        try {
            const res = await fetch(
              `${API_BASE}/tech/certificates/${tech_id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            setOldCertificates(data.data || []);
        } catch (err) {
            console.error("Error fetching certificates:", err);
        }
    };

    const addRow = () => {
        setModalForm({
            oem_company_name: "",
            instrument_name: "",
            offered_institute: "",
            qualification_type: "",
            certificate_name: "",
            certificate_number: "",
            issue_date: "",
            expiry_date: "",
            certificate_file: null,
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

    const handleModalFileChange = (e) => {
        const file = e.target.files[0] || null;
        setModalForm((prev) => ({ ...prev, certificate_file: file }));
        setModalErrors((prev) => ({ ...prev, certificate_file: undefined }));
        e.target.value = "";
    };

    const appendQualification = (formData, prefix, data) => {
        formData.append(`${prefix}[oem_company_name]`, data.oem_company_name || "");
        formData.append(`${prefix}[instrument_name]`, data.instrument_name || "");
        formData.append(`${prefix}[offered_institute]`, data.offered_institute || "");
        formData.append(`${prefix}[qualification_type]`, data.qualification_type || "");
        formData.append(`${prefix}[certificate_name]`, data.certificate_name || "");
        formData.append(`${prefix}[certificate_number]`, data.certificate_number || "");
        formData.append(`${prefix}[issue_date]`, data.issue_date || "");
        formData.append(`${prefix}[expiry_date]`, data.expiry_date || "");
        if (data.certificate_file) {
            formData.append(`${prefix}[certificate_file]`, data.certificate_file);
        }
    };

    // Every add / edit / remove is posted straight away so the list on screen
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
                `${API_BASE}/tech/profile/certificates/${tech_id}`,
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
                await fetchCertificates();
                return true;
            }

            console.error(" API Error:", result);
            toast.error(
                result.message || result.error || "Failed to save qualification",
            );
            return false;
        } catch (err) {
            console.error(" Error saving qualification:", err);
            toast.error("Error saving qualification");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleModalAdd = async () => {
        const certName = modalForm.certificate_name.trim();
        const errors = {};
        if (!certName) {
            errors.certificate_name = "Qualification name is required.";
        }

        if (Object.keys(errors).length > 0) {
            setModalErrors(errors);
            return;
        }

        const ok = await persist((formData) => {
            appendQualification(formData, "certificates[0]", {
                oem_company_name: modalForm.oem_company_name.trim(),
                instrument_name: modalForm.instrument_name.trim(),
                offered_institute: modalForm.offered_institute.trim(),
                qualification_type: modalForm.qualification_type.trim(),
                certificate_name: certName,
                certificate_number: (modalForm.certificate_number || "").trim(),
                issue_date: modalForm.issue_date,
                expiry_date: modalForm.expiry_date,
                certificate_file: modalForm.certificate_file,
            });
        });

        if (ok) {
            setShowModal(false);
            setModalErrors({});
            toast.success("Qualification added");
        }
    };

    const startEdit = (cert) => {
        setEditingId(cert.id);
        setEditDoc(
            cert.certificate_file
                ? {
                    name: fileNameFromPath(cert.certificate_file),
                    path: cert.certificate_file,
                    status: "uploaded",
                }
                : null,
        );
        setEditForm({
            oem_company_name: cert.oem_company_name || "",
            instrument_name: cert.instrument_name || "",
            offered_institute: cert.offered_institute || "",
            qualification_type: cert.qualification_type || "",
            certificate_name: cert.certificate_name || "",
            certificate_number: cert.certificate_number || "",
            issue_date: cert.issue_date || "",
            expiry_date: cert.expiry_date || "",
            certificate_file: null,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditDoc(null);
        setEditForm({
            oem_company_name: "",
            instrument_name: "",
            offered_institute: "",
            qualification_type: "",
            certificate_name: "",
            certificate_number: "",
            issue_date: "",
            expiry_date: "",
            certificate_file: null,
        });
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

        if (!file || editingId === null || !tech_id) return;

        uploadCertificateFile(file);
    };

    const uploadCertificateFile = async (file) => {
        setEditDoc({ name: file.name, size: file.size, status: "uploading" });

        try {
            const fd = new FormData();
            fd.append("cert_id", String(editingId));
            fd.append("document", file);

            const res = await fetch(`${API_BASE}/tech/profile/certificate-file/${tech_id}`, {
                method: "POST",
                body: fd,
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");

            setEditDoc({ name: file.name, size: file.size, status: "uploaded", path: data.path });
            setOldCertificates((prev) =>
                prev.map((c) =>
                    c.id === editingId ? { ...c, certificate_file: data.path } : c,
                ),
            );
            toast.success("Proof document uploaded");
        } catch (err) {
            console.error(err);
            setEditDoc(null);
            toast.error(err.message || "Upload failed");
        }
    };

    const removeEditDoc = async () => {
        if (!editDoc || editDoc.status === "uploading" || editingId === null || !tech_id) return;

        if (editDoc.status === "uploaded") {
            try {
                const fd = new FormData();
                fd.append("cert_id", String(editingId));

                const res = await fetch(`${API_BASE}/tech/profile/certificate-file/${tech_id}`, {
                    method: "POST",
                    body: fd,
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Remove failed");

                setOldCertificates((prev) =>
                    prev.map((c) =>
                        c.id === editingId ? { ...c, certificate_file: null } : c,
                    ),
                );
            } catch (err) {
                console.error(err);
                toast.error(err.message || "Could not remove the document");
                return;
            }
        }

        setEditDoc(null);
    };

    const saveEdit = async () => {
        const certName = editForm.certificate_name.trim();

        if (!certName) {
            toast.error("Please fill Qualification Name");
            return;
        }

        const ok = await persist((formData) => {
            formData.append("update_certificates[0][id]", editingId);
            appendQualification(formData, "update_certificates[0]", {
                oem_company_name: editForm.oem_company_name.trim(),
                instrument_name: editForm.instrument_name.trim(),
                offered_institute: editForm.offered_institute.trim(),
                qualification_type: editForm.qualification_type.trim(),
                certificate_name: certName,
                certificate_number: (editForm.certificate_number || "").trim(),
                issue_date: editForm.issue_date,
                expiry_date: editForm.expiry_date,
                certificate_file: editForm.certificate_file,
            });
        });

        if (ok) {
            cancelEdit();
            toast.success("Qualification updated");
        }
    };

    const removeEntry = async (id) => {
        if (!window.confirm("Remove this qualification?")) return;

        if (editingId === id) cancelEdit();

        const ok = await persist((formData) => {
            formData.append("remove_certificates[]", id);
        });

        if (ok) {
            toast.success("Qualification removed");
        }
    };

    const validate = () => {
        const msgs = [];

        if (editingId !== null) {
            msgs.push("Save or cancel the current edit before submitting.");
        }

        if ((oldCertificates || []).length === 0) {
            msgs.push("Add at least one qualification.");
        }

        setSectionErrors(msgs);
        return msgs;
    };

    const completion = () => {
        const saved = (oldCertificates || []).length;

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
      <h3 className="text-lg font-semibold text-gray-800">Qualification</h3>
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
      {oldCertificates.map((cert) => {
        if (editingId === cert.id) {
          return (
            <div key={cert.id} className="border border-gray-200 rounded-lg p-4 bg-white space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Company Name</label>
                  <input
                    name="oem_company_name"
                    value={editForm.oem_company_name}
                    onChange={handleEditFormChange}
                    placeholder="e.g. Agilent"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="field-label">Offered Institute</label>
                  <input
                    name="offered_institute"
                    value={editForm.offered_institute}
                    onChange={handleEditFormChange}
                    placeholder="e.g. NIBM"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="field-label">Qualification Name</label>
                  <input
                    name="certificate_name"
                    value={editForm.certificate_name}
                    onChange={handleEditFormChange}
                    placeholder="e.g. Certificate in HVAC"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="field-label">Qualification Type</label>
                  <input
                    name="qualification_type"
                    value={editForm.qualification_type}
                    onChange={handleEditFormChange}
                    placeholder="e.g. Degree / Diploma / Certification / NVQ"
                    className={inputCls}
                  />
                </div>

                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Effective Date</label>
                    <input
                      name="issue_date"
                      value={editForm.issue_date}
                      onChange={handleEditFormChange}
                      type="date"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="field-label">Expiry Date</label>
                    <input
                      name="expiry_date"
                      value={editForm.expiry_date}
                      onChange={handleEditFormChange}
                      type="date"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="field-label">Proof Document</label>
                  {editDoc && (
                    <SelectedFileChip
                      name={editDoc.name}
                      size={editDoc.size}
                      path={editDoc.path}
                      status={editDoc.status}
                      onRemove={removeEditDoc}
                    />
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-2 rounded-md text-sm hover:bg-orange-200">
                    {editDoc
                      ? editDoc.status === "uploading"
                        ? "Uploading…"
                        : "Change File"
                      : "Choose New File (optional)"}
                    <input
                      type="file"
                      onChange={handleEditFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={saveEdit}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm font-medium transition-colors"
                >
                  Save
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
            key={cert.id}
            className="border border-gray-200 rounded-lg p-3 bg-white transition hover:bg-gray-50"
          >
            <p className="font-semibold text-gray-800">{cert.certificate_name}</p>
            <p className="text-sm text-gray-600">Company Name: {cert.oem_company_name}</p>
            {cert.offered_institute && (
              <p className="text-sm text-gray-600">Offered Institute: {cert.offered_institute}</p>
            )}
            {cert.qualification_type && (
              <p className="text-sm text-gray-600">Qualification Type: {cert.qualification_type}</p>
            )}
            <p className="text-xs text-gray-500">
              Effective: {cert.issue_date} | Expiry: {cert.expiry_date}
            </p>
            {cert.certificate_file && (
              <SelectedFileChip
                name={fileNameFromPath(cert.certificate_file)}
                path={cert.certificate_file}
                status="uploaded"
              />
            )}

            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => startEdit(cert)}
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
                onClick={() => removeEntry(cert.id)}
                className="inline-flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>

    {oldCertificates.length === 0 && (
      <p className="text-sm text-gray-400">
        No qualifications added yet.
      </p>
    )}

    <button
      type="button"
      onClick={addRow}
      disabled={saving}
      className="text-orange-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      + {saving ? "Adding..." : "Add Qualification"}
    </button>

    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

        <div className="bg-white border border-gray-200 w-11/12 max-w-2xl p-6 z-10 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
              Add Qualification
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
              <label className="field-label">Company Name</label>
              <input
                name="oem_company_name"
                value={modalForm.oem_company_name}
                onChange={handleModalChange}
                placeholder="e.g. Agilent"
                className={inputCls}
              />
            </div>

            <div>
              <label className="field-label">Offered Institute</label>
              <input
                name="offered_institute"
                value={modalForm.offered_institute}
                onChange={handleModalChange}
                placeholder="e.g. NIBM"
                className={inputCls}
              />
            </div>

            <div>
              <label className="field-label">Qualification Name</label>
              <input
                name="certificate_name"
                value={modalForm.certificate_name}
                onChange={handleModalChange}
                placeholder="e.g. Certificate in HVAC"
                className={inputCls}
              />
              {modalErrors.certificate_name && (
                <p className="mt-1 text-xs text-red-600">
                  {modalErrors.certificate_name}
                </p>
              )}
            </div>

            <div>
              <label className="field-label">Qualification Type</label>
              <input
                name="qualification_type"
                value={modalForm.qualification_type}
                onChange={handleModalChange}
                placeholder="e.g. Degree / Diploma / Certification / NVQ"
                className={inputCls}
              />
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Effective Date</label>
                <input
                  name="issue_date"
                  value={modalForm.issue_date}
                  onChange={handleModalChange}
                  type="date"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="field-label">Expiry Date</label>
                <input
                  name="expiry_date"
                  value={modalForm.expiry_date}
                  onChange={handleModalChange}
                  type="date"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="field-label">Proof Document</label>
              {modalForm.certificate_file && (
                <SelectedFileChip
                  name={modalForm.certificate_file.name}
                  size={modalForm.certificate_file.size}
                  onRemove={() =>
                    setModalForm((prev) => ({ ...prev, certificate_file: null }))
                  }
                />
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-2 rounded-md text-sm hover:bg-orange-200">
                {modalForm.certificate_file ? "Change File" : "Choose File"}
                <input
                  type="file"
                  onChange={handleModalFileChange}
                  className="hidden"
                />
              </label>
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

export default Certificates;