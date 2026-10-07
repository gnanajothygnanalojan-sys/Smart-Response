const express = require("express");

const {
    getNotifications,
    markNotificationAsRead
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Get notifications for responder
router.get(
    "/responder/:responderId",
    protect,
    getNotifications
);


// Mark notification as read
router.put(
    "/:id/read",
    protect,
    markNotificationAsRead
);


module.exports = router;