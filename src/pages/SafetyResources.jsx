import { useNavigate } from "react-router-dom";

function SafetyResources() {
    const navigate = useNavigate();

    const resources = [
        {
            icon: "🔥",
            title: "Fire Safety",
            tips: [
                "Stay calm and move away from the fire.",
                "Use an emergency exit if available.",
                "Do not return to a burning building.",
                "Contact emergency services immediately."
            ]
        },
        {
            icon: "🌊",
            title: "Flood Safety",
            tips: [
                "Move to higher ground when flooding occurs.",
                "Avoid walking or driving through flood water.",
                "Follow official evacuation instructions.",
                "Keep emergency supplies ready."
            ]
        },
        {
            icon: "🚗",
            title: "Accident Safety",
            tips: [
                "Move to a safe location if possible.",
                "Contact emergency services.",
                "Avoid moving injured people unless necessary.",
                "Provide accurate location information."
            ]
        },
        {
            icon: "🏥",
            title: "Medical Emergency",
            tips: [
                "Contact emergency medical services.",
                "Stay with the person if it is safe.",
                "Provide accurate information about the situation.",
                "Follow instructions from emergency responders."
            ]
        },
        {
            icon: "🌪️",
            title: "Disaster Preparedness",
            tips: [
                "Keep emergency contact numbers available.",
                "Prepare basic emergency supplies.",
                "Know the safest exit routes.",
                "Follow instructions from local authorities."
            ]
        },
        {
            icon: "📱",
            title: "Reporting an Emergency",
            tips: [
                "Describe the emergency clearly.",
                "Provide the correct location.",
                "Select the correct emergency type.",
                "Monitor your report status through Smart Response."
            ]
        }
    ];

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
                            Safety Resources
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


            {/* Main Content */}

            <main className="max-w-6xl mx-auto px-6 py-10">

                <div className="mb-8">

                    <h2 className="text-3xl font-bold text-slate-800">
                        Safety Resources
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Helpful safety guidance for common emergency situations.
                    </p>

                </div>


                {/* Resource Cards */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {resources.map((resource) => (

                        <div
                            key={resource.title}
                            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
                        >

                            <div className="text-4xl mb-4">
                                {resource.icon}
                            </div>

                            <h3 className="text-lg font-bold text-slate-800">
                                {resource.title}
                            </h3>

                            <ul className="mt-4 space-y-3">

                                {resource.tips.map((tip, index) => (

                                    <li
                                        key={index}
                                        className="flex gap-2 text-sm text-slate-600"
                                    >

                                        <span className="text-blue-600 font-bold">
                                            •
                                        </span>

                                        <span>
                                            {tip}
                                        </span>

                                    </li>

                                ))}

                            </ul>

                        </div>

                    ))}

                </div>


                {/* Emergency Information Button */}

                <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6">

                    <h3 className="text-lg font-bold text-slate-800">
                        Need Emergency Information?
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                        View emergency types and important emergency contacts.
                    </p>

                    <button
                        onClick={() => navigate("/emergency-info")}
                        className="mt-4 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Emergency Information
                    </button>

                </div>

            </main>

        </div>
    );
}

export default SafetyResources;