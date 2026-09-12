import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { API_BASE } from "../../config";

export default function Certificates() {
    const userId = sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");
    const [tech_id, setTechId] = useState(null);

    const [oldCertificates, setOldCertificates] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(false);

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
        const newCertificate = {
            oem_company_name: "",
            instrument_name: "",
            certificate_name: "",
            certificate_number: "",
            issue_date: "",
            expiry_date: "",
            certificate_file: null
        };
        setCertificates((prev) => [...prev, newCertificate]);
    };

    const handleChange = (i, e) => {
        setCertificates((prev) =>
            prev.map((item, index) => index === i ? { ...item, [e.target.name]: e.target.value } : item)
        );
    };

    const handleFileChange = (i, e) => {
        setCertificates((prev) =>
            prev.map((item, index) => index === i ? { ...item, certificate_file: e.target.files[0] } : item)
        );
    };

    const handleRemove = (i) => {
        setCertificates((prev) => prev.filter((_, index) => index !== i));
    };

    const handleUpdate = async () => {
        if (!tech_id || !token) {
            toast.warn("Technician profile is not loaded yet.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("tech_id", tech_id);

            certificates.forEach((cert, i) => {
                formData.append(`certificates[${i}][oem_company_name]`, cert.oem_company_name || "");
                formData.append(`certificates[${i}][instrument_name]`, cert.instrument_name || "");
                formData.append(`certificates[${i}][certificate_name]`, cert.certificate_name || "");
                formData.append(`certificates[${i}][certificate_number]`, cert.certificate_number || "");
                formData.append(`certificates[${i}][issue_date]`, cert.issue_date || "");
                formData.append(`certificates[${i}][expiry_date]`, cert.expiry_date || "");
                if (cert.certificate_file) {
                    formData.append(`certificates[${i}][certificate_file]`, cert.certificate_file);
                }
            });

            const res = await fetch(
                `${API_BASE}/tech/profile/certificates/${tech_id}`,
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
                toast.success("✅ Certificates updated successfully!");
                fetchCertificates();
            } else {
                console.error("❌ API Error:", result);
                toast.error(
          result.message || result.error || "Failed to update Certificates",
        );
            }
        } catch (err) {
            console.error("❌ Error updating Certificates:", err);
            toast.error("Error updating Certificates");
        } finally {
            setLoading(false);
        }
    };

    return (
  <div className="bg-[#ffffff80] shadow rounded-xl p-6 space-y-4">
    <h3 className="font-semibold text-lg mb-3">Certificates</h3>

    <div className="space-y-3">
      {oldCertificates.map((cert, i) => (
        <div key={i} className="border rounded-lg p-4 bg-white hover:bg-gray-100 transition">
          <p className="font-semibold text-gray-800">{cert.certificate_name}</p>
          <p className="text-sm text-gray-600">Company Name: {cert.oem_company_name}</p>
          <p className="text-sm text-gray-600">Instrument Name: {cert.instrument_name}</p>
          <p className="text-sm text-gray-500">Certificate No: {cert.certificate_number}</p>
          <p className="text-xs text-gray-500">
            Issued: {cert.issue_date} | Expiry: {cert.expiry_date}
          </p>
          {cert.certificate_file && (
            <a
              href={`${API_BASE}/${cert.certificate_file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm underline mt-1 inline-block"
            >
              View Certificate
            </a>
          )}
        </div>
      ))}
    </div>

    {certificates.map((cert, i) => (
      <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border p-4 rounded">

        <input
          name="oem_company_name"
          value={cert.oem_company_name}
          onChange={(e) => handleChange(i, e)}
          placeholder="OEM Company Name"
          className="border p-2 rounded w-full"
        />

        <input
          name="instrument_name"
          value={cert.instrument_name}
          onChange={(e) => handleChange(i, e)}
          placeholder="Instrument Name"
          className="border p-2 rounded w-full"
        />

        <input
          name="certificate_name"
          value={cert.certificate_name}
          onChange={(e) => handleChange(i, e)}
          placeholder="Certificate Name"
          className="border p-2 rounded w-full"
        />

        <input
          name="certificate_number"
          value={cert.certificate_number}
          onChange={(e) => handleChange(i, e)}
          placeholder="Certificate Number"
          className="border p-2 rounded w-full"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
          <input
            name="issue_date"
            value={cert.issue_date}
            onChange={(e) => handleChange(i, e)}
            type="date"
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input
            name="expiry_date"
            value={cert.expiry_date}
            onChange={(e) => handleChange(i, e)}
            type="date"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* File input */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Certificate File</label>
          <label className="cursor-pointer inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-2 rounded-md text-sm hover:bg-orange-200">
            Choose File
            <input
              type="file"
              onChange={(e) => handleFileChange(i, e)}
              className="hidden"
            />
          </label>
        </div>

        {certificates.length > 1 && (
          <button
            type="button"
            onClick={() => handleRemove(i)}
            className="text-red-500 text-sm sm:col-span-2 text-left"
          >
            × Remove
          </button>
        )}
      </div>
    ))}

    <button type="button" onClick={addRow} className="text-orange-500 text-sm">
      + Add Certificate
    </button>

    <div className="flex justify-end">
      <button
        type="button"
        onClick={handleUpdate}
        disabled={loading}
        className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-500 w-full sm:w-auto"
      >
        {loading ? "Updating..." : "Update Certificates"}
      </button>
    </div>
  </div>
);
}

