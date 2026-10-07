import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

                setUser(response.data.user);

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Navigation Bar */}

            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>
                        <h1 className="text-xl font-bold text-blue-600">
                            Smart Response
                        </h1>

                        <p className="text-xs text-slate-500">
                            Emergency Reporting & Response Coordination
                        </p>
                    </div>

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() => navigate("/profile")}
                            className="text-sm font-medium text-slate-600 hover:text-blue-600"
                        >
                            My Profile
                        </button>

                        <button
                            onClick={handleLogout}
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                        >
                            Logout
                        </button>

                    </div>

                </div>
            </nav>


            {/* Dashboard Content */}

            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* Welcome Section */}

                <div className="mb-8">

                    <h2 className="text-3xl font-bold text-slate-800">
                        Welcome, {user?.name}
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Manage your account and access emergency services.
                    </p>

                </div>


                {/* Dashboard Cards */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">


                    {/* Report Emergency */}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-5">

                            <span className="text-2xl">
                                🚨
                            </span>

                        </div>

                        <h3 className="text-lg font-semibold text-slate-800">
                            Report Emergency
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Report an accident, fire, flood, medical emergency
                            or other disaster.
                        </p>

                        <button
                            onClick={() => navigate("/report-emergency")}
                            className="mt-5 w-full rounded-lg bg-red-500 py-3 text-sm font-semibold text-white hover:bg-red-600"
                        >
                            Report Emergency
                        </button>

                    </div>


                    {/* My Reports */}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-5">

                            <span className="text-2xl">
                                📋
                            </span>

                        </div>

                        <h3 className="text-lg font-semibold text-slate-800">
                            My Reports
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Track the emergency reports you have submitted.
                        </p>

                        <button
                            onClick={() => navigate("/my-reports")}
                            className="mt-5 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            View Reports
                        </button>

                    </div>


                    {/* My Profile */}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-5">

                            <span className="text-2xl">
                                👤
                            </span>

                        </div>

                        <h3 className="text-lg font-semibold text-slate-800">
                            My Profile
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            View and update your personal information.
                        </p>

                        <button
                            onClick={() => navigate("/profile")}
                            className="mt-5 w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
                        >
                            View Profile
                        </button>

                    </div>


                    {/* Emergency Information */}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-5">

                            <span className="text-2xl">
                                📞
                            </span>

                        </div>

                        <h3 className="text-lg font-semibold text-slate-800">
                            Emergency Information
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            View emergency types and important emergency contacts.
                        </p>

                        <button
                            onClick={() => navigate("/emergency-info")}
                            className="mt-5 w-full rounded-lg bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600"
                        >
                            View Information
                        </button>

                    </div>


                    {/* Safety Resources */}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-5">

                            <span className="text-2xl">
                                🛡️
                            </span>

                        </div>

                        <h3 className="text-lg font-semibold text-slate-800">
                            Safety Resources
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Learn useful safety guidance for emergency situations.
                        </p>

                        <button
                            onClick={() => navigate("/safety-resources")}
                            className="mt-5 w-full rounded-lg bg-purple-600 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                        >
                            View Resources
                        </button>

                    </div>


                </div>


                {/* Account Information */}

                <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                    <h3 className="text-lg font-semibold text-slate-800">
                        Account Information
                    </h3>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">

                        <div>

                            <p className="text-sm text-slate-500">
                                Name
                            </p>

                            <p className="mt-1 font-medium text-slate-800">
                                {user?.name}
                            </p>

                        </div>


                        <div>

                            <p className="text-sm text-slate-500">
                                Email
                            </p>

                            <p className="mt-1 font-medium text-slate-800">
                                {user?.email}
                            </p>

                        </div>


                        <div>

                            <p className="text-sm text-slate-500">
                                Account Status
                            </p>

                            <p className="mt-1 font-medium text-green-600">
                                {user?.status}
                            </p>

                        </div>

                    </div>

                </div>


            </main>

        </div>
    );
}

export default Dashboard;