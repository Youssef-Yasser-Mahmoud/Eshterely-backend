const Soundbar = require("../models/soundbars");
const { validateSoundbar } = require("../validations/soundbars.validation");

// Create a new soundbar
exports.createSoundbar = async (req, res) => {
  try {
    // Validate request body
    const isValid = validateSoundbar(req.body);
    if (!isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validateSoundbar.errors,
      });
    }

    const soundbar = new Soundbar(req.body);
    await soundbar.save();
    res.status(201).json(soundbar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all soundbars
exports.getAllSoundbars = async (req, res) => {
  try {
    console.log("Getting all soundbars...");
    const soundbars = await Soundbar.find();
    console.log("Soundbar found:", soundbars.length);
    res.status(200).json(soundbars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single soundbar by ID
exports.getSoundbarById = async (req, res) => {
  try {
    const soundbar = await Soundbar.findById(req.params.id);
    if (!soundbar) {
      return res.status(404).json({ error: "Soundbar not found" });
    }
    res.status(200).json(soundbar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a soundbar
exports.updateSoundbar = async (req, res) => {
  try {
    // Validate request body
    const isValid = validateSoundbar(req.body);
    if (!isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validateSoundbar.errors,
      });
    }

    const soundbar = await Soundbar.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!soundbar) {
      return res.status(404).json({ error: "Soundbar not found" });
    }

    res.status(200).json(soundbar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a soundbar
exports.deleteSoundbar = async (req, res) => {
  try {
    const soundbar = await Soundbar.findByIdAndDelete(req.params.id);
    if (!soundbar) {
      return res.status(404).json({ error: "Soundbar not found" });
    }
    res.status(200).json({ message: "Soundbar deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
