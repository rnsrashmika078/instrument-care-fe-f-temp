import { fetchWithAuth } from '../utils/api';
import { API_BASE } from "../../config";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import Bg from '../../assets/images/hero-bg-5.jpg';

export default function TechnicianRegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        mobile_number: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false); // 🔹 toggle password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 🔹 toggle confirm password visibility

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleRegister = async () => {
        try {
            const response = await fetchWithAuth(
                `${API_BASE}/api/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            const result = await response.json();
            console.log("Registration Response:", result);

            // ✅ Navigate to verify-email page with user_id
            if (result.message === "User registered successfully. Verification email sent.") {
                navigate("/auth/verify-email", { state: { userId: result.user_id, email: formData.email } });
            } else {
                toast.error(result.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error("Registration failed:", err);
            toast.error("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-white p-6 rounded-2xl">

            {/* Card Container */}
            <div className="w-full max-w-2xl bg-white p-8 md:p-10">

                {/* Title */}
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 font-poppins">
                    Add Technician
                </h2>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        type="text"
                        placeholder="First Name"
                        className="input"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Last Name"
                        className="input"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="input md:col-span-2"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Phone Number"
                        className="input md:col-span-2"
                        value={formData.mobile_number}
                        onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                    />

                    {/* Password */}
                    <div className="relative md:col-span-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="input pr-10"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {/* {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} */}
                            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative md:col-span-2">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="input pr-10"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                        </button>
                    </div>

                </div>

                {/* Button */}
                <button
                    onClick={handleRegister}
                    className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition shadow-md"
                >
                    ADD TECHNICIAN
                </button>

            </div>
        </div>
    );
}
