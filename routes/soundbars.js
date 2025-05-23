const express = require("express");
const router = express.Router();
const soundbarController = require("../controllers/soundbarsController");

// Get all soundbars
router.get("/", soundbarController.getAllSoundbars);

// Get soundbar by ID
router.get("/:id", soundbarController.getSoundbarById);

// Create new soundbar
router.post("/", soundbarController.createSoundbar);

// Update soundbar
router.put("/:id", soundbarController.updateSoundbar);

// Delete soundbar
router.delete("/:id", soundbarController.deleteSoundbar);

module.exports = router;
