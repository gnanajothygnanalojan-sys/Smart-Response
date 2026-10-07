import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ResponderProfile() {
    const navigate = useNavigate();

    const [responder, setResponder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadResponderProfile();
    }, []);

    const loadResponderProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await API.get("/responders/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setResponder(response.data.responder);

        } catch (error) {
            console.error("Failed to load responder profile:", error);

            setMessage(
                error.response?.data?.message ||
                "Unable to load responder profile."
            );
        } finally {
            setLoading(false);
        }
    };

    const getAvailabilityStyle = (availability) => {
        if (availability === "Available") {
            return "bg-green-100 text-green-700";
        }

        if (availability === "On Duty") {
            return "bg-orange-100 text-orange-700";
        }

        return "bg-red-100 text-red-700";
    };

    const getStatusStyle = (status) => {
        if (status === "Active") {
            return "bg-green-100 text-green-700";
        }

        return "bg-red-100 text-red-700";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <p className="text-slate-500">
                    Loading responder profile...
                </p>
            </div>
        );
    }

    if (!responder) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-md w-full">

                    <div className="text-5xl mb-4">
                        ⚠️
                    </div>

                    <h2 className="text-xl font-bold text-slate-800">
                        Responder Profile Not Found
                    </h2>

                    <p className="text-slate-500 mt-2">
                        {message || "Your responder profile could not be found."}
                    </p>

                    <button
                        onClick={() => navigate("/responder-dashboard")}
                        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        ← Responder Dashboard
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Header */}

            <header className="bg-white border-b border-slate-200">

                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-800">
                            🚨 Smart Response
                        </h1>

                        <p className="text-sm text-slate-500">
                            Responder Portal
                        </p>

                    </div>

                    <button
                        onClick={() => navigate("/responder-dashboard")}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        ← Dashboard
                    </button>

                </div>

            </header>


            {/* Main Content */}

            <main className="max-w-5xl mx-auto px-6 py-8">

                {/* Page Title */}

                <div className="mb-8">

                    <p className="text-sm text-blue-600 font-semibold">
                        RESPONDER ACCOUNT
                    </p>

                    <h2 className="text-3xl font-bold text-slate-800 mt-1">
                        My Profile
                    </h2>

                    <p className="text-slate-500 mt-2">
                        View your responder account and professional information.
                    </p>

                </div>


                {/* Profile Header Card */}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">

                    <div className="flex flex-col md:flex-row md:items-center gap-6">

                        {/* Avatar */}

                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
                            👤
                        </div>


                        {/* Name */}

                        <div className="flex-1">

                            <h3 className="text-2xl font-bold text-slate-800">
                                {responder.name}
                            </h3>

                            <p className="text-slate-500 mt-1">
                                {responder.department}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                        responder.status
                                    )}`}
                                >
                                    {responder.status}
                                </span>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityStyle(
                                        responder.availability
                                    )}`}
                                >
                                    {responder.availability}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Personal Information */}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">

                    <h3 className="text-xl font-bold text-slate-800 mb-6">
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                        {/* Full Name */}

                        <div>

                            <p className="text-sm text-slate-500 mb-1">
                                Full Name
                            </p>

                            <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                                <p className="font-medium text-slate-800">
                                    {responder.name}
                                </p>
                            </div>

                        </div>


                        {/* Email */}

                        <div>

                            <p className="text-sm text-slate-500 mb-1">
                                Email Address
                            </p>

                            <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                                <p className="font-medium text-slate-800">
                                    {responder.email}
                                </p>
                            </div>

                        </div>


                        {/* Phone */}

                        <div>

                            <p className="text-sm text-slate-500 mb-1">
                                Phone Number
                            </p>

                            <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                                <p className="font-medium text-slate-800">
                                    {responder.phone}
                                </p>
                            </div>

                        </div>


                        {/* Department */}

                        <div>

                            <p className="text-sm text-slate-500 mb-1">
                                Department
                            </p>

                            <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                                <p className="font-medium text-slate-800">
                                    {responder.department}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>


                {/* Responder Information */}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">

                    <h3 className="text-xl font-bold text-slate-800 mb-6">
                        Responder Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                        {/* Availability */}

                        <div>

                            <p className="text-sm text-slate-500 mb-2">
                                Current Availability
                            </p>

                            <span
                                className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getAvailabilityStyle(
                                    responder.availability
                                )}`}
                            >
                                {responder.availability}
                            </span>

                        </div>


                        {/* Account Status */}

                        <div>

                            <p className="text-sm text-slate-500 mb-2">
                                Account Status
                            </p>

                            <span
                                className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getStatusStyle(
                                    responder.status
                                )}`}
                            >
                                {responder.status}
                            </span>

                        </div>


                        {/* Role */}

                        <div>

                            <p className="text-sm text-slate-500 mb-2">
                                System Role
                            </p>

                            <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
                                <p className="font-semibold text-blue-700">
                                    Emergency Responder
                                </p>
                            </div>

                        </div>


                        {/* Responder ID */}

                        <div>

                            <p className="text-sm text-slate-500 mb-2">
                                Responder ID
                            </p>

                            <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">

                                <p className="font-mono text-xs text-slate-600 break-all">
                                    {responder._id}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Actions */}

                <div className="flex flex-col sm:flex-row gap-4">

                    <button
                        onClick={() => navigate("/responder-availability")}
                        className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        🟢 Manage Availability
                    </button>

                    <button
                        onClick={() => navigate("/responder-dashboard")}
                        className="flex-1 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </main>

        </div>
    );
}

export default ResponderProfile;