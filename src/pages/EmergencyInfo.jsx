import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function EmergencyInfo() {
    const navigate = useNavigate();

    const [types, setTypes] = useState([]);
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
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
                console.error(
                    "Error loading emergency information:",
                    error
                );
            }
        };

        loadData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100">

            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>
                        <h1 className="text-xl font-bold text-blue-600">
                            Smart Response
                        </h1>

                        <p className="text-xs text-slate-500">
                            Emergency Information
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

                <h2 className="text-3xl font-bold text-slate-800">
                    Emergency Information
                </h2>

                <p className="mt-2 text-slate-500 mb-8">
                    Emergency types and important emergency contacts.
                </p>

                {/* Emergency Types */}

                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">

                    <h3 className="text-xl font-bold text-slate-800 mb-5">
                        Emergency Types
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {types.map((type) => (
                            <div
                                key={type._id}
                                className="border rounded-xl p-5"
                            >
                                <h4 className="font-bold text-slate-800">
                                    {type.name}
                                </h4>

                                <p className="mt-2 text-sm text-slate-600">
                                    {type.description}
                                </p>
                            </div>
                        ))}

                    </div>

                </section>

                {/* Emergency Contacts */}

                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

                    <h3 className="text-xl font-bold text-slate-800 mb-5">
                        Emergency Contacts
                    </h3>

                    <div className="space-y-4">

                        {contacts.map((contact) => (
                            <div
                                key={contact._id}
                                className="border rounded-xl p-5"
                            >

                                <h4 className="font-bold text-slate-800">
                                    {contact.name}
                                </h4>

                                <p className="text-sm text-slate-600 mt-1">
                                    {contact.service}
                                </p>

                                <p className="text-lg font-semibold text-blue-600 mt-2">
                                    {contact.phone}
                                </p>

                                {contact.description && (
                                    <p className="text-sm text-slate-500 mt-2">
                                        {contact.description}
                                    </p>
                                )}

                            </div>
                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default EmergencyInfo;