import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ReportEmergency() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        emergencyType: "",
        description: "",
        location: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

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
        setSubmitting(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await API.post(
                "/emergency-reports",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message);

            setFormData({
                emergencyType: "",
                description: "",
                location: ""
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to submit emergency report."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">

            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>
                        <h1 className="text-xl font-bold text-blue-600">
                            Smart Response
                        </h1>

                        <p className="text-xs text-slate-500">
                            Emergency Reporting System
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

            <main className="max-w-3xl mx-auto px-6 py-10">

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Report an Emergency
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Provide the details of the emergency so the
                            response team can review your report.
                        </p>
                    </div>

                    {message && (
                        <div className="mb-6 rounded-lg bg-green-100 px-4 py-3 text-green-700 text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Emergency Type */}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Emergency Type
                            </label>

                            <select
                                name="emergencyType"
                                value={formData.emergencyType}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">
                                    Select emergency type
                                </option>

                                <option value="Accident">
                                    Accident
                                </option>

                                <option value="Fire">
                                    Fire
                                </option>

                                <option value="Flood">
                                    Flood
                                </option>

                                <option value="Medical Emergency">
                                    Medical Emergency
                                </option>

                                <option value="Other Disaster">
                                    Other Disaster
                                </option>
                            </select>
                        </div>


                        {/* Description */}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="Describe what happened..."
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>


                        {/* Location */}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Emergency Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="Enter the emergency location"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>


                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-lg bg-red-500 py-3 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                        >
                            {submitting
                                ? "Submitting Report..."
                                : "Submit Emergency Report"}
                        </button>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default ReportEmergency;