import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
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
        setLoading(true);

        try {
            const response = await API.post("/users/login", formData);

            const { token, user } = response.data;

            // Store login information
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // Redirect according to user role
            if (user.role === "responder") {
                navigate("/responder-dashboard");
            }
            else if (user.role === "volunteer") {
                navigate("/volunteer-dashboard");
            }
            else if (
                user.role === "coordinator" ||
                user.role === "admin"
            ) {
                    navigate("/coordinator-dashboard");
            }
            else {
                navigate("/dashboard");
            }
            

        } catch (error) {
            console.error("Login error:", error);

            setMessage(
                error.response?.data?.message ||
                "Login failed. Please check your email and password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl shadow-lg p-8">

                    <div className="text-center mb-8">

                        <div className="text-5xl mb-3">
                            🚨
                        </div>

                        <h1 className="text-3xl font-bold text-slate-800">
                            Smart Response
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Emergency Response Platform
                        </p>

                    </div>

                    {message && (
                        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

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
                                placeholder="Enter your password"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                    <div className="text-center mt-6">

                        <p className="text-sm text-slate-500">
                            Don't have an account?
                        </p>

                        <button
                            onClick={() => navigate("/register")}
                            className="mt-2 text-blue-600 font-semibold hover:underline"
                        >
                            Create Account
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;