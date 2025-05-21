const express = require("express");
const router = express.Router();
const televisionsController = require("../controllers/televisionsController");

// Get all televisions
router.get("/", televisionsController.getAllTelevisions);

// Get television by ID
router.get("/:id", televisionsController.getTelevisionById);

// Create new television
router.post("/", televisionsController.CreateTelevision);

// Update television
router.put("/:id", televisionsController.updateTelevision);

// Delete television
router.delete("/:id", televisionsController.deleteTelevision);

module.exports = router;
