const Notification = require("../models/Notification");


// READ notifications
const getNotifications = async (req, res) => {
    try {

        const { responderId } = req.params;

        const notifications =
            await Notification.find({
                responder: responderId
            })
            .populate(
                "report",
                "emergencyType description location status"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            message: "Notifications retrieved successfully",
            notifications
        });

    } catch (error) {

        console.error(
            "Get notifications error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while retrieving notifications"
        });
    }
};


// MARK NOTIFICATION AS READ
const markNotificationAsRead = async (req, res) => {
    try {

        const notification =
            await Notification.findById(
                req.params.id
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            message:
                "Notification marked as read",
            notification
        });

    } catch (error) {

        console.error(
            "Mark notification error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while updating notification"
        });
    }
};


module.exports = {
    getNotifications,
    markNotificationAsRead
};