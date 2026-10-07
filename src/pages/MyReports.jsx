import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyReports() {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);

    const statuses = [
        "Reported",
        "Under Review",
        "Assigned",
        "In Progress",
        "Resolved",
        "Closed"
    ];

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem("token");

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
            setError(
                error.response?.data?.message ||
                "Failed to load reports."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this report?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await API.delete(
                `/emergency-reports/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setReports(
                reports.filter((report) => report._id !== id)
            );

            if (selectedReport?._id === id) {
                setSelectedReport(null);
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete report."
            );
        }
    };

    const getStatusIndex = (status) => {
        return statuses.indexOf(status);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Reported":
                return "bg-blue-100 text-blue-700";

            case "Under Review":
                return "bg-yellow-100 text-yellow-700";

            case "Assigned":
                return "bg-purple-100 text-purple-700";

            case "In Progress":
                return "bg-orange-100 text-orange-700";

            case "Resolved":
                return "bg-green-100 text-green-700";

            case "Closed":
                return "bg-slate-200 text-slate-700";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Loading reports...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Navigation */}

            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>
                        <h1 className="text-xl font-bold text-blue-600">
                            Smart Response
                        </h1>

                        <p className="text-xs text-slate-500">
                            Citizen Report Tracking
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


            <main className="max-w-6xl mx-auto px-6 py-10">

                {/* Page Header */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">
                            My Reports
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Track the emergency reports you have submitted.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/report-emergency")}
                        className="rounded-lg bg-red-500 px-5 py-3 text-sm font-semibold text-white hover:bg-red-600"
                    >
                        + New Report
                    </button>

                </div>


                {/* Error */}

                {error && (
                    <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-red-700 text-sm">
                        {error}
                    </div>
                )}


                {/* No Reports */}

                {reports.length === 0 ? (

                    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

                        <div className="text-4xl mb-4">
                            📋
                        </div>

                        <h3 className="text-lg font-semibold text-slate-800">
                            No Reports Yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            You have not submitted any emergency reports.
                        </p>

                        <button
                            onClick={() => navigate("/report-emergency")}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Report an Emergency
                        </button>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {reports.map((report) => {

                            const currentStatus =
                                getStatusIndex(report.status);

                            return (
                                <div
                                    key={report._id}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                                >

                                    {/* Report Header */}

                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                                        <div>

                                            <div className="flex flex-wrap items-center gap-3">

                                                <h3 className="text-lg font-semibold text-slate-800">
                                                    {report.emergencyType}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(report.status)}`}
                                                >
                                                    {report.status}
                                                </span>

                                            </div>

                                            <p className="mt-3 text-sm text-slate-600">
                                                {report.description}
                                            </p>

                                        </div>

                                        <div className="flex gap-2">

                                            <button
                                                onClick={() =>
                                                    setSelectedReport(report)
                                                }
                                                className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                                            >
                                                Track
                                            </button>

                                            {report.status === "Reported" && (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(report._id)
                                                    }
                                                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            )}

                                        </div>

                                    </div>


                                    {/* Status Progress */}

                                    <div className="mt-6 border-t border-slate-100 pt-6">

                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                                            Report Progress
                                        </p>

                                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">

                                            {statuses.map((status, index) => (

                                                <div
                                                    key={status}
                                                    className="text-center"
                                                >

                                                    <div
                                                        className={`mx-auto h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                                            index <= currentStatus
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-slate-200 text-slate-500"
                                                        }`}
                                                    >
                                                        {index + 1}
                                                    </div>

                                                    <p
                                                        className={`mt-2 text-xs ${
                                                            index <= currentStatus
                                                                ? "text-blue-600 font-medium"
                                                                : "text-slate-400"
                                                        }`}
                                                    >
                                                        {status}
                                                    </p>

                                                </div>

                                            ))}

                                        </div>

                                    </div>


                                    {/* Report Information */}

                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-5">

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Location
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                {report.location}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Submitted
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                {new Date(
                                                    report.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </main>


            {/* Report Details Modal */}

            {selectedReport && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">

                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">

                        <div className="flex items-center justify-between">

                            <h3 className="text-xl font-bold text-slate-800">
                                Report Details
                            </h3>

                            <button
                                onClick={() => setSelectedReport(null)}
                                className="text-slate-400 hover:text-slate-700 text-xl"
                            >
                                ×
                            </button>

                        </div>


                        <div className="mt-6 space-y-4">

                            <div>
                                <p className="text-xs text-slate-400">
                                    Emergency Type
                                </p>

                                <p className="mt-1 font-semibold text-slate-800">
                                    {selectedReport.emergencyType}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs text-slate-400">
                                    Current Status
                                </p>

                                <span
                                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(selectedReport.status)}`}
                                >
                                    {selectedReport.status}
                                </span>
                            </div>


                            <div>
                                <p className="text-xs text-slate-400">
                                    Description
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {selectedReport.description}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs text-slate-400">
                                    Location
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {selectedReport.location}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs text-slate-400">
                                    Submitted
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {new Date(
                                        selectedReport.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>

                        </div>


                        <button
                            onClick={() => setSelectedReport(null)}
                            className="mt-6 w-full rounded-lg bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-900"
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default MyReports;