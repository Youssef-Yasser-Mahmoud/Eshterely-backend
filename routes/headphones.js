const express = require("express");
const router = express.Router();
const headphoneController = require("../controllers/headphonesController");

// Apply request logging to all routes
// router.use(logRequest);

// Get all headphones
router.get("/", headphoneController.getAllHeadphones);

// Get headphone by ID
router.get("/:id", headphoneController.getHeadphoneById);

// Create new headphone
router.post("/", headphoneController.createHeadphone);

// Update headphone
router.patch("/:id", headphoneController.updateHeadphone);

// Delete headphone
router.delete("/:id", headphoneController.deleteHeadphone);

module.exports = router;
