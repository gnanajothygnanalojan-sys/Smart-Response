import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [responderId, setResponderId] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadResponder();
    }, []);

    const loadResponder = async () => {
        try {
            const response = await API.get("/responders");

            const responders = response.data.responders || [];

            if (responders.length > 0) {
                const responder = responders[0];

                setResponderId(responder._id);
                loadNotifications(responder._id);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const loadNotifications = async (id) => {
        try {
            const response = await API.get(
                `/notifications/responder/${id}`
            );

            setNotifications(
                response.data.notifications || []
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification._id === id
                        ? {
                              ...notification,
                              isRead: true
                          }
                        : notification
                )
            );

            setMessage("Notification marked as read.");
        } catch (error) {
            console.error(error);
            setMessage("Unable to update notification.");
        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Header */}
            <header className="bg-slate-900 text-white px-6 py-5 shadow-md">
                <div className="max-w-6xl mx-auto flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold">
                            Responder Notifications
                        </h1>

                        <p className="text-slate-300 text-sm mt-1">
                            View your emergency assignments
                        </p>
                    </div>

                    <Link
                        to="/responder-dashboard"
                        className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-slate-200"
                    >
                        Dashboard
                    </Link>

                </div>
            </header>


            {/* Main */}
            <main className="max-w-6xl mx-auto px-6 py-8">

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <p className="text-slate-500 text-sm">
                            Total Notifications
                        </p>

                        <h2 className="text-3xl font-bold text-slate-900 mt-2">
                            {notifications.length}
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <p className="text-slate-500 text-sm">
                            Unread
                        </p>

                        <h2 className="text-3xl font-bold text-red-600 mt-2">
                            {unreadCount}
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <p className="text-slate-500 text-sm">
                            Read
                        </p>

                        <h2 className="text-3xl font-bold text-green-600 mt-2">
                            {notifications.length - unreadCount}
                        </h2>
                    </div>

                </div>


                {message && (
                    <div className="mb-5 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg">
                        {message}
                    </div>
                )}


                {/* Notifications */}
                <div className="space-y-5">

                    {loading ? (
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <p className="text-slate-500">
                                Loading notifications...
                            </p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-10 text-center">

                            <div className="text-5xl mb-4">
                                🔔
                            </div>

                            <h2 className="text-xl font-bold text-slate-800">
                                No notifications
                            </h2>

                            <p className="text-slate-500 mt-2">
                                You will receive a notification when an emergency is assigned to you.
                            </p>

                        </div>
                    ) : (
                        notifications.map((notification) => (

                            <div
                                key={notification._id}
                                className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
                                    notification.isRead
                                        ? "border-slate-300"
                                        : "border-red-500"
                                }`}
                            >

                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                                    <div className="flex-1">

                                        <div className="flex items-center gap-3">

                                            <span className="text-2xl">
                                                {notification.isRead
                                                    ? "🔔"
                                                    : "🚨"}
                                            </span>

                                            <div>

                                                <h2 className="text-lg font-bold text-slate-900">
                                                    {notification.title}
                                                </h2>

                                                {!notification.isRead && (
                                                    <span className="inline-block mt-1 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                                                        NEW
                                                    </span>
                                                )}

                                            </div>

                                        </div>


                                        <p className="text-slate-600 mt-4">
                                            {notification.message}
                                        </p>


                                        {notification.report && (
                                            <div className="mt-5 bg-slate-50 rounded-lg p-4">

                                                <h3 className="font-semibold text-slate-800 mb-3">
                                                    Emergency Details
                                                </h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">

                                                    <div>
                                                        <span className="font-medium">
                                                            Type:
                                                        </span>{" "}
                                                        {notification.report.emergencyType}
                                                    </div>

                                                    <div>
                                                        <span className="font-medium">
                                                            Status:
                                                        </span>{" "}
                                                        {notification.report.status}
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <span className="font-medium">
                                                            Location:
                                                        </span>{" "}
                                                        {notification.report.location}
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <span className="font-medium">
                                                            Description:
                                                        </span>{" "}
                                                        {notification.report.description}
                                                    </div>

                                                </div>

                                            </div>
                                        )}

                                    </div>


                                    {!notification.isRead && (
                                        <button
                                            onClick={() =>
                                                markAsRead(
                                                    notification._id
                                                )
                                            }
                                            className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                                        >
                                            Mark as Read
                                        </button>
                                    )}

                                </div>

                            </div>

                        ))
                    )}

                </div>

            </main>

        </div>
    );
}

export default Notifications;