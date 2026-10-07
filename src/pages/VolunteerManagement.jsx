import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function VolunteerManagement() {
    const navigate = useNavigate();

    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingVolunteer, setEditingVolunteer] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        skills: "",
        availability: "Available"
    });

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const getToken = () => {
        return localStorage.getItem("token");
    };

    // GET ALL VOLUNTEERS
    const fetchVolunteers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/volunteers", {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            setVolunteers(response.data.volunteers || []);

        } catch (err) {
            console.error("Fetch volunteers error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load volunteers."
            );

        } finally {
            setLoading(false);
        }
    };

    // HANDLE INPUT
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // OPEN ADD FORM
    const handleAddVolunteer = () => {
        setEditingVolunteer(null);

        setFormData({
            name: "",
            email: "",
            phone: "",
            skills: "",
            availability: "Available"
        });

        setMessage("");
        setError("");
        setShowForm(true);
    };

    // OPEN EDIT FORM
    const handleEditVolunteer = (volunteer) => {
        setEditingVolunteer(volunteer);

        setFormData({
            name: volunteer.name || "",
            email: volunteer.email || "",
            phone: volunteer.phone || "",
            skills: volunteer.skills || "",
            availability: volunteer.availability || "Available"
        });

        setMessage("");
        setError("");
        setShowForm(true);
    };

    // CREATE / UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setMessage("");
            setError("");

            const token = getToken();

            if (editingVolunteer) {
                // UPDATE
                const response = await API.put(
                    `/volunteers/${editingVolunteer._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setMessage(
                    response.data.message ||
                    "Volunteer updated successfully."
                );

            } else {
                // CREATE
                const response = await API.post(
                    "/volunteers",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setMessage(
                    response.data.message ||
                    "Volunteer added successfully."
                );
            }

            setShowForm(false);
            setEditingVolunteer(null);

            await fetchVolunteers();

        } catch (err) {
            console.error("Save volunteer error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to save volunteer."
            );

        } finally {
            setSaving(false);
        }
    };

    // DEACTIVATE
    const handleDeactivate = async (id) => {
        const confirmDeactivate = window.confirm(
            "Are you sure you want to deactivate this volunteer?"
        );

        if (!confirmDeactivate) {
            return;
        }

        try {
            setMessage("");
            setError("");

            const response = await API.delete(
                `/volunteers/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setMessage(
                response.data.message ||
                "Volunteer deactivated successfully."
            );

            await fetchVolunteers();

        } catch (err) {
            console.error("Deactivate volunteer error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to deactivate volunteer."
            );
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

        return "bg-slate-100 text-slate-600";
    };

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
                            Volunteer Management
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/coordinator-dashboard")}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        ← Dashboard
                    </button>

                </div>
            </header>


            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* TITLE */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>
                        <p className="text-sm text-blue-600 font-semibold">
                            VOLUNTEER MANAGEMENT
                        </p>

                        <h2 className="text-3xl font-bold text-slate-800 mt-1">
                            Volunteers
                        </h2>

                        <p className="text-slate-500 mt-2">
                            Manage volunteer information and availability.
                        </p>
                    </div>

                    <button
                        onClick={handleAddVolunteer}
                        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        + Add Volunteer
                    </button>

                </div>


                {/* MESSAGES */}
                {message && (
                    <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}


                {/* ADD / EDIT FORM */}
                {showForm && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">

                        <div className="flex items-center justify-between mb-6">

                            <div>
                                <h3 className="text-xl font-bold text-slate-800">
                                    {editingVolunteer
                                        ? "Edit Volunteer"
                                        : "Add New Volunteer"}
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    Enter the volunteer's information below.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowForm(false)}
                                className="text-slate-500 hover:text-slate-800 text-xl"
                            >
                                ✕
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-5"
                        >

                            {/* NAME */}
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
                                    placeholder="Enter volunteer name"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                                />
                            </div>


                            {/* EMAIL */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter email address"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                                />
                            </div>


                            {/* PHONE */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter phone number"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                                />
                            </div>


                            {/* SKILLS */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Skills
                                </label>

                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. First Aid, Rescue"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                                />
                            </div>


                            {/* AVAILABILITY */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Availability
                                </label>

                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="Available">
                                        Available
                                    </option>

                                    <option value="Unavailable">
                                        Unavailable
                                    </option>

                                    <option value="On Duty">
                                        On Duty
                                    </option>
                                </select>
                            </div>


                            {/* BUTTONS */}
                            <div className="flex items-end gap-3">

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingVolunteer
                                        ? "Update Volunteer"
                                        : "Add Volunteer"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>
                )}


                {/* VOLUNTEER LIST */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    <div className="px-6 py-5 border-b border-slate-200">

                        <h3 className="text-lg font-bold text-slate-800">
                            Volunteer List
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                            {volunteers.length} volunteer
                            {volunteers.length !== 1 ? "s" : ""} registered
                        </p>

                    </div>


                    {loading ? (

                        <div className="p-10 text-center">
                            <p className="text-slate-500">
                                Loading volunteers...
                            </p>
                        </div>

                    ) : volunteers.length === 0 ? (

                        <div className="p-10 text-center">

                            <div className="text-5xl mb-4">
                                👥
                            </div>

                            <h4 className="text-lg font-semibold text-slate-800">
                                No Volunteers Yet
                            </h4>

                            <p className="text-sm text-slate-500 mt-2">
                                Add your first volunteer to get started.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                            Volunteer
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                            Contact
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                            Skills
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                            Availability
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                            Status
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-200">

                                    {volunteers.map((volunteer) => (

                                        <tr
                                            key={volunteer._id}
                                            className="hover:bg-slate-50"
                                        >

                                            {/* VOLUNTEER */}
                                            <td className="px-6 py-5">

                                                <p className="font-semibold text-slate-800">
                                                    {volunteer.name}
                                                </p>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    {volunteer.email}
                                                </p>

                                            </td>


                                            {/* CONTACT */}
                                            <td className="px-6 py-5">

                                                <p className="text-sm text-slate-700">
                                                    {volunteer.phone}
                                                </p>

                                            </td>


                                            {/* SKILLS */}
                                            <td className="px-6 py-5">

                                                <p className="text-sm text-slate-700">
                                                    {volunteer.skills}
                                                </p>

                                            </td>


                                            {/* AVAILABILITY */}
                                            <td className="px-6 py-5">

                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityStyle(
                                                        volunteer.availability
                                                    )}`}
                                                >
                                                    {volunteer.availability}
                                                </span>

                                            </td>


                                            {/* STATUS */}
                                            <td className="px-6 py-5">

                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                                        volunteer.status
                                                    )}`}
                                                >
                                                    {volunteer.status}
                                                </span>

                                            </td>


                                            {/* ACTIONS */}
                                            <td className="px-6 py-5">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEditVolunteer(
                                                                volunteer
                                                            )
                                                        }
                                                        className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                                                    >
                                                        Edit
                                                    </button>

                                                    {volunteer.status ===
                                                        "Active" && (
                                                        <button
                                                            onClick={() =>
                                                                handleDeactivate(
                                                                    volunteer._id
                                                                )
                                                            }
                                                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                                                        >
                                                            Deactivate
                                                        </button>
                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default VolunteerManagement;