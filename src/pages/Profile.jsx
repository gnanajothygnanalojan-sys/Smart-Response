import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Get profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await API.get("/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const profile = response.data.user;

                setUser(profile);

                setFormData({
                    name: profile.name,
                    phone: profile.phone
                });

            } catch (error) {
                console.error("Profile loading error:", error);

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Update profile
    const handleUpdate = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setUpdating(true);

        try {
            const token = localStorage.getItem("token");

            const response = await API.put(
                "/users/profile",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message);
            setUser(response.data.user);

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update profile."
            );
        } finally {
            setUpdating(false);
        }
    };

    // Deactivate account
    const handleDeactivate = async () => {
        const confirmDeactivate = window.confirm(
            "Are you sure you want to deactivate your account?"
        );

        if (!confirmDeactivate) {
            return;
        }

        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            await API.put(
                "/users/deactivate",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/login");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to deactivate account."
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Loading profile...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Navigation */}
            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>
                        <h1 className="text-xl font-bold text-blue-600">
                            Smart Response
                        </h1>

                        <p className="text-xs text-slate-500">
                            Citizen Profile
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-sm font-medium text-slate-600 hover:text-blue-600"
                    >
                        ← Dashboard
                    </button>

                </div>
            </nav>

            {/* Profile Content */}
            <main className="max-w-3xl mx-auto px-6 py-10">

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">
                            My Profile
                        </h2>

                        <p className="mt-1 text-slate-500">
                            View and update your account information.
                        </p>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="mb-5 rounded-lg bg-green-100 px-4 py-3 text-green-700 text-sm">
                            {message}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-6">

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
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Email - Read Only */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
                            />

                            <p className="mt-1 text-xs text-slate-400">
                                Email cannot be changed from this page.
                            </p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Account Role
                            </label>

                            <input
                                type="text"
                                value={user?.role || ""}
                                disabled
                                className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 capitalize"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Account Status
                            </label>

                            <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 capitalize">
                                {user?.status}
                            </span>
                        </div>

                        {/* Update Button */}
                        <button
                            type="submit"
                            disabled={updating}
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {updating ? "Saving Changes..." : "Save Changes"}
                        </button>

                    </form>

                    {/* Danger Zone */}
                    <div className="mt-10 border-t border-slate-200 pt-8">

                        <h3 className="text-lg font-semibold text-red-600">
                            Account Deactivation
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Deactivate your account if you no longer want
                            to use Smart Response.
                        </p>

                        <button
                            onClick={handleDeactivate}
                            className="mt-4 rounded-lg border border-red-300 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                            Deactivate Account
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Profile;