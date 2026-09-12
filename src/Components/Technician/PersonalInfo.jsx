import React, { useState, useEffect } from "react";
import profileImage from "../../assets/images/profile-image.jpeg";
import { API_BASE } from "../../config";
import { toast } from "react-toastify";

export default function PersonalInfo() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nic: "",
    address: "",
    mobileNumber: "",
    phoneNumber: "",
    email: "",
    institute_name: "",
    designation: "",
    supervisor_name: "",
    supervisor_Designation: "",
    supervisor_Email: "",
    supervisor_Contact_No: "",
    picture: null,
    profileImage: null,
    profileImagePreview: null,
    gender: "",
    title: "",
    initials: "",
    district: "",
  });

  const userId = sessionStorage.getItem("user_id");
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
          institute_name: data.institute_name || "",
          designation: data.designation || "",
          supervisor_name: data.supervisor_name || "",
          supervisor_Designation: data.supervisor_designation || "",
          supervisor_Email: data.supervisor_email || "",
          supervisor_Contact_No: data.supervisor_contact_no || "",
          picture: data.picture ? `${API_BASE}/${data.picture}` : null,
          gender: data.gender || "",
          title: data.title || "",
          initials: data.name_with_initials || "",
          district: data.district || "",
        }));

      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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


  const handleSubmit = async () => {
    try {
      setLoading(true);

      const form = new FormData();

      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("nic", formData.nic);
      form.append("address", formData.address);
      form.append("phoneNumber", formData.phoneNumber);
      form.append("mobileNumber", formData.mobileNumber);
      form.append("email", formData.email);
      form.append("institute_name", formData.institute_name);
      form.append("designation", formData.designation);
      form.append("supervisor_name", formData.supervisor_name);
      form.append("supervisor_Designation", formData.supervisor_Designation);
      form.append("supervisor_Email", formData.supervisor_Email);
      form.append("supervisor_Contact_No", formData.supervisor_Contact_No);
      form.append("gender", formData.gender);
      form.append("title", formData.title);
      form.append("initials", formData.initials);
      form.append("district", formData.district);

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
        toast.success("Profile updated successfully");
      } else {
        toast.error(result.error || "Update failed");
        console.error("❌ API Error:", result);
      }

    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#ffffff80] shadow-md rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Personal Information</h2>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="">Select Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Miss">Miss</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name with Initials</label>
          <input
            type="text"
            name="initials"
            value={formData.initials}
            onChange={handleChange}
            className="input w-full"
            placeholder="N.M.Perera"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName + " " + formData.lastName}
            onChange={handleChange}
            disabled
            className="input w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">NIC Number</label>
          <input
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            className="input w-full"
            maxLength="12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="input w-full"
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
        </div>

        {/* Mobile Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Phone</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="input w-full"
            maxLength="10"
            placeholder="07XXXXXXXX"
          />
        </div>

        {/* Office Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Land Line Phone</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="input w-full"
            maxLength="10"
            placeholder="0XXXXXXXXX"
          />
        </div>

        {/* Email - Disabled */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled
            className="input w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="md:col-span-2">
          <h3 className="font-semibold text-lg text-gray-800 mt-6">Institute Details</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Institute Name</label>
          <input
            type="text"
            name="institute_name"
            value={formData.institute_name}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        {/* Supervisor Details Header */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-lg text-gray-800 mt-6">Supervisor Details</h3>
        </div>

        {/* Supervisor Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="supervisor_name"
            value={formData.supervisor_name}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        {/* Supervisor Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
          <input
            type="text"
            name="supervisor_Designation"
            value={formData.supervisor_Designation}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        {/* Supervisor Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="supervisor_Email"
            value={formData.supervisor_Email}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        {/* Supervisor Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
          <input
            type="text"
            name="supervisor_Contact_No"
            value={formData.supervisor_Contact_No}
            onChange={handleChange}
            className="input w-full"
            maxLength={10}
          />
        </div>



      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-500 flex items-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Updating..." : "Update Personal Info"}
        </button>
      </div>
    </div>
  );
}