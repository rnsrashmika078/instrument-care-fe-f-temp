import React, { useState, useEffect } from "react";
import profileImage from '../../assets/images/profile-image.jpeg';

export default function ProfileImageUpload({ formData, setFormData, handleChange }) {
  const [previewImage, setPreviewImage] = useState(profileImage);

  const safeHandleChange = handleChange || ((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  });

  useEffect(() => {
    if (formData.profileImagePreview) {
      setPreviewImage(formData.profileImagePreview);
    }
  }, [formData.profileImagePreview]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewImage(ev.target.result);

        setFormData({
          ...formData,
          profileImage: file,
          profileImagePreview: ev.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("profileImageInput").click();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="border rounded-full flex items-center justify-center mb-2">
        <img
          src={previewImage}
          alt="Profile"
          className="h-28 w-28 rounded-full object-cover cursor-pointer border border-gray-300 hover:scale-105 transition-transform"
          onClick={triggerFileInput}
        />
      </div>

      <p className="text-sm text-gray-500">Browse Image From your computer</p>
      <button
        className="mt-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-400"
        onClick={triggerFileInput}
      >
        Upload Image
      </button>

      <input
        type="file"
        id="profileImageInput"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      <div className="flex flex-col gap-3 mt-4">
        <label>
          Full Name *
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={safeHandleChange}
            className="border rounded p-1 w-full font-normal bg-gray-200 
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </label>

        <label>
          National Identity Card Number *
          <input
            type="text"
            name="nic"
            value={formData.nic}
            onChange={safeHandleChange}
            className="border rounded p-1 w-full font-normal bg-gray-200 
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </label>

        <label>
          Email Address *
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={safeHandleChange}
            className="border rounded p-1 w-full font-normal bg-gray-200 
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </label>

        <label>
          Physical Address *
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={safeHandleChange}
            className="border rounded p-1 w-full font-normal bg-gray-200 
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </label>

        <label>
          Mobile Number *
          <input
            type="text"
            name="personalNumber"
            value={formData.personalNumber}
            onChange={safeHandleChange}
            className="border rounded p-1 w-full font-normal bg-gray-200 
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </label>

        <label>
          Profile Bio *
          <textarea
            name="bio"
            value={formData.bio}
            onChange={safeHandleChange}
            className="border rounded p-5 w-full font-normal bg-gray-200 
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </label>
      </div>
    </div>
  );
}
