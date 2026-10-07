const express = require("express");

const {
    createReport,
    getMyReports,
    getReportById,
    updateReport,
    deleteReport,
    assignResponder
} = require("../controllers/emergencyReportController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new emergency report
router.post("/", protect, createReport);

// Get all reports belonging to logged-in citizen
router.get("/my-reports", protect, getMyReports);

// Get one specific report
router.get("/:id", protect, getReportById);

// Update a report
router.put("/:id", protect, updateReport);

//Assign a Responder
router.put("/:id/assign", protect, assignResponder);

// Delete a report
router.delete("/:id", protect, deleteReport);

module.exports = router;