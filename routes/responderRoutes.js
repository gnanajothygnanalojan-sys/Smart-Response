const express = require("express");

const {
    createResponder,
    getResponders,
    getResponderById,
    updateResponder,
    deleteResponder,
    getMyResponderProfile
} = require("../controllers/responderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE
router.post("/", protect, createResponder);


// READ ALL
router.get("/", protect, getResponders);


router.get("/me", protect, getMyResponderProfile);


// READ ONE
router.get("/:id", protect, getResponderById);


// UPDATE
router.put("/:id", protect, updateResponder);


// DELETE / DEACTIVATE
router.delete("/:id", protect, deleteResponder);


module.exports = router;