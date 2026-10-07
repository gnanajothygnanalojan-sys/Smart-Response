const express = require("express");

const {
    createEmergencyContact,
    getEmergencyContacts,
    getEmergencyContactById,
    updateEmergencyContact,
    deleteEmergencyContact
} = require("../controllers/emergencyContactController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createEmergencyContact);

router.get("/", protect, getEmergencyContacts);

router.get("/:id", protect, getEmergencyContactById);

router.put("/:id", protect, updateEmergencyContact);

router.delete("/:id", protect, deleteEmergencyContact);

module.exports = router;