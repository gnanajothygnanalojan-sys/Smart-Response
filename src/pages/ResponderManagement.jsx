import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ResponderManagement() {

    const navigate = useNavigate();

    const [responders, setResponders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingResponder, setEditingResponder] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        availability: "Available",
        password: ""
    });


    // Get token
    const getToken = () => {
        return localStorage.getItem("token");
    };


    // Fetch responders
    const fetchResponders = async () => {

        try {

            const token = getToken();

            if (!token) {
                navigate("/login");
                return;
            }

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

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchResponders();
    }, []);


    // Handle form input
    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });

    };


    // Open add form
    const handleAdd = () => {

        setEditingResponder(null);

        setFormData({
            name: "",
            email: "",
            phone: "",
            department: "",
            availability: "Available",
            password: ""
        });

        setError("");
        setSuccess("");

        setShowForm(true);
    };


    // Open edit form
    const handleEdit = (responder) => {

        setEditingResponder(responder);

        setFormData({
            name: responder.name,
            email: responder.email,
            phone: responder.phone,
            department: responder.department,
            availability: responder.availability,
            password: ""
        });

        setError("");
        setSuccess("");

        setShowForm(true);
    };


    // Submit form
    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        try {

            const token = getToken();

            if (!token) {
                navigate("/login");
                return;
            }


            if (editingResponder) {

                // Remove password when editing
                const updateData = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    department: formData.department,
                    availability: formData.availability
                };

                await API.put(
                    `/responders/${editingResponder._id}`,
                    updateData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setSuccess(
                    "Responder updated successfully."
                );

            } else {

                // Create responder + login account
                await API.post(
                    "/responders",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setSuccess(
                    "Responder and login account created successfully."
                );
            }


            setShowForm(false);

            setEditingResponder(null);

            setFormData({
                name: "",
                email: "",
                phone: "",
                department: "",
                availability: "Available",
                password: ""
            });

            fetchResponders();

        } catch (error) {

            console.error(
                "Save responder error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to save responder."
            );

        }
    };


    // Deactivate responder
    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to deactivate this responder?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const token = getToken();

            if (!token) {
                navigate("/login");
                return;
            }

            await API.delete(
                `/responders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess(
                "Responder deactivated successfully."
            );

            fetchResponders();

        } catch (error) {

            console.error(
                "Deactivate responder error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to deactivate responder."
            );

        }
    };


    // Change availability
    const handleAvailabilityChange = async (
        responder,
        availability
    ) => {

        try {

            const token = getToken();

            if (!token) {
                navigate("/login");
                return;
            }

            await API.put(
                `/responders/${responder._id}`,
                {
                    availability
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess(
                "Responder availability updated."
            );

            fetchResponders();

        } catch (error) {

            console.error(
                "Availability update error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update availability."
            );

        }
    };


    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">

                <p className="text-slate-600">
                    Loading responders...
                </p>

            </div>
        );

    }


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
                            Responder Management
                        </p>

                    </div>


                    <button
                        onClick={() => navigate("/coordinator-dashboard")}
                        className="text-sm font-medium text-slate-600 hover:text-blue-600"
                    >
                        ← Dashboard
                    </button>

                </div>

            </nav>


            {/* Main Content */}

            <main className="max-w-7xl mx-auto px-6 py-10">


                {/* Header */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>

                        <h2 className="text-3xl font-bold text-slate-800">
                            Responder Management
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Manage emergency responders and their availability.
                        </p>

                    </div>


                    <button
                        onClick={handleAdd}
                        className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Add Responder
                    </button>

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


                {/* Add / Edit Form */}

                {showForm && (

                    <div className="mb-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                        <div className="flex items-center justify-between mb-6">

                            <div>

                                <h3 className="text-xl font-bold text-slate-800">

                                    {editingResponder
                                        ? "Edit Responder"
                                        : "Add New Responder"}

                                </h3>

                                <p className="mt-1 text-sm text-slate-500">

                                    {editingResponder
                                        ? "Update responder information below."
                                        : "Enter responder information and create their login account."}

                                </p>

                            </div>


                            <button
                                onClick={() => setShowForm(false)}
                                className="text-slate-400 hover:text-slate-700 text-xl"
                            >
                                ✕
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-5"
                        >


                            {/* Name */}

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
                                    placeholder="Enter responder name"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                                />

                            </div>


                            {/* Email */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter email address"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                                />

                            </div>


                            {/* Phone */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter phone number"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                                />

                            </div>


                            {/* Department */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Department
                                </label>

                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                                >

                                    <option value="">
                                        Select department
                                    </option>

                                    <option value="Police">
                                        Police
                                    </option>

                                    <option value="Fire & Rescue">
                                        Fire & Rescue
                                    </option>

                                    <option value="Medical">
                                        Medical
                                    </option>

                                    <option value="Disaster Management">
                                        Disaster Management
                                    </option>

                                </select>

                            </div>


                            {/* Password */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Login Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required={!editingResponder}
                                    placeholder={
                                        editingResponder
                                            ? "Leave empty to keep current password"
                                            : "Enter login password"
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                                />

                                {!editingResponder && (
                                    <p className="mt-1 text-xs text-slate-500">
                                        This password will be used by the responder to log in.
                                    </p>
                                )}

                            </div>


                            {/* Availability */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Availability
                                </label>

                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
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


                            {/* Buttons */}

                            <div className="flex items-end gap-3 md:col-span-2">

                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                                >

                                    {editingResponder
                                        ? "Update Responder"
                                        : "Create Responder"}

                                </button>


                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                )}


                {/* Responder List */}

                {responders.length === 0 ? (

                    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

                        <div className="text-4xl mb-4">
                            👨‍🚒
                        </div>

                        <h3 className="text-lg font-semibold text-slate-800">
                            No Responders Found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Add a responder to start managing emergency response assignments.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {responders.map((responder) => (

                            <div
                                key={responder._id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                            >


                                {/* Header */}

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex items-center gap-3">

                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">

                                            <span className="text-xl">
                                                👤
                                            </span>

                                        </div>

                                        <div>

                                            <h3 className="font-semibold text-slate-800">
                                                {responder.name}
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                {responder.department}
                                            </p>

                                        </div>

                                    </div>


                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            responder.availability === "Available"
                                                ? "bg-green-100 text-green-700"
                                                : responder.availability === "On Duty"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-slate-100 text-slate-600"
                                        }`}
                                    >
                                        {responder.availability}
                                    </span>

                                </div>


                                {/* Details */}

                                <div className="mt-5 space-y-3">

                                    <div>

                                        <p className="text-xs text-slate-400">
                                            Email
                                        </p>

                                        <p className="text-sm text-slate-700">
                                            {responder.email}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-slate-400">
                                            Phone
                                        </p>

                                        <p className="text-sm text-slate-700">
                                            {responder.phone}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-slate-400">
                                            Availability
                                        </p>

                                        <select
                                            value={responder.availability}
                                            onChange={(event) =>
                                                handleAvailabilityChange(
                                                    responder,
                                                    event.target.value
                                                )
                                            }
                                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
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

                                </div>


                                {/* Actions */}

                                <div className="mt-6 flex gap-3">

                                    <button
                                        onClick={() =>
                                            handleEdit(responder)
                                        }
                                        className="flex-1 rounded-lg border border-blue-300 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(responder._id)
                                        }
                                        className="flex-1 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                    >
                                        Deactivate
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default ResponderManagement;