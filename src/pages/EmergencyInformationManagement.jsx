import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function EmergencyInformationManagement() {
    const navigate = useNavigate();

    const [types, setTypes] = useState([]);
    const [contacts, setContacts] = useState([]);

    const [typeForm, setTypeForm] = useState({
        name: "",
        description: ""
    });

    const [contactForm, setContactForm] = useState({
        name: "",
        service: "",
        phone: "",
        description: ""
    });

    const [editingType, setEditingType] = useState(null);
    const [editingContact, setEditingContact] = useState(null);

    const loadData = async () => {
        try {
            const [typesResponse, contactsResponse] =
                await Promise.all([
                    API.get("/emergency-types"),
                    API.get("/emergency-contacts")
                ]);

            setTypes(typesResponse.data.emergencyTypes || []);
            setContacts(
                contactsResponse.data.emergencyContacts || []
            );

        } catch (error) {
            console.error("Error loading emergency information:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Emergency Type CREATE / UPDATE
    const handleTypeSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingType) {
                await API.put(
                    `/emergency-types/${editingType}`,
                    typeForm
                );
            } else {
                await API.post(
                    "/emergency-types",
                    typeForm
                );
            }

            setTypeForm({
                name: "",
                description: ""
            });

            setEditingType(null);
            loadData();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    // Emergency Type DELETE
    const deleteType = async (id) => {
        if (!window.confirm("Delete this emergency type?")) {
            return;
        }

        try {
            await API.delete(`/emergency-types/${id}`);
            loadData();
        } catch (error) {
            alert("Unable to delete emergency type");
        }
    };

    // Emergency Contact CREATE / UPDATE
    const handleContactSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingContact) {
                await API.put(
                    `/emergency-contacts/${editingContact}`,
                    contactForm
                );
            } else {
                await API.post(
                    "/emergency-contacts",
                    contactForm
                );
            }

            setContactForm({
                name: "",
                service: "",
                phone: "",
                description: ""
            });

            setEditingContact(null);
            loadData();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    // Emergency Contact DELETE
    const deleteContact = async (id) => {
        if (!window.confirm("Delete this emergency contact?")) {
            return;
        }

        try {
            await API.delete(
                `/emergency-contacts/${id}`
            );

            loadData();

        } catch (error) {
            alert("Unable to delete emergency contact");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Header */}
            <header className="bg-slate-900 text-white px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">
                            Smart Response
                        </h1>

                        <p className="text-sm text-slate-400">
                            Emergency Information Management
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/coordinator-dashboard")
                        }
                        className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium"
                    >
                        Dashboard
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">

                <h2 className="text-2xl font-bold text-slate-800">
                    Emergency Information
                </h2>

                <p className="text-slate-500 mt-1 mb-8">
                    Manage emergency types and emergency contact details.
                </p>


                {/* EMERGENCY TYPES */}
                <section className="bg-white rounded-xl shadow-sm p-6 mb-8">

                    <h3 className="text-xl font-bold text-slate-800 mb-5">
                        Emergency Types
                    </h3>

                    <form
                        onSubmit={handleTypeSubmit}
                        className="grid md:grid-cols-3 gap-4 mb-6"
                    >
                        <input
                            type="text"
                            placeholder="Emergency type"
                            value={typeForm.name}
                            onChange={(e) =>
                                setTypeForm({
                                    ...typeForm,
                                    name: e.target.value
                                })
                            }
                            required
                            className="border rounded-lg px-4 py-3"
                        />

                        <input
                            type="text"
                            placeholder="Description"
                            value={typeForm.description}
                            onChange={(e) =>
                                setTypeForm({
                                    ...typeForm,
                                    description: e.target.value
                                })
                            }
                            required
                            className="border rounded-lg px-4 py-3"
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 text-white rounded-lg px-4 py-3 font-semibold"
                        >
                            {editingType
                                ? "Update Type"
                                : "Add Type"}
                        </button>
                    </form>


                    <div className="space-y-3">

                        {types.map((type) => (
                            <div
                                key={type._id}
                                className="border rounded-lg p-4 flex items-center justify-between"
                            >
                                <div>
                                    <h4 className="font-semibold text-slate-800">
                                        {type.name}
                                    </h4>

                                    <p className="text-sm text-slate-500">
                                        {type.description}
                                    </p>
                                </div>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() => {
                                            setEditingType(type._id);

                                            setTypeForm({
                                                name: type.name,
                                                description:
                                                    type.description
                                            });
                                        }}
                                        className="px-3 py-2 bg-slate-100 rounded-lg"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteType(type._id)
                                        }
                                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        ))}

                    </div>

                </section>


                {/* EMERGENCY CONTACTS */}
                <section className="bg-white rounded-xl shadow-sm p-6">

                    <h3 className="text-xl font-bold text-slate-800 mb-5">
                        Emergency Contacts
                    </h3>

                    <form
                        onSubmit={handleContactSubmit}
                        className="grid md:grid-cols-2 gap-4 mb-6"
                    >

                        <input
                            type="text"
                            placeholder="Contact name"
                            value={contactForm.name}
                            onChange={(e) =>
                                setContactForm({
                                    ...contactForm,
                                    name: e.target.value
                                })
                            }
                            required
                            className="border rounded-lg px-4 py-3"
                        />

                        <input
                            type="text"
                            placeholder="Service"
                            value={contactForm.service}
                            onChange={(e) =>
                                setContactForm({
                                    ...contactForm,
                                    service: e.target.value
                                })
                            }
                            required
                            className="border rounded-lg px-4 py-3"
                        />

                        <input
                            type="text"
                            placeholder="Phone number"
                            value={contactForm.phone}
                            onChange={(e) =>
                                setContactForm({
                                    ...contactForm,
                                    phone: e.target.value
                                })
                            }
                            required
                            className="border rounded-lg px-4 py-3"
                        />

                        <input
                            type="text"
                            placeholder="Description"
                            value={contactForm.description}
                            onChange={(e) =>
                                setContactForm({
                                    ...contactForm,
                                    description: e.target.value
                                })
                            }
                            className="border rounded-lg px-4 py-3"
                        />

                        <button
                            type="submit"
                            className="md:col-span-2 bg-blue-600 text-white rounded-lg px-4 py-3 font-semibold"
                        >
                            {editingContact
                                ? "Update Contact"
                                : "Add Contact"}
                        </button>

                    </form>


                    <div className="space-y-3">

                        {contacts.map((contact) => (
                            <div
                                key={contact._id}
                                className="border rounded-lg p-4 flex items-center justify-between"
                            >

                                <div>
                                    <h4 className="font-semibold text-slate-800">
                                        {contact.name}
                                    </h4>

                                    <p className="text-sm text-slate-600">
                                        {contact.service} • {contact.phone}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {contact.description}
                                    </p>
                                </div>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() => {
                                            setEditingContact(
                                                contact._id
                                            );

                                            setContactForm({
                                                name: contact.name,
                                                service: contact.service,
                                                phone: contact.phone,
                                                description:
                                                    contact.description || ""
                                            });
                                        }}
                                        className="px-3 py-2 bg-slate-100 rounded-lg"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteContact(
                                                contact._id
                                            )
                                        }
                                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default EmergencyInformationManagement;