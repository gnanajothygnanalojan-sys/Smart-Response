const express = require("express");

const {
    createEmergencyType,
    getEmergencyTypes,
    getEmergencyTypeById,
    updateEmergencyType,
    deleteEmergencyType
} = require("../controllers/emergencyTypeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createEmergencyType);

router.get("/", protect, getEmergencyTypes);

router.get("/:id", protect, getEmergencyTypeById);

router.put("/:id", protect, updateEmergencyType);

router.delete("/:id", protect, deleteEmergencyType);

module.exports = router;