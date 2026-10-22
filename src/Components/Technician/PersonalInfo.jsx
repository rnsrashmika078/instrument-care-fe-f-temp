import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import profileImage from "../../assets/images/profile-image.jpeg";
import { API_BASE } from "../../config";
import { assetUrl } from "../utils/api";
import { toast } from "react-toastify";
import SelectedFileChip from "./SelectedFileChip";
import { fileNameFromPath } from "../utils/format";

const PersonalInfo = forwardRef(function PersonalInfo(
  { userId: userIdProp, sectionId = "profile-personal" },
  ref,
) {
  const [consent, setConsent] = useState(null);
  const [sending, setSending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [supervisorDirty, setSupervisorDirty] = useState(false);
  const [instituteSuggestions, setInstituteSuggestions] = useState([]);
  const [showInstituteSuggestions, setShowInstituteSuggestions] = useState(false);
  const instituteSearchTimer = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nic: "",
    address: "",
    mobileNumber: "",
    phoneNumber: "",
    email: "",
    has_institute: 0,
    institute_name: "",
    institute_id: "",
    designation: "",
    supervisor_name: "",
    supervisor_Designation: "",
    supervisor_Email: "",
    supervisor_Contact_No: "",
    has_supervisor: 0,
    picture: null,
    profileImage: null,
    profileImagePreview: null,
    gender: "",
    title: "",
    initials: "",
    district: "",
    service_letter: null,
    approval_letter: null,
    service_letter_url: "",
    approval_letter_url: "",
  });

  // Letters are uploaded the moment a file is chosen, so the chip reflects
  // what is actually stored on the server (idle = nothing chosen here).
  const [letterDocs, setLetterDocs] = useState({
    service_letter: null,
    approval_letter: null,
  });

  const userId = userIdProp || sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/tech/profile/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          nic: data.nic || "",
          address: data.address || "",
          phoneNumber: data.phone_number || "",
          mobileNumber: data.mobile_number || "",
          email: data.email || "",
          has_institute: Number(data.institute_id) > 0 ? 1 : 0,
          institute_name: data.institute_name || "",
          institute_id: data.institute_id || "",
          designation: data.designation || "",
          supervisor_name: data.supervisor_name || "",
          supervisor_Designation: data.supervisor_designation || "",
          supervisor_Email: data.supervisor_email || "",
          supervisor_Contact_No: data.supervisor_contact_no || "",
          has_supervisor: Number(data.has_supervisor) === 1 ? 1 : 0,
          picture: data.picture ? assetUrl(data.picture) : null,
          gender: data.gender || "",
          title: data.title || "",
          initials: data.name_with_initials || "",
          district: data.district || "",
          service_letter_url: data.service_letter || "",
          approval_letter_url: data.approval_letter || "",
        }));

        // Already-stored documents come back as a chip too, so refreshing the
        // page keeps showing what is on the server.
        setLetterDocs({
          service_letter: data.service_letter
            ? {
                name: fileNameFromPath(data.service_letter),
                path: data.service_letter,
                status: "uploaded",
              }
            : null,
          approval_letter: data.approval_letter
            ? {
                name: fileNameFromPath(data.approval_letter),
                path: data.approval_letter,
                status: "uploaded",
              }
            : null,
        });

        fetchSupervisorStatus();

      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear this field's validation error as soon as the user edits it.
    setFieldErrors((prev) => {
      if (!prev || !(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "has_institute" && value === "0") {
        next.institute_name = "";
        next.institute_id = "";
        next.designation = "";
        next.supervisor_name = "";
        next.supervisor_Designation = "";
        next.supervisor_Email = "";
        next.supervisor_Contact_No = "";
        next.has_supervisor = 0;
        next.service_letter = null;
        next.approval_letter = null;
        next.service_letter_url = "";
        next.approval_letter_url = "";
        setLetterDocs({ service_letter: null, approval_letter: null });
        setInstituteSuggestions([]);
        setShowInstituteSuggestions(false);
        setConsent(null);
        setSupervisorDirty(false);
      }

      if (name === "has_supervisor" && value === "0") {
        next.supervisor_name = "";
        next.supervisor_Designation = "";
        next.supervisor_Email = "";
        next.supervisor_Contact_No = "";
      }

      return next;
    });

    if (
      name === "has_supervisor" ||
      name === "supervisor_name" ||
      name === "supervisor_Designation" ||
      name === "supervisor_Email" ||
      name === "supervisor_Contact_No"
    ) {
      setSupervisorDirty(true);
    }
  };

  const fetchInstituteSuggestions = async (term) => {
    try {
      const res = await fetch(
        `${API_BASE}/tech/institutes?q=${encodeURIComponent(term)}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      setInstituteSuggestions(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Failed to fetch institute suggestions", err);
      setInstituteSuggestions([]);
    }
  };

  const handleInstituteChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, institute_name: value, institute_id: "" }));

    clearTimeout(instituteSearchTimer.current);

    if (!value.trim()) {
      setInstituteSuggestions([]);
      setShowInstituteSuggestions(false);
      return;
    }

    setShowInstituteSuggestions(true);
    instituteSearchTimer.current = setTimeout(() => {
      fetchInstituteSuggestions(value.trim());
    }, 300);
  };

  const handleInstituteFocus = () => {
    if (formData.institute_name.trim()) {
      setShowInstituteSuggestions(true);
    }
  };

  const handleInstituteSelect = (inst) => {
    setFormData((prev) => ({
      ...prev,
      institute_name: inst.name,
      institute_id: inst.institute_id,
    }));
    setInstituteSuggestions([]);
    setShowInstituteSuggestions(false);
  };

      const handleDocChange = (e) => {
        const { name, files } = e.target;
        const file = files[0] || null;
        e.target.value = "";

        if (!file) return;

        uploadLetter(name, file);
      };

      const uploadLetter = async (name, file) => {
        setLetterDocs((prev) => ({
          ...prev,
          [name]: {
            name: file.name,
            size: file.size,
            status: "uploading",
            path: prev[name]?.path || "",
          },
        }));

        try {
          const form = new FormData();
          form.append("type", name);
          form.append("document", file);

          const res = await fetch(`${API_BASE}/tech/profile/letter/${userId}`, {
            method: "POST",
            body: form,
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json();

          if (!res.ok) throw new Error(data.error || "Upload failed");

          setLetterDocs((prev) => ({
            ...prev,
            [name]: { name: file.name, size: file.size, status: "uploaded", path: data.path },
          }));
          setFormData((prev) => ({
            ...prev,
            [name]: null,
            [`${name}_url`]: data.path,
          }));

          toast.success(
            `${name === "service_letter" ? "Service" : "Approval"} letter uploaded`,
          );
        } catch (err) {
          console.error(err);
          setLetterDocs((prev) => ({ ...prev, [name]: null }));
          toast.error(err.message || "Upload failed");
        }
      };

      const removeLetterDoc = async (name) => {
        const doc = letterDocs[name];
        if (!doc || doc.status === "uploading") return;

        if (doc.status === "uploaded") {
          try {
            const form = new FormData();
            form.append("type", name);

            const res = await fetch(`${API_BASE}/tech/profile/letter/${userId}`, {
              method: "POST",
              body: form,
              headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Remove failed");
          } catch (err) {
            console.error(err);
            toast.error(err.message || "Could not remove the document");
            return;
          }
        }

        setLetterDocs((prev) => ({ ...prev, [name]: null }));
        setFormData((prev) => ({ ...prev, [name]: null, [`${name}_url`]: "" }));
      };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      setFormData({
        ...formData,
        profileImage: file,
        profileImagePreview: event.target.result,
      });
    };

    reader.readAsDataURL(file);
  };


  const fetchSupervisorStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/tech/supervisor/status/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data && Number(data.has_supervisor) === 1) {
        setConsent(data);
      }
    } catch (err) {
      console.error("Failed to fetch supervisor status", err);
    }
  };

  const sendInvite = async () => {
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/tech/supervisor/invite/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          has_supervisor: 1,
          supervisor_name: formData.supervisor_name,
          supervisor_Designation: formData.supervisor_Designation,
          supervisor_Email: formData.supervisor_Email,
          supervisor_Contact_No: formData.supervisor_Contact_No,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setConsent((prev) => ({ status: "pending", ...result, ...(prev || {}) }));
        toast.success(result.message || "Invite sent");
        if (result.email_sent === false) {
          toast.warn("Email could not be sent. Please contact support.");
        }
      } else {
        toast.error(result.message || "Failed to send invite");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send invite");
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Surface invalid fields so the user can see what is still missing, but
      // never block the save. Saving partial progress is intentional.
      validate();

      const form = new FormData();

      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("nic", formData.nic);
      form.append("address", formData.address);
      form.append("phoneNumber", formData.phoneNumber);
      form.append("mobileNumber", formData.mobileNumber);
      form.append("email", formData.email);
      const hasInstitute = String(formData.has_institute) === "1";

      // The API ignores empty strings, so an explicit 0 is required to clear
      // the stored institute. Designation cannot be cleared through this
      // endpoint and will be left as-is.
      form.append("institute_name", hasInstitute ? formData.institute_name : "");
      form.append("institute_id", hasInstitute ? formData.institute_id : "0");
      form.append("designation", formData.designation);
      form.append("supervisor_name", formData.supervisor_name);
      form.append("supervisor_Designation", formData.supervisor_Designation);
      form.append("supervisor_Email", formData.supervisor_Email);
      form.append("supervisor_Contact_No", formData.supervisor_Contact_No);
      form.append("has_supervisor", hasInstitute && String(formData.has_supervisor) === "1" ? "1" : "0");
      form.append("gender", formData.gender);
      form.append("title", formData.title);
      form.append("initials", formData.initials);
      form.append("district", formData.district);

      if (formData.service_letter instanceof File) {
        form.append("service_letter", formData.service_letter);
      }
      if (formData.approval_letter instanceof File) {
        form.append("approval_letter", formData.approval_letter);
      }

      if (formData.profileImage) {
        form.append("picture", formData.profileImage);
      }

      const res = await fetch(
        `${API_BASE}/tech/profile/${userId}`,
        {
          method: "POST",
          body: form,
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const result = await res.json();

      if (res.ok) {
        if (hasInstitute && String(formData.has_supervisor) === "1") {
          if (supervisorDirty) {
            await sendInvite();
          }
        } else {
          setConsent(null);
          setSupervisorDirty(false);
        }
        return true;
      } else {
        toast.error(result.error || "Update failed");
        console.error(" API Error:", result);
        return false;
      }

    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
      return false;
    }
  };

  const validate = () => {
    const errors = {};
    const msgs = [];

    const add = (field, msg) => {
      errors[field] = msg;
      msgs.push(msg);
    };

    if (!formData.title) add("title", "Title is required");

    if (!formData.initials.trim()) {
      add("initials", "Name with Initials is required");
    }

    if (!formData.nic.trim()) {
      add("nic", "NIC / Passport Number is required");
    } else if (!/(^[0-9]{9}[vVxX]$)|(^[0-9]{12}$)/.test(formData.nic.trim())) {
      add("nic", "Enter a valid NIC (9 digits + V/X or 12 digits)");
    }

    if (!formData.gender) add("gender", "Gender is required");

    if (!formData.address.trim()) add("address", "Address is required");

    if (!formData.district) add("district", "District is required");

    if (!formData.mobileNumber.trim()) {
      add("mobileNumber", "Mobile Phone is required");
    } else if (!/^0\d{9}$/.test(formData.mobileNumber.trim())) {
      add("mobileNumber", "Mobile number must be 10 digits starting with 0");
    }

    if (String(formData.has_institute) === "1") {
      if (!formData.institute_id) {
        add("institute_name", "Please select an institute from the suggestions");
      } else if (!formData.institute_name.trim()) {
        add("institute_name", "Institute Name is required");
      }

      if (!formData.designation.trim()) {
        add("designation", "Designation is required");
      }

      if (String(formData.has_supervisor) === "1") {
        if (!formData.supervisor_name.trim()) {
          add("supervisor_name", "Supervisor Name is required");
        }

        if (!formData.supervisor_Designation.trim()) {
          add("supervisor_Designation", "Supervisor Designation is required");
        }

        if (!formData.supervisor_Email.trim()) {
          add("supervisor_Email", "Supervisor Email is required");
        } else if (!/^\S+@\S+\.\S+$/.test(formData.supervisor_Email.trim())) {
          add("supervisor_Email", "Enter a valid supervisor email");
        }

        if (!formData.supervisor_Contact_No.trim()) {
          add("supervisor_Contact_No", "Supervisor Contact Number is required");
        } else if (!/^0\d{9}$/.test(formData.supervisor_Contact_No.trim())) {
          add(
            "supervisor_Contact_No",
            "Contact number must be 10 digits starting with 0",
          );
        }
      }
    }

    setFieldErrors(errors);
    return msgs;
  };

  // Pure read of current state - never sets error state, so it is safe to
  // call on every render/tick while the user is still typing.
  const completion = () => {
    const filled = (v) => (v === null || v === undefined ? false : String(v).trim() !== "");

    let done = 0;
    let total = 0;

    const count = (ok) => {
      total += 1;
      if (ok) done += 1;
    };

    count(filled(formData.firstName));
    count(filled(formData.lastName));
    count(filled(formData.title));
    count(filled(formData.initials));
    count(filled(formData.nic));
    count(filled(formData.gender));
    count(filled(formData.address));
    count(filled(formData.district));
    count(filled(formData.email));
    count(filled(formData.mobileNumber));

    count(!!(formData.service_letter_url || letterDocs.service_letter?.path || formData.service_letter));
    count(!!(formData.approval_letter_url || letterDocs.approval_letter?.path || formData.approval_letter));

    return { done, total };
  };

  useImperativeHandle(ref, () => ({
    validate,
    submit: handleSubmit,
    completion,
  }));

  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <p className="text-xs text-red-600 mt-1">{fieldErrors[name]}</p>
    ) : null;

  return (
    <div id={sectionId} className="bg-white shadow-md rounded-2xl p-6 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
        {Object.keys(fieldErrors).length > 0 && (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600 border border-red-200">
            Needs attention
          </span>
        )}
      </div>
      {/* <div className="flex items-center gap-6 mb-6">
        <img
          src={formData.profileImagePreview || formData.picture || profileImage}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="bg-orange-100 text-orange-700 px-3 py-1 rounded-md text-sm hover:bg-orange-200"
          />
          <p className="text-sm text-gray-500">Upload profile image</p>
        </div>
      </div> */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={formData.profileImagePreview || formData.picture || profileImage}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />
        <div>
          <label className="cursor-pointer bg-orange-100 text-orange-700 px-3 py-1 rounded-md text-sm hover:bg-orange-200 inline-block">
            Choose File
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 mt-1">Upload profile image</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="field-label">Title</label>
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Miss">Miss</option>
          </select>
          <FieldError name="title" />
        </div>

        <div>
          <label className="field-label">Name with Initials</label>
          <input
            type="text"
            name="initials"
            value={formData.initials}
            onChange={handleChange}
            className="input"
            placeholder="N.M.Perera"
          />
          <FieldError name="initials" />
        </div>

        <div>
          <label className="field-label">Full Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName + " " + formData.lastName}
            onChange={handleChange}
            disabled
            className="input bg-gray-50 cursor-not-allowed text-gray-500"
          />
        </div>

        <div>
          <label className="field-label">NIC / Passport Number</label>
          <input
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            className="input"
            maxLength="12"
            placeholder="Enter NIC or passport number"
          />
          <FieldError name="nic" />
        </div>

        <div>
          <label className="field-label">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <FieldError name="gender" />
        </div>


        <div>
          <label className="field-label">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input"
            placeholder="Enter residential address"
          />
          <FieldError name="address" />
        </div>

        <div>
          <label className="field-label">District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select District</option>
            <option value="Ampara">Ampara</option>
            <option value="Anuradhapura">Anuradhapura</option>
            <option value="Badulla">Badulla</option>
            <option value="Batticaloa">Batticaloa</option>
            <option value="Colombo">Colombo</option>
            <option value="Galle">Galle</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Hambantota">Hambantota</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Kalutara">Kalutara</option>
            <option value="Kandy">Kandy</option>
            <option value="Kegalle">Kegalle</option>
            <option value="Kilinochchi">Kilinochchi</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Mannar">Mannar</option>
            <option value="Matale">Matale</option>
            <option value="Matara">Matara</option>
            <option value="Monaragala">Monaragala</option>
            <option value="Mullaitivu">Mullaitivu</option>
            <option value="Nuwara Eliya">Nuwara Eliya</option>
            <option value="Polonnaruwa">Polonnaruwa</option>
            <option value="Puttalam">Puttalam</option>
            <option value="Ratnapura">Ratnapura</option>
            <option value="Trincomalee">Trincomalee</option>
            <option value="Vavuniya">Vavuniya</option>
          </select>
          <FieldError name="district" />
        </div>

        {/* Mobile Phone */}
        <div>
          <label className="field-label">Mobile Phone</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="input phone-prefix"
            maxLength="10"
            placeholder="07XXXXXXXX"
          />
          <FieldError name="mobileNumber" />
        </div>

        {/* Office Phone */}
        <div>
          <label className="field-label">Land Line Phone</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="input phone-prefix"
            maxLength="10"
            placeholder="0XXXXXXXXX"
          />
        </div>

        {/* Email - Disabled */}
        <div>
          <label className="field-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled
            className="input bg-gray-50 cursor-not-allowed text-gray-500"
          />
        </div>

        <div className="md:col-span-2">
          <h3 className="field-section-title">Institute Details</h3>
        </div>

        <div className="md:col-span-2">
          <label className="field-label mb-0">
            Do you currently affiliated to institute?
          </label>
          <div className="flex gap-6 mt-1">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="has_institute"
                value="1"
                checked={String(formData.has_institute) === "1"}
                onChange={handleChange}
                className="accent-orange-600"
              />
              Yes
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="has_institute"
                value="0"
                checked={String(formData.has_institute) === "0"}
                onChange={handleChange}
                className="accent-orange-600"
              />
              No
            </label>
          </div>
        </div>

        {String(formData.has_institute) === "1" && (
          <>
            <div>
              <label className="field-label">Institute Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="institute_name"
                  value={formData.institute_name}
                  onChange={handleInstituteChange}
                  onFocus={handleInstituteFocus}
                  onBlur={() =>
                    setTimeout(() => setShowInstituteSuggestions(false), 150)
                  }
                  autoComplete="off"
                  className="input"
                  placeholder="Start typing to search institutes"
                />
                {showInstituteSuggestions && instituteSuggestions.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto border border-gray-300 rounded-md bg-white shadow-lg">
                    {instituteSuggestions.map((inst) => (
                      <li
                        key={inst.institute_id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleInstituteSelect(inst)}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-orange-100 cursor-pointer"
                      >
                        {inst.name}
                      </li>
                    ))}
                  </ul>
                )}
                <FieldError name="institute_name" />
              </div>
            </div>

            {/* Designation */}
            <div>
              <label className="field-label">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="input"
                placeholder="Enter designation"
              />
              <FieldError name="designation" />
            </div>

            <div>
              <label className="field-label">Service Letter</label>
              {letterDocs.service_letter && (
                <SelectedFileChip
                  name={letterDocs.service_letter.name}
                  size={letterDocs.service_letter.size}
                  path={letterDocs.service_letter.path}
                  status={letterDocs.service_letter.status}
                  onRemove={() => removeLetterDoc("service_letter")}
                />
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-2 rounded-md text-sm hover:bg-orange-200">
                {letterDocs.service_letter
                  ? letterDocs.service_letter.status === "uploading"
                    ? "Uploading…"
                    : "Change File"
                  : formData.service_letter_url
                    ? "Update File"
                    : "Choose File"}
                <input
                  type="file"
                  name="service_letter"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleDocChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="field-label">Employment Letter</label>
              {letterDocs.approval_letter && (
                <SelectedFileChip
                  name={letterDocs.approval_letter.name}
                  size={letterDocs.approval_letter.size}
                  path={letterDocs.approval_letter.path}
                  status={letterDocs.approval_letter.status}
                  onRemove={() => removeLetterDoc("approval_letter")}
                />
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-2 rounded-md text-sm hover:bg-orange-200">
                {letterDocs.approval_letter
                  ? letterDocs.approval_letter.status === "uploading"
                    ? "Uploading…"
                    : "Change File"
                  : formData.approval_letter_url
                    ? "Update File"
                    : "Choose File"}
                <input
                  type="file"
                  name="approval_letter"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleDocChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Supervisor Details */}
            <div className="md:col-span-2">
              <h3 className="field-section-title">Supervisor Details</h3>
            </div>

            <div className="md:col-span-2">
              <label className="field-label mb-0">
                Do you have a supervisor?
              </label>
              <div className="flex gap-6 mt-1">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="has_supervisor"
                    value="1"
                    checked={String(formData.has_supervisor) === "1"}
                    onChange={handleChange}
                    className="accent-orange-600"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="has_supervisor"
                    value="0"
                    checked={String(formData.has_supervisor) === "0"}
                    onChange={handleChange}
                    className="accent-orange-600"
                  />
                  No
                </label>
              </div>
            </div>

            {String(formData.has_supervisor) === "1" && (
              <>
                <div>
                  <label className="field-label">Supervisor Name</label>
                  <input
                    type="text"
                    name="supervisor_name"
                    value={formData.supervisor_name}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter supervisor name"
                  />
                  <FieldError name="supervisor_name" />
                </div>

                <div>
                  <label className="field-label">Supervisor Designation</label>
                  <input
                    type="text"
                    name="supervisor_Designation"
                    value={formData.supervisor_Designation}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter supervisor designation"
                  />
                  <FieldError name="supervisor_Designation" />
                </div>

                <div>
                  <label className="field-label">Supervisor Email</label>
                  <input
                    type="email"
                    name="supervisor_Email"
                    value={formData.supervisor_Email}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter supervisor email"
                  />
                  <FieldError name="supervisor_Email" />
                </div>

                <div>
                  <label className="field-label">
                    Supervisor Contact Number
                  </label>
                  <input
                    type="text"
                    name="supervisor_Contact_No"
                    value={formData.supervisor_Contact_No}
                    onChange={handleChange}
                    className="input phone-prefix"
                    maxLength={10}
                    placeholder="0XXXXXXXXX"
                  />
                  <FieldError name="supervisor_Contact_No" />
                </div>

                {consent && (
                  <div className="md:col-span-2">
                    {consent.status === "consented" ? (
                      <div className="bg-green-50 border border-green-300 text-green-800 rounded p-3 text-sm">
                        Your supervisor has confirmed and provided consent.
                        {consent.consented_at
                          ? ` Date: ${new Date(consent.consented_at).toLocaleString()}`
                          : ""}
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-gray-300 text-amber-800 rounded p-3 text-sm flex flex-col gap-2">
                        <span>
                          An invitation email has been sent to{" "}
                          <strong>
                            {formData.supervisor_Email || consent.supervisor_email}
                          </strong>
                          . Your supervisor needs to verify and provide consent.
                        </span>
                        <span className="text-xs">Status: Pending</span>
                        <button
                          type="button"
                          onClick={sendInvite}
                          disabled={sending}
                          className="self-start bg-orange-600 text-white px-4 py-1.5 rounded text-sm hover:bg-orange-500 disabled:opacity-60"
                        >
                          {sending ? "Sending..." : "Resend Invitation"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default PersonalInfo;