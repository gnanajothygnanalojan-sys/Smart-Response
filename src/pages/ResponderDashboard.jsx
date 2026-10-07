import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ResponderDashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [responder, setResponder] = useState(null);

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(storedUser);

        // Prevent citizens from opening responder dashboard
        if (parsedUser.role !== "responder") {
            navigate("/dashboard");
            return;
        }

        setUser(parsedUser);

        fetchResponder();

    }, []);

    const fetchResponder = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get("/responders/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setResponder(response.data.responder);

        } catch (error) {

            console.error(
                "Failed to load responder information:",
                error
            );

        }
    };

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">
                    Loading...
                </p>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-slate-100">

            {/* Header */}

            <header className="bg-white border-b border-slate-200">

                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-800">
                            🚨 Smart Response
                        </h1>

                        <p className="text-sm text-slate-500">
                            Responder Portal
                        </p>

                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* Main Content */}

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Welcome */}

                <div className="bg-blue-600 rounded-2xl p-6 text-white mb-8">

                    <p className="text-blue-100 text-sm">
                        Responder Dashboard
                    </p>

                    <h2 className="text-3xl font-bold mt-1">
                        Welcome, {user.name}
                    </h2>

                    <p className="mt-2 text-blue-100">
                        Manage your emergency assignments and response activities.
                    </p>

                </div>


                {/* Responder Information */}

                {responder && (

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">

                        <div className="flex items-center justify-between mb-5">

                            <h3 className="text-xl font-bold text-slate-800">
                                Responder Information
                            </h3>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    responder.availability === "Available"
                                        ? "bg-green-100 text-green-700"
                                        : responder.availability === "On Duty"
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-slate-100 text-slate-600"
                                }`}
                            >
                                {responder.availability}
                            </span>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div className="bg-slate-50 rounded-lg p-4">

                                <p className="text-xs text-slate-500">
                                    Department
                                </p>

                                <p className="font-semibold text-slate-800 mt-1">
                                    {responder.department}
                                </p>

                            </div>

                            <div className="bg-slate-50 rounded-lg p-4">

                                <p className="text-xs text-slate-500">
                                    Phone
                                </p>

                                <p className="font-semibold text-slate-800 mt-1">
                                    {responder.phone}
                                </p>

                            </div>

                            <div className="bg-slate-50 rounded-lg p-4">

                                <p className="text-xs text-slate-500">
                                    Status
                                </p>

                                <p className="font-semibold text-slate-800 mt-1">
                                    {responder.status}
                                </p>

                            </div>

                        </div>

                    </div>

                )}


                {/* Responder Functions */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


                    {/* Notifications */}

                    <button
                        onClick={() => navigate("/notifications")}
                        className="text-left bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition"
                    >

                        <div className="text-4xl mb-4">
                            
                        </div>

                        <h3 className="text-lg font-bold text-slate-800">
                            Notifications
                        </h3>

                        <p className="text-sm text-slate-500 mt-2">
                            View new emergency assignments and important updates.
                        </p>

                    </button>


                    {/* Assigned Emergencies */}

                    <button
                        onClick={() => navigate("/responder-assignments")}
                        className="text-left bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition"
                    >

                        <div className="text-4xl mb-4">
                            
                        </div>

                        <h3 className="text-lg font-bold text-slate-800">
                            Assigned Emergencies
                        </h3>

                        <p className="text-sm text-slate-500 mt-2">
                            View emergencies assigned to you.
                        </p>

                    </button>


                    {/* Availability */}

                    <button
                        onClick={() => navigate("/responder-availability")}
                        className="text-left bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition"
                    >

                        <div className="text-4xl mb-4">
                            
                        </div>

                        <h3 className="text-lg font-bold text-slate-800">
                            Availability
                        </h3>

                        <p className="text-sm text-slate-500 mt-2">
                            Update your availability for emergency response.
                        </p>

                    </button>


                    {/* Profile */}

                    <button
                        onClick={() => navigate("/responder-profile")}
                        className="text-left bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition"
                    >

                        <div className="text-4xl mb-4">
                            
                        </div>

                        <h3 className="text-lg font-bold text-slate-800">
                            My Profile
                        </h3>

                        <p className="text-sm text-slate-500 mt-2">
                            View and manage your responder profile.
                        </p>

                    </button>

                </div>


                {/* Quick Info */}

                <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">

                    <h3 className="text-lg font-bold text-slate-800">
                        Response Guidelines
                    </h3>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div>
                            <p className="font-semibold text-slate-700">
                                 Check Assignments
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                                Review emergency details before responding.
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text-slate-700">
                                 Check Location
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                                Confirm the emergency location and details.
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text-slate-700">
                                 Update Status
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                                Keep your availability and assignment status updated.
                            </p>
                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default ResponderDashboard;