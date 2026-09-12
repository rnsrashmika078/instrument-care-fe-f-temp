import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../config";

export default function ServiceRequestReject({
  initialFormData = {
    ownerEmail: "",
    yourEmail: "",
    subject: "",
    message: "",
    request_id: null,
  },
  onBack = () => { },
  onSend = () => { },
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // ✅ keep form synced when parent data changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSend = async () => {
    const endpoint = `${API_BASE}/api/send-owner-email-reject`;

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
      console.log("✅ Email send response:", data);

      if (response.ok && data?.success === true) {
        onSend(data); // send to parent to show success component
      } else {
        setStatusMessage(
          data?.message || "❌ Failed to send email. Please try again."
        );
      }
    } catch (error) {
      console.error("❌ Error sending email:", error);
      setStatusMessage("❌ Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg p-4 sm:p-6 w-full mx-auto shadow bg-[#ff000015]">
      {/* Section Title */}
      <h3 className="mb-2 font-bold text-lg">Reject the Service Request</h3>
      <hr className="mb-4" />

      {/* Form */}
      <form className="space-y-4">
        {/* Owner Email */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="font-semibold w-full sm:w-1/3 mb-1 sm:mb-0">
            Client Email Address
          </label>
          <input
            type="email"
            value={formData.ownerEmail}
            onChange={(e) => handleChange("ownerEmail", e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-2/3"
          />
        </div>

        {/* Your Email */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="font-semibold w-full sm:w-1/3 mb-1 sm:mb-0">
            Your Email Address
          </label>
          <input
            type="email"
            value={formData.yourEmail}
            onChange={(e) => handleChange("yourEmail", e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-2/3"
          />
        </div> */}

        {/* Subject */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="font-semibold w-full sm:w-1/3 mb-1 sm:mb-0">
            Subject
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-2/3"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col sm:flex-row sm:items-start">
          <label className="font-semibold w-full sm:w-1/3 mb-1 sm:mb-0">
            Message
          </label>
          <textarea
            rows="5"
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-2/3"
          />
        </div>

        {/* Error / Info Message */}
        {statusMessage && (
          <div
            className={`text-sm mt-2 ${statusMessage.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
          >
            {statusMessage}
          </div>
        )}

        <hr className="mt-4" />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mt-4 w-full">
          <Link to='/tech/service-request' className="w-full sm:w-auto">
            <button
              type="button"
              onClick={onBack}
              className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-md font-semibold w-full sm:w-auto"
              disabled={loading}
            >
              Back
            </button>
          </Link>
          <button
            type="button"
            onClick={handleSend}
            className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-md font-semibold w-full sm:w-auto disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
