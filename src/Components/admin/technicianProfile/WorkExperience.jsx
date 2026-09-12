import { fetchWithAuth } from '../../utils/api';
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { API_BASE } from "../../../config";

export default function WorkExperience({ userId }) {
    const token = sessionStorage.getItem("token");
    const [tech_id, setTechId] = useState(null);

    const [oldExperience, setOldExperience] = useState([]);
    const [experience, setExperience] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTechnicianID();
    }, []);

    const fetchTechnicianID = async () => {
        const res = await fetchWithAuth(`${API_BASE}/tech/profile/${userId}`,
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
            fetchTechnicianWorkExperience();
        }
    }, [tech_id]);

    const fetchTechnicianWorkExperience = async () => {
        try {
            const res = await fetchWithAuth(`${API_BASE}/tech/work-experience/${tech_id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const data = await res.json();
            setOldExperience(data.data || []);
        } catch (err) {
            console.error("❌ Error fetching work experience:", err);
        }
    };

    const addRow = () => {
        const newExperience = {
            organization_name: "",
            position_title: "",
            start_date: "",
            end_date: ""
        };
        console.log("➕ Adding new row:", newExperience);
        setExperience([...experience, newExperience]);
    };

    const handleChange = (i, e) => {
        const updated = [...experience];
        updated[i][e.target.name] = e.target.value;
        setExperience(updated);
    };

    const handleRemove = (i) => {
        const updated = experience.filter((_, index) => index !== i);
        setExperience(updated);
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            console.log("📤 Sending work experiences:", experience);

            const res = await fetchWithAuth(
                `${API_BASE}/tech/profile/work/${tech_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ work_experience: experience })
                }
            );

            const result = await res.json();
            console.log("📥 Response:", result);

            if (res.ok) {
                toast.success("✅ Work Experience updated successfully!");
                fetchTechnicianWorkExperience();
            } else {
                console.error("❌ API Error:", result);
                toast.error("Failed to update Work Experience");
            }
        } catch (err) {
            console.error("❌ Error updating Work Experience:", err);
            toast.error("Error updating Work Experience");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#ffffff80] shadow rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg">Work Experience</h3>

            <h3 className="font-medium mb-3">Previous Experience</h3>

            <div className="space-y-3">
                {oldExperience.map((exp, i) => (
                    <div
                        key={i}
                        className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <p className="font-medium text-gray-800">{exp.organization_name}</p>

                        <p className="text-sm text-gray-600">
                            {exp.position_title}
                        </p>

                        <p className="text-xs text-gray-500">
                            {exp.years_of_experience} years experience ( {exp.start_date} to {exp.end_date} )
                        </p>

                    </div>
                ))}
            </div>

            {experience.map((exp, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 border p-4 rounded">
                    <input
                        name="organization_name"
                        value={exp.organization_name || ""}
                        onChange={(e) => handleChange(i, e)}
                        placeholder="Organization"
                        className="border p-2 rounded"
                    />

                    <input
                        name="position_title"
                        value={exp.position_title || ""}
                        onChange={(e) => handleChange(i, e)}
                        placeholder="Position/Role"
                        className="border p-2 rounded"
                    />
                    <br></br>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            name="start_date"
                            value={exp.start_date || ""}
                            onChange={(e) => handleChange(i, e)}
                            type="date"
                            placeholder="Start Date"
                            className="border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            name="end_date"
                            value={exp.end_date || ""}
                            onChange={(e) => handleChange(i, e)}
                            type="date"
                            placeholder="End Date"
                            className="border p-2 rounded"
                        />
                    </div>
                    {experience.length >= 1 && (
                        <button
                            type="button"
                            onClick={() => handleRemove(i)}
                            className="text-red-500 text-sm col-span-3"
                        >
                            × Remove
                        </button>
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={addRow}
                className="text-orange-500 text-sm"
            >
                + Add Experience
            </button>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-500"
                >
                    {loading ? "Updating..." : "Update Work Experience"}
                </button>
            </div>
        </div>
    );
}

