import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Bg from "../../assets/images/hero-bg-5.jpg";
import { API_BASE } from "../../config";

export default function NewUserRegistration() {
  const [formData, setFormData] = useState({
    title: "",
    gender: "",
    first_name: "",
    last_name: "",
    address: "",
    institute_id: "",
    other_institute: "",
    faculty_id: "",
    department_id: "",
    designation: "",
    phone_number: "",
    mobile_number: "",
    email: "",
    password: "",
    confirm_password: "",
    technician: 0
  });

  const [institutes, setInstitutes] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]); // ✅ NEW
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTechnician, setIsTechnician] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "auto";

    // ✅ FETCH INSTITUTES
    fetch(`${API_BASE}/institutes`)
      .then((res) => res.json())
      .then((data) => {
        setInstitutes(data);
      })
      .catch((err) => {
        console.error("Failed to fetch institutes", err);
      });

    // ✅ FETCH DESIGNATIONS
    fetch(`${API_BASE}/designations`)
      .then((res) => res.json())
      .then((data) => {
        setDesignations(data);
      })
      .catch((err) => {
        console.error("Failed to fetch designations", err);
      });
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "institute_id" && value !== "" && value !== "other") {
      try {
        const res = await fetch(`${API_BASE}/faculties/${value}`);
        const data = await res.json();
        setFaculties(data);

      } catch (err) {
        console.error("Failed to fetch faculties", err);
        setFaculties([]);
      }
    }

    if (name === "institute_id" && value === "other") {
      setFaculties([]);
    }

    if (name === "faculty_id" && value !== "" && value !== "other") {
      try {
        const res = await fetch(`${API_BASE}/departments/${value}`);
        const data = await res.json();
        setDepartments(data);

      } catch (err) {
        console.error("Failed to fetch departments", err);
        setDepartments([]);
      }
    }

    if (name === "faculty_id" && value === "other") {
      setDepartments([]);
    }
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match!");
      return;
    }
    console.log("Request Body:", formData);
    try {
      const response = await fetch(
        `${API_BASE}/register-user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log(result);

      if (result.status === "success") {
        navigate("/user/dashboard");
      } else {
        setError("Registration failed. Please check your details.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again!");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-2 sm:px-4">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${Bg})` }}
      ></div>

      <div className="relative z-10 w-full max-w-6xl bg-gray-50 bg-opacity-95 shadow-2xl rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">

          <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center md:text-left">
              Register Here
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <select name="title" className="input" onChange={handleChange}>
                <option value="">Title</option>
                <option>Mr</option>
                <option>Ms</option>
                <option>Mrs</option>
                <option>Miss</option>
                <option>Eng</option>
                <option>Dr</option>
                <option>Prof</option>
              </select>

              <select name="gender" className="input" onChange={handleChange}>
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <input name="first_name" placeholder="First Name" className="input" onChange={handleChange} />
            <input name="last_name" placeholder="Last Name" className="input" onChange={handleChange} />
            <input name="address" placeholder="Address" className="input" onChange={handleChange} />
            <input name="email" type="email" placeholder="E-mail" className="input" onChange={handleChange} />
            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" className="input pr-10" onChange={handleChange} />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            <div className="relative">
              <input name="confirm_password" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" className="input pr-10" onChange={handleChange} />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>


          <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-12 bg-gray-50">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 invisible">
              Register Here
            </h2>

            <select
              name="institute_id"
              className="input"
              onChange={handleChange}
            >
              <option value="">Participated Institute</option>
              {institutes.map((inst) => (
                <option key={inst.institute_id} value={inst.institute_id}>
                  {inst.name}
                </option>
              ))}
              <option value="other">Other</option>
            </select>

            <input name="other_institute" placeholder="Other Institute" className="input" onChange={handleChange} />

            <select name="faculty_id" className="input" onChange={handleChange}>
              <option value="">Faculty (Universities only)</option>
              {
                faculties.length > 0 ? (
                  faculties.map((fac) => (
                    <option key={fac.faculty_id} value={fac.faculty_id}>{fac.faculty_name}</option>
                  ))
                ) : (
                  <option disabled>No faculties found</option>
                )
              }
            </select>

            <select name="department_id" className="input" onChange={handleChange}>
              <option value="">Department / Division</option>
              {
                departments.length > 0 ? (
                  departments.map((dep) => (
                    <option key={dep.department_id} value={dep.department_id}>{dep.department_name}</option>
                  ))
                ) : (
                  <option disabled>No departments found</option>
                )
              }
            </select>

            <select name="designation" className="input" onChange={handleChange}>
              <option value="">Designation</option>
              {designations.map((des) => (
                <option key={des.designation_id} value={des.name}>
                  {des.name}
                </option>
              ))}
            </select>

            <input name="phone_number" placeholder="Phone Number" className="input" onChange={handleChange} />
            <input name="mobile_number" placeholder="Mobile Number" className="input" onChange={handleChange} />
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={isTechnician}
                onChange={(e) => setIsTechnician(e.target.checked)}
              />
              Are you a Technician?
            </label>
          </div>
        </div>



        <div className="w-full px-5 sm:px-8 md:px-12 py-6 bg-gray-50 flex flex-col items-center gap-3">
          {error && (
            <div className="w-full sm:w-1/2 p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md text-center">
              {error}
            </div>
          )}

          <button
            className="w-full sm:w-1/2 bg-orange-400 text-white py-3 rounded-md text-lg font-semibold hover:bg-orange-500 transition"
            onClick={handleRegister}
          >
            Register
          </button>

          <Link to="/auth/login" className="text-sm text-blue-600 hover:underline">
            Already have an account? Sign In
          </Link>
        </div>
      </div>

      <style>
        {`
          .input {
            width: 100%;
            margin-bottom: 1rem;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 0.95rem;
          }
        `}
      </style>
    </div>
  );
}
