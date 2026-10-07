const EmergencyReport = require("../models/EmergencyReport");
const Responder = require("../models/Responder");
const Notification = require("../models/Notification");

// CREATE - Submit a new emergency report
const createReport = async (req, res) => {
    try {
        const {
            emergencyType,
            description,
            location,
            image
        } = req.body;

        if (!emergencyType || !description || !location) {
            return res.status(400).json({
                message: "Please provide emergency type, description and location"
            });
        }

        const report = await EmergencyReport.create({
            citizen: req.user.id,
            emergencyType,
            description,
            location,
            image: image || "",
            status: "Reported"
        });

        res.status(201).json({
            message: "Emergency report submitted successfully",
            report
        });

    } catch (error) {
        console.error("Create report error:", error.message);

        res.status(500).json({
            message: "Server error while creating emergency report"
        });
    }
};


// READ - Get all reports submitted by logged-in citizen
const getMyReports = async (req, res) => {
    try {
        const reports = await EmergencyReport.find({
            citizen: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Reports retrieved successfully",
            reports
        });

    } catch (error) {
        console.error("Get reports error:", error.message);

        res.status(500).json({
            message: "Server error while retrieving reports"
        });
    }
};


// READ - Get one report by ID
const getReportById = async (req, res) => {
    try {
        const report = await EmergencyReport.findOne({
            _id: req.params.id,
            citizen: req.user.id
        });

        if (!report) {
            return res.status(404).json({
                message: "Emergency report not found"
            });
        }

        res.status(200).json({
            message: "Report retrieved successfully",
            report
        });

    } catch (error) {
        console.error("Get report error:", error.message);

        res.status(500).json({
            message: "Server error while retrieving report"
        });
    }
};


// UPDATE - Update a report
const updateReport = async (req, res) => {
    try {
        const {
            emergencyType,
            description,
            location,
            image
        } = req.body;

        const report = await EmergencyReport.findOne({
            _id: req.params.id,
            citizen: req.user.id
        });

        if (!report) {
            return res.status(404).json({
                message: "Emergency report not found"
            });
        }

        // Only allow editing reports that are still newly reported
        if (report.status !== "Reported") {
            return res.status(400).json({
                message: "This report can no longer be edited"
            });
        }

        if (emergencyType) {
            report.emergencyType = emergencyType;
        }

        if (description) {
            report.description = description;
        }

        if (location) {
            report.location = location;
        }

        if (image !== undefined) {
            report.image = image;
        }

        await report.save();

        res.status(200).json({
            message: "Emergency report updated successfully",
            report
        });

    } catch (error) {
        console.error("Update report error:", error.message);

        res.status(500).json({
            message: "Server error while updating emergency report"
        });
    }
};


// DELETE - Delete a report
const deleteReport = async (req, res) => {
    try {
        const report = await EmergencyReport.findOne({
            _id: req.params.id,
            citizen: req.user.id
        });

        if (!report) {
            return res.status(404).json({
                message: "Emergency report not found"
            });
        }

        // Only allow deletion while report is still newly submitted
        if (report.status !== "Reported") {
            return res.status(400).json({
                message: "This report can no longer be deleted"
            });
        }

        await EmergencyReport.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Emergency report deleted successfully"
        });

    } catch (error) {
        console.error("Delete report error:", error.message);

        res.status(500).json({
            message: "Server error while deleting emergency report"
        });
    }
};


// ASSIGN RESPONDER TO EMERGENCY REPORT
const assignResponder = async (req, res) => {
    try {

        const { responderId } = req.body;

        if (!responderId) {
            return res.status(400).json({
                message: "Please provide a responder"
            });
        }


        // Find responder
        const responder =
            await Responder.findById(responderId);

        if (!responder) {
            return res.status(404).json({
                message: "Responder not found"
            });
        }


        // Check responder status
        if (responder.status !== "Active") {
            return res.status(400).json({
                message: "This responder is inactive"
            });
        }


        // Check availability
        if (responder.availability !== "Available") {
            return res.status(400).json({
                message:
                    "This responder is not currently available"
            });
        }


        // Find emergency report
        const report =
            await EmergencyReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                message: "Emergency report not found"
            });
        }


        // Assign responder
        report.assignedResponder = responderId;

        report.status = "Assigned";

        await report.save();


        // Change responder availability
        responder.availability = "On Duty";

        await responder.save();


        // Create notification for responder
        await Notification.create({
            responder: responder._id,
            report: report._id,
            title: "New Emergency Assignment",
            message: `You have been assigned to a ${report.emergencyType} emergency at ${report.location}.`
        });


        // Return updated report
        const updatedReport =
            await EmergencyReport.findById(report._id)
                .populate(
                    "assignedResponder",
                    "name email phone department availability"
                );


        res.status(200).json({
            message:
                "Responder assigned successfully",
            report: updatedReport
        });

    } catch (error) {

        console.error(
            "Assign responder error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while assigning responder"
        });
    }
};


module.exports = {
    createReport,
    getMyReports,
    getReportById,
    updateReport,
    deleteReport,
    assignResponder
};