import React from "react";

export default function ProfileFormRight({ formData, handleChange }) {
  return (
    <div className="flex flex-col gap-3">
      <h5 className="font-bold">Experiences</h5>
      <label className="pl-4">
        Company Name
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          className="border rounded p-1 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </label>

      <label className="pl-4">
        Designation
        <input
          type="text"
          name="company_designation"
          value={formData.company_designation}
          onChange={handleChange}
          className="border rounded p-1 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </label>

      <label className="pl-4">
        Years of Experience
        <input
          type="number"
          name="years_of_experience"
          value={formData.years_of_experience}
          onChange={handleChange}
          className="border rounded p-1 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
        
      </label>


      <h5 className="font-bold">Certificates</h5>

      <label className="pl-4">
        Certificate Name
        <input
          type="text"
          name="certificate_name"
          value={formData.certificate_name}
          onChange={handleChange}
          className="border rounded p-1 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </label>

      <label className="pl-4">
        Certificate Issued Year
        <input
          type="date"
          name="certificate_issued_year"
          value={formData.certificate_issued_year}
          onChange={handleChange}
          className="border rounded p-1 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </label>

      <label className="pl-4">
        Certificate Verification Code
        <input
          type="text"
          name="certificate_verification_code"
          value={formData.certificate_verification_code}
          onChange={handleChange}
          className="border rounded p-1 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </label>

      <h5 className="font-bold">Other Details</h5>

      <label className="pl-4">
        Guarantee for Service
        <input
          type="text"
          name="guarantee_for_service"
          value={formData.guarantee_for_service}
          onChange={handleChange}
          className="border rounded p-2 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </label>

      <label className="pl-4">
        Additional Comment ( if any)
        <input
          type="text"
          name="additional_comment"
          value={formData.additional_comment}
          onChange={handleChange}
          className="border rounded p-2 w-full bg-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </label>
    </div>
  );
}
