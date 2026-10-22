import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { API_BASE } from "../../config";
import { toast } from "react-toastify";

const TERMS = [
    {
        key: "nid_term_1",
        text: "I hereby declare that the information and supporting documents provided for registration in the National Instrument Database (NID) are true and accurate to the best of my knowledge.",
    },
    {
        key: "nid_term_2",
        text: "I consent to the inclusion of my professional details in the Instrument Care Module of the National Instrument Database (NID) and understand that the information may be made available to registered users of the NID for the purposes of facilitating access to technical expertise in the repair, maintenance, calibration, and operation of scientific instruments.",
    },
    {
        key: "nid_term_3",
        text: "I acknowledge that inclusion in the NID does not constitute certification, accreditation, endorsement, or guarantee of competence by the National Science Foundation (NSF) and does not confer any entitlement to employment, professional recognition, or other privileges.",
    },
];

const TermsAndConditions = forwardRef(function TermsAndConditions(
  { userId: userIdProp, sectionId = "profile-terms" },
  ref,
) {
    const userId = userIdProp || sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");

    const [tech_id, setTechId] = useState(null);
    const [checkedKeys, setCheckedKeys] = useState([]);
    
    const [sectionErrors, setSectionErrors] = useState([]);

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
            fetchTerms();
        }
    }, [tech_id]);

    const fetchTerms = async () => {
        try {
            const res = await fetch(`${API_BASE}/tech/terms/${tech_id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            const accepted = (data.data || [])
                .filter((t) => t.accepted == 1)
                .map((t) => t.term_key);

            setCheckedKeys((prev) =>
                [...new Set([...prev, ...accepted])],
            );
        } catch (err) {
            console.error("Error fetching terms and conditions:", err);
        }
    };

    const toggle = (key) => {
        setCheckedKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
        );
    };

    const handleSave = async () => {
        if (!tech_id) {
            toast.warn("Please make sure your profile is loaded.");
            return false;
        }

        try {


            const payload = {
                terms: TERMS.map((t) => ({
                    term_key: t.key,
                    term_text: t.text,
                    accepted: checkedKeys.includes(t.key) ? 1 : 0,
                })),
            };

            const res = await fetch(`${API_BASE}/tech/profile/terms/${tech_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (res.ok) {
                // All terms accepted, but this technician has no supervisor, so
                // the backend holds the status at Pending until the profile is
                // 100% complete. Say so instead of leaving them guessing.
                if (result?.awaiting_complete_profile) {
                    const completion = result.profile_completion || {};
                    toast.warn(
                        "All terms accepted, but your profile is " +
                            (completion.percent ?? 0) +
                            "% complete. Complete every section to move your status to Submitted.",
                        { autoClose: 8000 },
                    );
                }

                return true;
            } else {
                console.error(result);
                toast.error("Failed to save terms and conditions");
                return false;
            }
        } catch (err) {
            console.error("Error saving terms and conditions:", err);
            toast.error("Error saving terms and conditions");
            return false;
        }
    };

    const validate = () => {
        const msgs = [];
        const missing = TERMS.filter((t) => !checkedKeys.includes(t.key));

        if (missing.length > 0) {
            msgs.push(
                `Please accept all ${TERMS.length} terms${
                    missing.length
                        ? ` (${missing.length} not accepted)`
                        : ""
                }.`,
            );
        }

        setSectionErrors(msgs);
        return msgs;
    };

    const completion = () => {
        const done = TERMS.filter((t) => checkedKeys.includes(t.key)).length;
        return { done, total: TERMS.length };
    };

    useImperativeHandle(ref, () => ({
        validate,
        submit: handleSave,
        completion,
    }));

    return (
        <div id={sectionId} className="bg-white shadow-md rounded-2xl p-6 space-y-4 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Terms and Conditions</h3>
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
                {TERMS.map((t) => (
                    <label
                        key={t.key}
                        className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            checked={checkedKeys.includes(t.key)}
                            onChange={() => toggle(t.key)}
                            className="term-checkbox"
                        />
                        <span className="text-sm text-gray-700">{t.text}</span>
                    </label>
                ))}
            </div>

            {/* <p className="text-xs text-gray-400">
                Placeholder text - to be replaced with the final terms.
            </p> */}
        </div>
    );
});

export default TermsAndConditions;
