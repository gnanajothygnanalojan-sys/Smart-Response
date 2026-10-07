import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ResponderAssignments() {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [responders, setResponders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedResponder, setSelectedResponder] = useState("");


    const getToken = () => {
        return localStorage.getItem("token");
    };


    // Fetch emergency reports
    const fetchReports = async () => {
        try {
            const token = getToken();

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await API.get(
                "/emergency-reports/my-reports",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setReports(response.data.reports || []);

        } catch (error) {
            console.error(
                "Report loading error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load emergency reports."
            );
        }
    };


    // Fetch responders
    const fetchResponders = async () => {
        try {
            const token = getToken();

            const response = await API.get(
                "/responders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setResponders(
                response.data.responders || []
            );

        } catch (error) {
            console.error(
                "Responder loading error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load responders."
            );
        }
    };


    // Load data
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchReports(),
                fetchResponders()
            ]);

            setLoading(false);
        };

        loadData();
    }, []);


    // Open assignment
    const handleOpenAssignment = (report) => {

        setSelectedReport(report);
        setSelectedResponder("");
        setError("");
        setSuccess("");
    };


    // Assign responder
    const handleAssign = async () => {

        if (!selectedResponder) {
            setError(
                "Please select a responder."
            );
            return;
        }

        try {

            const token = getToken();

            await API.put(
                `/emergency-reports/${selectedReport._id}/assign`,
                {
                    responderId: selectedResponder
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess(
                "Responder assigned successfully."
            );

            setSelectedReport(null);
            setSelectedResponder("");

            await Promise.all([
                fetchReports(),
                fetchResponders()
            ]);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to assign responder."
            );
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">

                <p className="text-slate-600">
                    Loading assignments...
                </p>

            </div>
        );
    }


    // Only available responders
    const availableResponders =
        responders.filter(
            (responder) =>
                responder.status === "Active" &&
                responder.availability === "Available"
        );


    return (
        <div className="min-h-screen bg-slate-100">


            {/* Navigation */}

            <nav className="bg-white border-b border-slate-200">

                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>

                        <h1 className="text-xl font-bold text-blue-600">
                            Smart Response
                        </h1>

                        <p className="text-xs text-slate-500">
                            Responder Assignment
                        </p>

                    </div>


                    <button
                        onClick={() => navigate("/responder-dashboard")}
                        className="text-sm font-medium text-slate-600 hover:text-blue-600"
                    >
                        ← Dashboard
                    </button>

                </div>

            </nav>


            {/* Main Content */}

            <main className="max-w-7xl mx-auto px-6 py-10">


                {/* Header */}

                <div className="mb-8">

                    <h2 className="text-3xl font-bold text-slate-800">
                        Responder Assignment
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Assign available responders to emergency reports.
                    </p>

                </div>


                {/* Messages */}

                {error && (
                    <div className="mb-5 rounded-lg bg-red-100 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}


                {success && (
                    <div className="mb-5 rounded-lg bg-green-100 border border-green-200 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}


                {/* Statistics */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">


                    <div className="bg-white rounded-2xl border border-slate-200 p-6">

                        <p className="text-sm text-slate-500">
                            Total Reports
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-800">
                            {reports.length}
                        </p>

                    </div>


                    <div className="bg-white rounded-2xl border border-slate-200 p-6">

                        <p className="text-sm text-slate-500">
                            Available Responders
                        </p>

                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {availableResponders.length}
                        </p>

                    </div>


                    <div className="bg-white rounded-2xl border border-slate-200 p-6">

                        <p className="text-sm text-slate-500">
                            Assigned Reports
                        </p>

                        <p className="mt-2 text-3xl font-bold text-blue-600">
                            {
                                reports.filter(
                                    (report) =>
                                        report.status === "Assigned"
                                ).length
                            }
                        </p>

                    </div>

                </div>


                {/* Emergency Reports */}

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                    <div className="px-6 py-5 border-b border-slate-200">

                        <h3 className="text-lg font-bold text-slate-800">
                            Emergency Reports
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                            Select a report to assign an available responder.
                        </p>

                    </div>


                    {reports.length === 0 ? (

                        <div className="p-10 text-center">

                            <div className="text-4xl mb-4">
                                📋
                            </div>

                            <h3 className="font-semibold text-slate-800">
                                No Emergency Reports
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                No emergency reports are currently available.
                            </p>

                        </div>

                    ) : (

                        <div className="divide-y divide-slate-100">

                            {reports.map((report) => (

                                <div
                                    key={report._id}
                                    className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                                >

                                    <div className="flex-1">

                                        <div className="flex flex-wrap items-center gap-3">

                                            <h4 className="font-semibold text-slate-800">
                                                {report.emergencyType}
                                            </h4>

                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                                {report.status}
                                            </span>

                                        </div>


                                        <p className="mt-2 text-sm text-slate-600">
                                            {report.description}
                                        </p>


                                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">

                                            <span>
                                                📍 {report.location}
                                            </span>

                                            <span>
                                                🕒 {
                                                    new Date(
                                                        report.createdAt
                                                    ).toLocaleString()
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    <div>

                                        {report.status === "Reported" ||
                                        report.status === "Under Review" ? (

                                            <button
                                                onClick={() =>
                                                    handleOpenAssignment(
                                                        report
                                                    )
                                                }
                                                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                                            >
                                                Assign Responder
                                            </button>

                                        ) : (

                                            <span className="text-sm text-slate-500">
                                                {report.status}
                                            </span>

                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>


            </main>


            {/* Assignment Modal */}

            {selectedReport && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">

                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">


                        <div className="flex items-start justify-between">

                            <div>

                                <h3 className="text-xl font-bold text-slate-800">
                                    Assign Responder
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Select an available responder for this emergency.
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    setSelectedReport(null)
                                }
                                className="text-slate-400 hover:text-slate-700 text-xl"
                            >
                                ✕
                            </button>

                        </div>


                        {/* Report Information */}

                        <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">

                            <p className="text-xs text-slate-400">
                                Emergency Type
                            </p>

                            <p className="mt-1 font-semibold text-slate-800">
                                {selectedReport.emergencyType}
                            </p>


                            <p className="mt-4 text-xs text-slate-400">
                                Location
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                                {selectedReport.location}
                            </p>

                        </div>


                        {/* Responder Selection */}

                        <div className="mt-6">

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Available Responder
                            </label>


                            {availableResponders.length === 0 ? (

                                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">

                                    <p className="text-sm text-yellow-700">
                                        No responders are currently available.
                                    </p>

                                </div>

                            ) : (

                                <select
                                    value={selectedResponder}
                                    onChange={(event) =>
                                        setSelectedResponder(
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                                >

                                    <option value="">
                                        Select a responder
                                    </option>

                                    {availableResponders.map(
                                        (responder) => (

                                            <option
                                                key={responder._id}
                                                value={responder._id}
                                            >
                                                {responder.name} -{" "}
                                                {responder.department}
                                            </option>

                                        )
                                    )}

                                </select>

                            )}

                        </div>


                        {/* Buttons */}

                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={handleAssign}
                                disabled={
                                    availableResponders.length === 0
                                }
                                className="flex-1 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                Assign Responder
                            </button>


                            <button
                                onClick={() =>
                                    setSelectedReport(null)
                                }
                                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default ResponderAssignments;