import { useNavigate } from "react-router-dom";

function VolunteerDashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-100">

            <header className="bg-slate-900 text-white px-6 py-4">

                <div className="max-w-7xl mx-auto flex justify-between items-center">

                    <div>
                        <h1 className="text-xl font-bold">
                            Smart Response
                        </h1>

                        <p className="text-sm text-slate-300">
                            Volunteer Portal
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>

                </div>

            </header>


            <main className="max-w-7xl mx-auto px-6 py-10">

                <h2 className="text-3xl font-bold text-slate-800">
                    Welcome, {user?.name}
                </h2>

                <p className="text-slate-500 mt-2">
                    Manage your volunteer information.
                </p>


                <div className="grid md:grid-cols-2 gap-6 mt-8">

                    <div className="bg-white p-6 rounded-xl shadow">

                        <h3 className="text-xl font-semibold text-slate-800">
                            My Volunteer Profile
                        </h3>

                        <p className="text-slate-500 mt-2">
                            View your volunteer information and availability.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/volunteer-profile")
                            }
                            className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                        >
                            View Profile
                        </button>

                    </div>


                    <div className="bg-white p-6 rounded-xl shadow">

                        <h3 className="text-xl font-semibold text-slate-800">
                            Availability
                        </h3>

                        <p className="text-slate-500 mt-2">
                            Update your current availability.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/volunteer-profile")
                            }
                            className="mt-5 bg-slate-800 text-white px-5 py-2 rounded-lg hover:bg-slate-900"
                        >
                            Manage Availability
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default VolunteerDashboard;