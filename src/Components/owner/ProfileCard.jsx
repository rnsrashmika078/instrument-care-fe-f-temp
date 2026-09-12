import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultProfileImage from "../../assets/images/profile-image.jpeg";
import { fetchWithAuth } from "../utils/api";
import { API_BASE } from "../../config";

export default function ProfileCard() {
  const { id } = useParams(); // get technician id from URL
  const [tech, setTech] = useState(null);
  const [instruments, setInstruments] = useState([]);
  const [instrumentsCategories, setInstrumentsCategories] = useState([]);
  const [laboratoryCategories, setLaboratoryCategories] = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchTechnician = async () => {
      try {
        const response = await fetchWithAuth(
          `${API_BASE}/user/dashboard/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) throw new Error("Failed to fetch technician");
        const data = await response.json();
        setTech(data);
      } catch (error) {
        console.error("Error fetching technician:", error);
      }
    };

    fetchTechnician();
  }, [id]);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/service-request/${id}/instruments`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch instruments");

        const data = await response.json();
        console.log("Instrument", data.instruments);
        setInstruments(data.instruments || []);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };

    if (id) {
      fetchInstruments();
    }
  }, [id]);

  useEffect(() => {
    const fetchInstrumentsCategories = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/service-request/${id}/instrument-categories`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok)
          throw new Error("Failed to fetch instruments categories");

        const data = await response.json();
        console.log("Instrument Category", data);
        setInstrumentsCategories(data.instrumentsCategories || []);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };

    if (id) {
      fetchInstrumentsCategories();
    }
  }, [id]);

  useEffect(() => {
    const fetchLaboratoryCategories = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/service-request/${id}/laboratory-categories`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok)
          throw new Error("Failed to fetch laboratory categories");

        const data = await response.json();
        console.log("Lab Category", data);
        setLaboratoryCategories(data.laboratoryCategories || []);
      } catch (error) {
        console.error("Error fetching laboratory categories:", error);
      }
    };

    if (id) {
      fetchLaboratoryCategories();
    }
  }, [id]);

  useEffect(() => {
    const fetchTechnicianWorkExperience = async () => {
      try {
        const res = await fetch(`${API_BASE}/tech/work-experience/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();

        setWorkExperiences(result.data || []);
      } catch (error) {
        console.error("Error fetching work experiences:", error);
        setWorkExperiences([]);
      }
    };

    if (id) {
      fetchTechnicianWorkExperience();
    }
  }, [id]);

  useEffect(() => {
    const fetchTechnicianCertificates = async () => {
      try {
        const res = await fetch(`${API_BASE}/tech/certificates/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        console.log("From API:", result);
        setCertificates(result.data || []);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setCertificates([]);
      }
    };

    if (id) {
      fetchTechnicianCertificates();
    }
  }, [id]);

  useEffect(() => {
    const arr = [
      ...instruments,
      ...instrumentsCategories,
      ...laboratoryCategories,
    ];
    console.log("ARR", arr);
  }, [instruments, instrumentsCategories, laboratoryCategories]);

  if (!tech) {
    return <div className="p-4">Loading profile...</div>;
  }

  const profileImageUrl =
    tech.picture !== null ? `${API_BASE}/${tech.picture}` : DefaultProfileImage;

  return (
    <div className="bg-[#ffffff80] rounded-xl shadow-sm p-6 font-poppins flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <img
          src={profileImageUrl}
          alt={tech.first_name + " " + tech.last_name || "Profile"}
          className="h-20 w-20 rounded-full object-cover border border-gray-300 hover:scale-105 transition"
        />
        <div>
          <h2 className="text-lg font-bold">
            {tech.title} {tech.first_name + " " + tech.last_name || "N/A"}
          </h2>
          <p className="text-sm text-gray-500">{tech.designation || "-"}</p>
        </div>
      </div>

      {/* Technical Expertise */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-bold mb-3 text-gray-800">Technical Expertise</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-orange-50 border-b-2 border-orange-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Instrument
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Instrument Category
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Laboratory Category
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Instruments Row */}
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-wrap gap-2">
                    {instruments.length > 0 ? (
                      instruments.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold whitespace-nowrap"
                        >
                          {item.instrument_name || item.custom_category}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-wrap gap-2">
                    {instrumentsCategories.length > 0 ? (
                      instrumentsCategories.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold whitespace-nowrap"
                        >
                          {item.name || item.custom_category}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-wrap gap-2">
                    {laboratoryCategories.length > 0 ? (
                      laboratoryCategories.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold whitespace-nowrap"
                        >
                          {item.name || item.custom_category}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-bold mb-2 text-gray-800">About</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {tech.bio || "No description available"}
        </p>
      </div>

      {/* Institute */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-bold mb-2 text-gray-800">Institute</h3>
        <p className="text-sm text-gray-600">
          {tech.designation || "-"} <br />
          {tech.institute_name || "-"}
        </p>
      </div>

      {/* Certificates */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-bold mb-3 text-gray-800">Certificates</h3>

        {certificates.length > 0 ? (
          <div className="flex flex-col gap-3">
            {certificates.map((c, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                {/* Certificate Name */}
                <p className="font-semibold text-gray-800">
                  {c.certificate_name}
                </p>

                {/* Issuing Organization */}
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-500">Issued By: </span>
                  {c.oem_company_name}
                </p>

                {/* Details */}
                <div className="text-xs text-gray-500 mt-2 flex flex-col gap-1">
                  <div>
                    <span className="font-medium">Instrument: </span>
                    {c.instrument_name || "N/A"}
                  </div>

                  <div>
                    <span className="font-medium">Issue Date: </span>
                    {c.issue_date
                      ? new Date(c.issue_date).toLocaleDateString()
                      : "N/A"}
                  </div>

                  <div>
                    <span className="font-medium">Expiry Date: </span>
                    {c.expiry_date
                      ? new Date(c.expiry_date).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 text-xs">
            No certificates available
          </span>
        )}
      </div>

      {/* Experience */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-bold mb-3 text-gray-800">Experience</h3>

        {workExperiences.length > 0 ? (
          <div className="flex flex-col gap-3">
            {workExperiences.map((exp, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <p className="font-semibold text-gray-800">
                  {exp.position_title}
                </p>

                <p className="text-sm text-gray-600">{exp.organization_name}</p>

                <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-4">
                  <span>
                    <b>Years:</b> {exp.years_of_experience}
                  </span>
                  <span>
                    <b>From:</b> {new Date(exp.start_date).toLocaleDateString()}
                  </span>
                  <span>
                    <b>To:</b> {new Date(exp.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 text-xs">No experience available</span>
        )}
      </div>
    </div>
  );
}
