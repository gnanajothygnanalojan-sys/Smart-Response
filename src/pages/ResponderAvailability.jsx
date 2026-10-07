import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ResponderAvailability() {
    const navigate = useNavigate();

    const [responder, setResponder] = useState(null);
    const [availability, setAvailability] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadResponder();
    }, []);

    const loadResponder = async () => {
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

            const data = response.data.responder;

            setResponder(data);
            setAvailability(data.availability);

        } catch (error) {
            console.error("Failed to load responder:", error);

            setMessage(
                error.response?.data?.message ||
                "Unable to load responder information."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAvailability = async (newAvailability) => {
        try {
            setSaving(true);
            setMessage("");

            const token = localStorage.getItem("token");

            await API.put(
                `/responders/${responder._id}`,
                {
                    availability: newAvailability
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAvailability(newAvailability);

            setResponder({
                ...responder,
                availability: newAvailability
            });

            setMessage("Availability updated successfully.");

        } catch (error) {
            console.error("Update availability error:", error);

            setMessage(
                error.response?.data?.message ||
                "Failed to update availability."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <p className="text-slate-500">
                    Loading availability...
                </p>
            </div>
        );
    }

    if (!responder) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                    <h2 className="text-xl font-bold text-slate-800">
                        Responder profile not found
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Please contact the coordinator.
                    </p>

                    <button
                        onClick={() => navigate("/responder-dashboard")}
                        className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                        Back to Dashboard
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
                            Responder Availability
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


            {/* Main */}

            <main className="max-w-5xl mx-auto px-6 py-8">

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

                    <div className="mb-8">

                        <h2 className="text-2xl font-bold text-slate-800">
                            Manage Availability
                        </h2>

                        <p className="text-slate-500 mt-2">
                            Update your current availability for emergency assignments.
                        </p>

                    </div>


                    {/* Responder Details */}

                    <div className="bg-slate-50 rounded-xl p-5 mb-8">

                        <h3 className="font-semibold text-slate-800 mb-4">
                            Responder Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div>
                                <p className="text-xs text-slate-500">
                                    Name
                                </p>

                                <p className="font-semibold text-slate-800 mt-1">
                                    {responder.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Department
                                </p>

                                <p className="font-semibold text-slate-800 mt-1">
                                    {responder.department}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Current Status
                                </p>

                                <p className="font-semibold text-slate-800 mt-1">
                                    {availability}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Message */}

                    {message && (
                        <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
                            {message}
                        </div>
                    )}


                    {/* Availability Options */}

                    <div>

                        <h3 className="font-semibold text-slate-800 mb-4">
                            Set Your Availability
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* Available */}

                            <button
                                onClick={() =>
                                    handleUpdateAvailability("Available")
                                }
                                disabled={saving}
                                className={`rounded-xl border-2 p-5 text-left transition ${
                                    availability === "Available"
                                        ? "border-green-500 bg-green-50"
                                        : "border-slate-200 bg-white hover:border-green-300"
                                }`}
                            >

                                <div className="text-3xl mb-3">
                                    🟢
                                </div>

                                <h4 className="font-bold text-slate-800">
                                    Available
                                </h4>

                                <p className="text-sm text-slate-500 mt-1">
                                    Ready to receive emergency assignments.
                                </p>

                            </button>


                            {/* Unavailable */}

                            <button
                                onClick={() =>
                                    handleUpdateAvailability("Unavailable")
                                }
                                disabled={saving}
                                className={`rounded-xl border-2 p-5 text-left transition ${
                                    availability === "Unavailable"
                                        ? "border-red-500 bg-red-50"
                                        : "border-slate-200 bg-white hover:border-red-300"
                                }`}
                            >

                                <div className="text-3xl mb-3">
                                    🔴
                                </div>

                                <h4 className="font-bold text-slate-800">
                                    Unavailable
                                </h4>

                                <p className="text-sm text-slate-500 mt-1">
                                    Not available for new emergency assignments.
                                </p>

                            </button>


                            {/* On Duty */}

                            <button
                                onClick={() =>
                                    handleUpdateAvailability("On Duty")
                                }
                                disabled={saving}
                                className={`rounded-xl border-2 p-5 text-left transition ${
                                    availability === "On Duty"
                                        ? "border-orange-500 bg-orange-50"
                                        : "border-slate-200 bg-white hover:border-orange-300"
                                }`}
                            >

                                <div className="text-3xl mb-3">
                                    🟠
                                </div>

                                <h4 className="font-bold text-slate-800">
                                    On Duty
                                </h4>

                                <p className="text-sm text-slate-500 mt-1">
                                    Currently responding to an emergency.
                                </p>

                            </button>

                        </div>

                    </div>


                    {saving && (
                        <p className="text-sm text-slate-500 mt-5">
                            Updating availability...
                        </p>
                    )}

                </div>

            </main>

        </div>
    );
}

export default ResponderAvailability;