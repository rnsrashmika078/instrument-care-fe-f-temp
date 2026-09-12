import React, { useState, useEffect } from "react";
import ProfileImageUpload from "./ProfileImageUpload";
import ProfileFormLeft from "./ProfileFormLeft";
import ProfileFormRight from "./ProfileFormRight";
import { uploadToCloudinary } from "../utils/cloudinary";
import { API_BASE } from "../../config";
import { toast } from "react-toastify";

export default function EditProfileForm() {
  const [loading, setLoading] = useState(false); // ⬅ added loading state

  const [formData, setFormData] = useState({
    fullName: "",
    nic: "",
    email: "",
    address: "",
    personalNumber: "",
    bio: "",
    current_designation: "",
    institute_name: "",
    laboratory_category: "",
    instrument_category: "",
    supervisor_name: "",
    supervisor_Designation: "",
    supervisor_Email: "",
    supervisor_Contract_No: "",
    company_name: "",
    company_designation: "",
    years_of_experience: "",
    certificate_name: "",
    certificate_issued_year: "",
    certificate_verification_code: "",
    guarantee_for_service: "",
    additional_comment: "",
    profileImage: null,
    profileImagePreview: null,
    instrument: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) return;

        const res = await fetch(
          `${API_BASE}/tech/profile/${userId}`
        );
        const data = await res.json();

        setFormData((prev) => ({
          ...prev,
          fullName: data.full_name || "",
          nic: data.nic || "",
          email: data.email || "",
          address: data.address || "",
          personalNumber: data.personal_number || "",
          bio: data.bio || "",
          current_designation: data.current_designation || "",
          institute_name: data.institute_name || "",
          laboratory_category: data.laboratory_category || "",
          instrument_category: data.instrument_category || "",
          supervisor_name: data.supervisor_name || "",
          supervisor_Designation: data.supervisor_designation || "",
          supervisor_Email: data.supervisor_email || "",
          supervisor_Contract_No: data.supervisor_contract_no || "",
          company_name: data.company_name || "",
          company_designation: data.company_designation || "",
          years_of_experience: data.years_of_experience || "",
          certificate_name: data.certificate_name || "",
          certificate_issued_year: data.certificate_issued_year || "",
          certificate_verification_code: data.certificate_verification_code || "",
          guarantee_for_service: data.guarantee_for_service || "",
          additional_comment: data.additional_comment || "",
          profileImagePreview: data.profile_image_url || null,
          instrument: data.caring_instruments || "",
        }));
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData({
      fullName: "",
      nic: "",
      email: "",
      address: "",
      personalNumber: "",
      bio: "",
      current_designation: "",
      institute_name: "",
      laboratory_category: "",
      instrument_category: "",
      supervisor_name: "",
      supervisor_Designation: "",
      supervisor_Email: "",
      supervisor_Contract_No: "",
      company_name: "",
      company_designation: "",
      years_of_experience: "",
      certificate_name: "",
      certificate_issued_year: "",
      certificate_verification_code: "",
      guarantee_for_service: "",
      additional_comment: "",
      profileImage: null,
      profileImagePreview: null,
      instrument: "",
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true); // ⬅ start loading

      const userId = sessionStorage.getItem("user_id");
      if (!userId) {
        toast.error("User not found.");
        setLoading(false);
        return;
      }

      let profileImageUrl = formData.profileImagePreview || null;

      if (formData.profileImage) {
        try {
          profileImageUrl = await uploadToCloudinary(formData.profileImage);
        } catch (err) {
          console.error("Cloudinary upload failed", err);
          toast.error("Failed to upload image. Try again.");
          setLoading(false);
          return;
        }
      }

      const payload = { ...formData };
      delete payload.profileImage;
      delete payload.profileImagePreview;
      payload.profile_image_url = profileImageUrl;

      const res = await fetch(
        `${API_BASE}/tech/profile/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const text = await res.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch {
        toast.error("Invalid server response");
        setLoading(false);
        return;
      }

      if (res.ok)
        toast.success(result.message || "Profile updated successfully!");
      else toast.error(result.error || "Failed to update profile");

    } catch (err) {
      console.error(err);
      toast.error("Error updating profile. Please try again.");
    }

    setLoading(false); // ⬅ stop loading
  };

  return (
    <div className="bg-[#ffffff80] p-4 rounded-lg font-poppins">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProfileImageUpload formData={formData} setFormData={setFormData} />
        <ProfileFormLeft formData={formData} handleChange={handleChange} />
        <ProfileFormRight formData={formData} handleChange={handleChange} />
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handleClear}
          className="bg-orange-300 text-black font-bold py-2 px-6 rounded hover:bg-orange-200"
        >
          Clear
        </button>

        {/* ------------------------- */}
        {/* UPDATE BUTTON WITH LOADING */}
        {/* ------------------------- */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-orange-600 text-white font-bold py-2 px-6 rounded hover:bg-orange-400 flex items-center gap-2 disabled:opacity-70"
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
}
