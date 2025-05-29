const express = require("express");
const router = express.Router();
const televisionsController = require("../controllers/televisionsController");
const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");

// Get all televisions
router.get("/", televisionsController.getAllTelevisions);

// Get television by ID
router.get("/:id", televisionsController.getTelevisionById);

// Create new television
router.post("/", televisionsController.CreateTelevision);

// Update television
router.patch("/:id", [auth, admin], televisionsController.updateTelevision);

// Delete television
router.delete("/:id", [auth, admin], televisionsController.deleteTelevision);

module.exports = router;
