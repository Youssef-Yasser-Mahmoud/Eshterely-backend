const express = require("express");
const router = express.Router();
const speakerController = require("../controllers/speakersController");

// Apply request logging to all routes
// router.use(logRequest);

// Get all speakers
router.get("/", speakerController.getAllSpeakers);

// Get speaker by ID
router.get("/:id", speakerController.getSpeakerById);

// Create new speaker
router.post("/", speakerController.createSpeaker);

// Update speaker
router.patch("/:id", speakerController.updateSpeaker);

// Delete speaker
router.delete("/:id", speakerController.deleteSpeaker);

module.exports = router;
