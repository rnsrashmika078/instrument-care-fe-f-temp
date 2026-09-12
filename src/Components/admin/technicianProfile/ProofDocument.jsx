import { fetchWithAuth } from '../../utils/api';
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { API_BASE } from '../../../config';

export default function ProofDocument({ userId }) {
    const token = sessionStorage.getItem("token");
    const [tech_id, setTechId] = useState(null);

    const [documentFile, setDocumentFile] = useState(null);
    const [documentPreview, setDocumentPreview] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTechnicianID();
    }, []);

    const fetchTechnicianID = async () => {
        const res = await fetchWithAuth(
            `${API_BASE}/tech/profile/${userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
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
            const res = await fetchWithAuth(`${API_BASE}/tech/document/${tech_id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const data = await res.json();

            console.log("📄 Document data:", data);

            if (data.proof) {
                setDocumentPreview(`${API_BASE}/public/${data.proof}`);
            }

        } catch (err) {
            console.error("Error fetching document:", err);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setDocumentFile(file);
        setDocumentPreview(URL.createObjectURL(file));
    };

    const handleUpdate = async () => {
        if (!documentFile || !tech_id || !token) {
            toast.warn(
            "Please select a document and make sure the technician profile is loaded.",
          );
            return;
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
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
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
                toast.success("✅ Document uploaded successfully!");
                fetchDocument();
            } else {
                toast.error(result.error || result.message || "Upload failed");
            }
        } catch (err) {
            console.error("❌ Error uploading document:", err);
            toast.error("Error uploading document");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#ffffff80] shadow rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg">Gurantee Of Service</h3>
            {documentPreview ? (
                <a
                    href={documentPreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-100 text-orange-700 px-3 py-1 rounded-md text-sm hover:bg-orange-200"
                >
                    View Uploaded Document
                </a>
            ) : (
                <div>
                    <p className="text-gray-400">No document uploaded</p>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                    />
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-500"
                >
                    {loading ? "Uploading..." : "Upload Document"}
                </button>
            </div>
        </div>
    );
}