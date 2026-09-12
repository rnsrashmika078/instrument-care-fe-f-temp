import { useState, useEffect } from "react";
import { API_BASE } from "../../config";
import { toast } from "react-toastify";

export default function SupervisorDetails() {
    const userId = sessionStorage.getItem("user_id");
    const [supervisor, setSupervisor] = useState({
        name: "",
        designation: "",
        email: "",
        contact: ""
    });
    const [loading, setLoading] = useState(false);

    // Fetch supervisor details on mount
    useEffect(() => {
        fetchSupervisorDetails();
    }, []);

    const fetchSupervisorDetails = async () => {
        try {
            const res = await fetch(
                `${API_BASE}/tech/profile/${userId}`
            );
            const data = await res.json();
            setSupervisor({
                name: data.supervisor_name || "",
                designation: data.supervisor_designation || "",
                email: data.supervisor_email || "",
                contact: data.supervisor_contact_no || ""
            });
        } catch (err) {
            console.error("Error fetching supervisor details:", err);
        }
    };

    const handleChange = (e) => {
        setSupervisor({ ...supervisor, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${API_BASE}/tech/supervisor/${userId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        supervisor_name: supervisor.name,
                        supervisor_designation: supervisor.designation,
                        supervisor_email: supervisor.email,
                        supervisor_contact_no: supervisor.contact
                    })
                }
            );

            if (res.ok) {
                toast.success("Supervisor Details updated successfully!");
            } else {
                toast.error("Failed to update Supervisor Details");
            }
        } catch (err) {
            console.error("Error updating Supervisor Details:", err);
            toast.error("Error updating Supervisor Details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg">Supervisor Details</h3>

            <input
                name="name"
                value={supervisor.name}
                onChange={handleChange}
                placeholder="Supervisor Name"
                className="border p-2 rounded w-full"
            />

            <input
                name="designation"
                value={supervisor.designation}
                onChange={handleChange}
                placeholder="Designation"
                className="border p-2 rounded w-full"
            />

            <input
                name="email"
                value={supervisor.email}
                onChange={handleChange}
                placeholder="Email"
                className="border p-2 rounded w-full"
            />

            <input
                name="contact"
                value={supervisor.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                className="border p-2 rounded w-full"
            />

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-500"
                >
                    {loading ? "Updating..." : "Update"}
                </button>
            </div>
        </div>
    );
}