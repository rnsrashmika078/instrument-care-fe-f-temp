import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { API_BASE } from "../../config";
import { assetUrl } from "../utils/api";
import { toast } from "react-toastify";

const ProofDocument = forwardRef(function ProofDocument(
  { userId: userIdProp, sectionId = "profile-guarantee" },
  ref,
) {
    const userId = userIdProp || sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");

    const [tech_id, setTechId] = useState(null);

    const [documentFile, setDocumentFile] = useState(null);
    const [documentPreview, setDocumentPreview] = useState(null);
    const [uploaded, setUploaded] = useState(false);

    const [loading, setLoading] = useState(false);
    const [sectionErrors, setSectionErrors] = useState([]);

    useEffect(() => {
        fetchTechnicianID();
    }, []);

    const fetchTechnicianID = async () => {
        const res = await fetch(
            `${API_BASE}/tech/profile/${userId}`,
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
            fetchDocument();
        }
    }, [tech_id]);

    const fetchDocument = async () => {
        try {
            const res = await fetch(`${API_BASE}/tech/document/${tech_id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();

            if (data.proof) {
                setDocumentPreview(assetUrl(data.proof));
                setUploaded(true);
            }

        } catch (err) {
            console.error("Error fetching document:", err);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setDocumentFile(file);
        setUploaded(false);
        setDocumentPreview(URL.createObjectURL(file));
    };

    const handleUpdate = async () => {
        if (!documentFile || !tech_id || !token) {
            toast.warn("Please select a document and make sure your profile is loaded.");
            return false;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("document", documentFile);
            formData.append("tech_id", tech_id);

            const res = await fetch(
                `${API_BASE}/tech/profile/document/${tech_id}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const text = await res.text();
            let result = {};

            try {
                result = text ? JSON.parse(text) : {};
            } catch {
                result = { message: text };
            }

            if (res.ok) {
                setUploaded(true);
                toast.success("Document uploaded successfully!");
                fetchDocument();
                return true;
            } else {
                toast.error(result.error || result.message || "Upload failed");
                return false;
            }
        } catch (err) {
            console.error("Error uploading document:", err);
            toast.error("Error uploading document");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        const msgs = [];

        if (!documentPreview) {
            msgs.push("Please upload a Guarantee of Service document.");
        }

        setSectionErrors(msgs);
        return msgs;
    };

    const submit = async () => {
        if (documentFile && !uploaded) {
            return await handleUpdate();
        }
        return true;
    };

    useImperativeHandle(ref, () => ({
        validate,
        submit,
    }));

    return (
        <div id={sectionId} className="bg-[#ffffff80] shadow rounded-xl p-6 space-y-4 border-2 border-gray-200">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Guarantee Of Service</h3>
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

            {documentPreview ? (
                <a
                    href={documentPreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-md text-sm hover:bg-orange-200"
                >
                    View Uploaded Document
                </a>
            ) : (
                <p className="text-gray-400">No document uploaded</p>
            )}

            <div className="space-y-2">
                <label className="cursor-pointer inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-2 rounded-md text-sm hover:bg-orange-200">
                    Choose File
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
                {documentFile && (
                    <p className="text-sm text-gray-600">{documentFile.name} selected</p>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-500 w-full sm:w-auto"
                >
                    {loading ? "Uploading..." : "Upload Document"}
                </button>
            </div>
        </div>
    );
});

export default ProofDocument;