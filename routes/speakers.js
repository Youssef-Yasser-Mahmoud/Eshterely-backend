const express = require("express");
const router = express.Router();
const speakerController = require("../controllers/speakersController");
const { validateSpeaker } = require("../validations/speakers.validation");
const {
  isAuthenticated,
  isAdmin,
  logRequest,
} = require("../middlewares/speakers");

// Apply request logging to all routes
router.use(logRequest);

router.get("/", speakerController.getAllSpeakers);

router.get("/:id", speakerController.getSpeakerById);

router.post("/", speakerController.createSpeaker);

router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  validateSpeaker,
  speakerController.updateSpeaker
);

router.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  speakerController.deleteSpeaker
);

module.exports = router;
