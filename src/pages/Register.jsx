import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "citizen",
        department: "",
        skills: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await API.post(
                "/users/register",
                formData
            );

            setMessage(
                "Registration successful! You can now login."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error("Registration error:", error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-lg">

                <div className="bg-white rounded-2xl shadow-lg p-8">

                    {/* Header */}
                    <div className="text-center mb-7">

                        <div className="text-5xl mb-3">
                            🚨
                        </div>

                        <h1 className="text-3xl font-bold text-slate-800">
                            Smart Response
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Create your account
                        </p>

                    </div>


                    {/* Success Message */}
                    {message && (
                        <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                            {message}
                        </div>
                    )}


                    {/* Error Message */}
                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Name */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                            />

                        </div>


                        {/* Email */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                            />

                        </div>


                        {/* Phone */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Phone Number
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="Enter your phone number"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                            />

                        </div>


                        {/* Password */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Create a password"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                            />

                        </div>


                        {/* Role */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Register As
                            </label>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 bg-white focus:border-blue-500 focus:outline-none"
                            >

                                <option value="citizen">
                                    Citizen
                                </option>

                                <option value="responder">
                                    Responder
                                </option>

                                <option value="volunteer">
                                    Volunteer
                                </option>

                                <option value="coordinator">
                                    Coordinator
                                </option>

                            </select>

                        </div>


                        {/* Responder Department */}
                        {formData.role === "responder" && (
                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Department
                                </label>

                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Fire & Rescue"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                                />

                            </div>
                        )}


                        {/* Volunteer Skills */}
                        {formData.role === "volunteer" && (
                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Skills
                                </label>

                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. First Aid, Driving"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                                />

                            </div>
                        )}


                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>


                    {/* Login */}
                    <div className="text-center mt-6">

                        <p className="text-sm text-slate-500">
                            Already have an account?
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            className="mt-2 text-blue-600 font-semibold hover:underline"
                        >
                            Login
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;