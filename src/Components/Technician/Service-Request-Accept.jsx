import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../config";

export default function ServiceRequestAccept({
  initialFormData = {
    ownerEmail: "",
    subject: "",
    message: "",
    request_id: null,
  },
  onBack = () => { },
  onSend = () => { }, // called when backend returns success
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  //  keep form synced when parent data changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSend = async () => {
    const endpoint = `${API_BASE}/api/send-owner-email`;

    const payload = {
      owner_email: formData.ownerEmail,
      subject: formData.subject,
      message: formData.message,
      request_id: formData.request_id,
    };

    console.log("📤 Sending email payload:", JSON.stringify(payload, null, 2));

    try {
      setLoading(true);
      setStatusMessage("");

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token") || ""}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(" Email send response:", data);

      //  detect backend success
      if (response.ok && data?.success === true) {
        onSend(data); // send to parent to show success component
      } else {
        setStatusMessage(
          data?.message || " Failed to send email. Please try again."
        );
      }
    } catch (error) {
      console.error(" Error sending email:", error);
      setStatusMessage(" Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg p-4 sm:p-6 w-full mx-auto shadow-sm bg-white border-2 border-gray-200 font-poppins">
      <h3 className="mb-1 font-bold text-lg text-gray-800">
        Response to the Service Request
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        The owner will be notified by email once you send this response.
      </p>

      <form className="space-y-4">
        {/* Owner Email */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label
            htmlFor="accept-ownerEmail"
            className="font-semibold text-gray-600 text-sm w-full sm:w-1/3 mb-1 sm:mb-0"
          >
            Client Email Address
          </label>
          <input
            id="accept-ownerEmail"
            type="email"
            value={formData.ownerEmail}
            onChange={(e) => handleChange("ownerEmail", e.target.value)}
            className="w-full sm:w-2/3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {/* Subject */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label
            htmlFor="accept-subject"
            className="font-semibold text-gray-600 text-sm w-full sm:w-1/3 mb-1 sm:mb-0"
          >
            Subject
          </label>
          <input
            id="accept-subject"
            type="text"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            className="w-full sm:w-2/3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col sm:flex-row sm:items-start">
          <label
            htmlFor="accept-message"
            className="font-semibold text-gray-600 text-sm w-full sm:w-1/3 mb-1 sm:mb-0"
          >
            Message
          </label>
          <textarea
            id="accept-message"
            rows="5"
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="w-full sm:w-2/3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {/* Error / Info Message */}
        {statusMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {statusMessage}
          </div>
        )}

        <div className="h-px bg-gray-200 mt-4" />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mt-4 w-full">
          <Link
            to="/tech/service-request"
            className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Back
          </Link>
          <button
            type="button"
            onClick={handleSend}
            className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold text-sm bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Acceptance"}
          </button>
        </div>
      </form>
    </div>
  );
}
