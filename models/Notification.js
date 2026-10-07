const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        responder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Responder",
            required: true
        },

        report: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EmergencyReport",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);