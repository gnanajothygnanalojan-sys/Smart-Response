const express = require("express");

const {
    createVolunteer,
    getVolunteers,
    getVolunteerById,
    updateVolunteer,
    deleteVolunteer
} = require("../controllers/volunteerController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Create volunteer
router.post("/", protect, createVolunteer);


// Get all volunteers
router.get("/", protect, getVolunteers);


// Get volunteer by ID
router.get("/:id", protect, getVolunteerById);


// Update volunteer
router.put("/:id", protect, updateVolunteer);


// Deactivate volunteer
router.delete("/:id", protect, deleteVolunteer);


module.exports = router;