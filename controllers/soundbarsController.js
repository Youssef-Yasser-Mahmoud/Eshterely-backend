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

exports.updateSoundbar = async (req, res) => {
  try {
    const id = req.params.id;

    // Step 1: Find the existing soundbar
    const existing = await Soundbar.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "Soundbar not found" });
    }

    // Step 2: Clean incoming data (remove empty strings, null, undefined, empty objects)
    const cleanedData = {};
    for (const key in req.body) {
      const value = req.body[key];
      if (
        value !== "" &&
        value !== undefined &&
        value !== null &&
        !(typeof value === "object" && Object.keys(value).length === 0)
      ) {
        cleanedData[key] = value;
      }
    }

    // Step 3: Merge cleaned data into the existing full object
    const merged = { ...existing.toObject(), ...cleanedData };

    // Step 4: Remove MongoDB metadata before validation
    delete merged._id;
    delete merged.__v;
    delete merged.createdAt;
    delete merged.updatedAt;

    // Step 5: Validate the merged object
    const isValid = validateSoundbar(merged);
    if (!isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validateSoundbar.errors,
      });
    }

    // Step 6: Update only the cleaned fields in the DB
    const updated = await Soundbar.findByIdAndUpdate(id, cleanedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update error:", error);
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
