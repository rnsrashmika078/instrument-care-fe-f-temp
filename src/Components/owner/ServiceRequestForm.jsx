import React, { useState, useEffect } from "react";
import { API_BASE } from "../../config";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ServiceRequestForm({
  onBack = () => {},
  onSend = () => {},
}) {
  const { id: technicianId } = useParams();
  const token = sessionStorage.getItem("token");
  const [instruments, setInstruments] = useState([]);
  const userId = sessionStorage.getItem("user_id");
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const checkOwnProfile = async () => {
      if (!technicianId || !token) return;
      try {
        const res = await fetch(`${API_BASE}/user/dashboard/${technicianId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (
            data.technician_user_id &&
            Number(data.technician_user_id) === Number(userId)
          ) {
            setIsOwnProfile(true);
          }
        }
      } catch (err) {
        console.error("Error checking technician profile:", err);
      }
    };

    checkOwnProfile();
  }, [technicianId, token, userId]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId || !token) return;

      try {
        const res = await fetch(`${API_BASE}/user/profile/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch user profile (${res.status})`);
        }

        const data = await res.json();
        console.log("User profile:", data);

        setFormData((prev) => ({
          ...prev,
          full_name:
            data.full_name ||
            `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
            "",
          email: data.email || "",
          physical_address: data.physical_address || data.address || "",
          contact_number:
            data.contact_number ||
            data.mobile_number ||
            data.phone_number ||
            "",
          institute_name: data.institute_name || "",
          institute_address:
            data.institute_address ||
            data.institute_address_line ||
            data.address ||
            "",
        }));
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, [userId, token]);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    physical_address: "",
    contact_number: "",
    institute_name: "",
    institute_address: "",
    instrument_name: "",
    instrument_brand: "",
    instrument_model: "",
    instrument_manufacturer: "",
    manufactured_year: "",
    product_testing_type: "",
    testing_parameter: "",
    consumption_period: "",
    issue_description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    for (const key in formData) {
      if (!formData[key] || formData[key].trim() === "") return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isOwnProfile) {
      toast.error("You cannot request service from yourself.");
      return;
    }

    if (!validateForm()) {
      toast.warn("Please fill out all required fields before submitting.");
      return;
    }

    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    const payload = {
      ...formData,
      technician_id: technicianId,
      user_id: userId,
    };
    console.log(
      "🚀 Sending service request payload:",
      JSON.stringify(payload, null, 2),
    );

    try {
      setLoading(true); //  start loading

      const response = await fetch(`${API_BASE}/user/service-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      onSend(data); //  callback with response
      toast.success("Service request sent successfully!");
    } catch {
      toast.success("Service Request sent successfully!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/service-request/${technicianId}/instruments`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch instruments");

        const data = await response.json();

        setInstruments(data.instruments || []);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };

    fetchInstruments();
  }, [technicianId]);

  return (
      <div className="w-full bg-white rounded-xl shadow-sm p-4 md:p-6 border-2 border-gray-200">
      {isOwnProfile && (
        <div className="mb-4 rounded-lg border border-gray-300 bg-amber-50 p-3 text-sm text-amber-800">
          You cannot request service from your own technician profile.
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* ----------------- Personal Details Section ----------------- */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Full Name", name: "full_name", placeholder: "" },
              { label: "Email Address", name: "email", placeholder: "" },
              {
                label: "Physical Address",
                name: "physical_address",
                placeholder: "",
              },
              {
                label: "Contact Number",
                name: "contact_number",
                placeholder: "07XXXXXXXX",
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="field-label">
                  {field.label} <span className="text-red-500"></span>
                </label>
                <input
                  type={field.name === "email" ? "email" : "text"}
                  name={field.name}
                  placeholder={field.placeholder}
                  className={
                    field.name === "contact_number" ? "input phone-prefix" : "input"
                  }
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        {/* ----------------- Institute Details Section ----------------- */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Institute Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: "Institute Name",
                name: "institute_name",
                placeholder: "",
              },
              {
                label: "Institute Address",
                name: "institute_address",
                placeholder: "",
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="field-label">
                  {field.label} <span className="text-red-500"></span>
                </label>
                <input
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  className="input"
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        {/* ----------------- Instrument Details Section ----------------- */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Instrument Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: "Instrument Name",
                name: "instrument_name",
                placeholder: "",
              },
              {
                label: "Instrument Brand",
                name: "instrument_brand",
                placeholder: "Ex: Hanna Instruments",
              },
              {
                label: "Instrument Model",
                name: "instrument_model",
                placeholder: "Ex: HI9813-5",
              },
              {
                label: "Instrument Manufacturer",
                name: "instrument_manufacturer",
                placeholder: "Ex: Hanna Instruments",
              },
              {
                label: "Manufactured Year",
                name: "manufactured_year",
                placeholder: "Ex: 2026",
              },
              {
                label: "Type of product testing",
                name: "product_testing_type",
                placeholder: "Ex: Water Quality Testing",
              },
              {
                label: "Testing parameter",
                name: "testing_parameter",
                placeholder: "Ex: pH, EC, TDS",
              },
              {
                label: "Consumption Period",
                name: "consumption_period",
                placeholder: "Ex: 1 Year",
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="field-label">
                  {field.label} <span className="text-red-500"></span>
                </label>
                {/* <input
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  className="input"
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                /> */}
                {field.name === "instrument_name" ? (
                  <select
                    name="instrument_name"
                    className="input"
                    value={formData.instrument_name}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Instrument</option>

                    {instruments.map((instrument) => (
                      <option
                        key={instrument.instrument_id}
                        value={instrument.intrument_id}
                      >
                        {instrument.instrument_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    placeholder={field.placeholder}
                    className="input"
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block font-semibold mb-1">
              Description About Issue <span className="text-red-500"></span>
            </label>
            <textarea
              rows="4"
              name="issue_description"
              placeholder="Ex: Need to repair the instrument"
              className="input"
              value={formData.issue_description}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* ----------------- Buttons ----------------- */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <button
            type="reset"
            onClick={() => {
              toast.success("Form Cleared!");
              onBack();
            }}
            className="w-full md:w-1/2 rounded-lg border border-gray-300 bg-white py-2.5 font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-orange-50 hover:text-orange-700 hover:cursor-pointer"
          >
            Clear Details
          </button>

          <button
            type="submit"
            className="w-full md:w-1/2 bg-orange-500 text-white font-semibold py-2.5 rounded-lg shadow-sm transition hover:bg-orange-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || isOwnProfile}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Sending...
              </>
            ) : isOwnProfile ? (
              "You Can't Request From Yourself"
            ) : (
              "Send a Service Request"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
