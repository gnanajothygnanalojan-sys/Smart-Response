import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CoordinatorDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [volunteerCount, setVolunteerCount] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(storedUser);

        if (
            parsedUser.role !== "coordinator" &&
            parsedUser.role !== "admin"
        ) {
            navigate("/dashboard");
            return;
        }

        setUser(parsedUser);
        fetchVolunteerCount();
    }, []);

    const fetchVolunteerCount = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await API.get("/volunteers", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setVolunteerCount(
                response.data.volunteers?.length || 0
            );

        } catch (error) {
            console.error(
                "Failed to load volunteer count:",
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
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <p className="text-slate-500">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            🚨 Smart Response
                        </h1>

                        <p className="text-sm text-slate-500">
                            Coordinator Portal
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


            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* WELCOME */}
                <div className="bg-blue-600 rounded-2xl p-6 text-white mb-8">

                    <p className="text-blue-100 text-sm">
                        Coordinator Dashboard
                    </p>

                    <h2 className="text-3xl font-bold mt-1">
                        Welcome, {user.name} 👋
                    </h2>

                    <p className="mt-2 text-blue-100">
                        Manage emergency response activities and volunteers.
                    </p>

                </div>


                {/* SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    Registered Volunteers
                                </p>

                                <p className="text-3xl font-bold text-slate-800 mt-2">
                                    {volunteerCount}
                                </p>
                            </div>

                            <div className="text-4xl">
                                👥
                            </div>

                        </div>

                    </div>


                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    Emergency Response
                                </p>

                                <p className="text-lg font-bold text-slate-800 mt-2">
                                    Management
                                </p>
                            </div>

                            <div className="text-4xl">
                                🚨
                            </div>

                        </div>

                    </div>


                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    System Role
                                </p>

                                <p className="text-lg font-bold text-slate-800 mt-2">
                                    Coordinator
                                </p>
                            </div>

                            <div className="text-4xl">
                                🛡️
                            </div>

                        </div>

                    </div>

                </div>


                {/* MANAGEMENT */}
                <div className="mb-8">

                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                        Management
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* VOLUNTEERS */}
                        <button
                            onClick={() =>
                                navigate("/volunteer-management")
                            }
                            className="text-left bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition"
                        >

                            <div className="text-4xl mb-4">
                                👥
                            </div>

                            <h4 className="text-lg font-bold text-slate-800">
                                Volunteer Management
                            </h4>

                            <p className="text-sm text-slate-500 mt-2">
                                Add, view, update and manage volunteer
                                availability.
                            </p>

                            <div className="mt-5 text-blue-600 text-sm font-semibold">
                                Manage Volunteers →
                            </div>

                        </button>


                        {/* RESPONDERS */}
                        <button
                            onClick={() =>
                                navigate("/responders")
                            }
                            className="text-left bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition"
                        >

                            <div className="text-4xl mb-4">
                                🚑
                            </div>

                            <h4 className="text-lg font-bold text-slate-800">
                                Responder Management
                            </h4>

                            <p className="text-sm text-slate-500 mt-2">
                                Manage emergency responders and their
                                availability.
                            </p>

                            <div className="mt-5 text-blue-600 text-sm font-semibold">
                                Manage Responders →
                            </div>

                        </button>


                        {/* EMERGENCY INFORMATION */}
                        <button
                            onClick={() =>
                                navigate("/emergency-information-management")
                            }
                            className="text-left bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition"
                        >

                            <div className="text-4xl mb-4">
                                📋
                            </div>

                            <h4 className="text-lg font-bold text-slate-800">
                                Emergency Information
                            </h4>

                            <p className="text-sm text-slate-500 mt-2">
                                View emergency types and important
                                emergency contacts.
                            </p>

                            <div className="mt-5 text-blue-600 text-sm font-semibold">
                                View Information →
                            </div>

                        </button>

                    </div>

                </div>


                <button
    onClick={() =>
        navigate("/emergency-information-management")
    }
    className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:shadow-md transition"
>
    <h3 className="text-lg font-semibold text-slate-800">
        Emergency Information
    </h3>

    <p className="text-sm text-slate-500 mt-2">
        Manage emergency types and emergency contacts.
    </p>
</button>


                {/* QUICK INFORMATION */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">

                    <h3 className="text-lg font-bold text-slate-800">
                        Coordinator Responsibilities
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">

                        <div>
                            <p className="font-semibold text-slate-700">
                                🚨 Emergency Coordination
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                                Coordinate emergency reports and response
                                activities.
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text-slate-700">
                                🚑 Responder Management
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                                Manage responders and their availability.
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text-slate-700">
                                👥 Volunteer Management
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                                Manage volunteers and their current
                                availability.
                            </p>
                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default CoordinatorDashboard;