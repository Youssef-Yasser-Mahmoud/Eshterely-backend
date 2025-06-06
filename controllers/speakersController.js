const Speaker = require("../models/speakers");
const { validateSpeaker } = require("../validations/speakers.validation");

// Create a new speaker
exports.createSpeaker = async (req, res) => {
  try {
    // Validate request body
    const isValid = validateSpeaker(req.body);
    if (!isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validateSpeaker.errors,
      });
    }

    const speaker = new Speaker(req.body);
    await speaker.save();
    res.status(201).json(speaker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all speakers
exports.getAllSpeakers = async (req, res) => {
  try {
    console.log("Getting all speakers...");
    const speakers = await Speaker.find();
    console.log("Speakers found:", speakers.length);
    res.status(200).json(speakers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single speaker by ID
exports.getSpeakerById = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) {
      return res.status(404).json({ error: "Speaker not found" });
    }
    res.status(200).json(speaker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a speaker
exports.updateSpeaker = async (req, res) => {
  try {
    // 1. Get the existing speaker
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) {
      return res.status(404).json({ error: "Speaker not found" });
    }

    // 2. Merge existing data with update (and convert to plain object)
    const existingData = speaker.toObject();
    const merged = { ...existingData, ...req.body };

    // ❌ Remove _id and any other non-schema fields
    delete merged._id;
    delete merged.__v;

    // 3. Validate the merged object
    const isValid = validateSpeaker(merged);
    if (!isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validateSpeaker.errors,
      });
    }

    // 4. Perform update
    const updated = await Speaker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a speaker
exports.deleteSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.findByIdAndDelete(req.params.id);
    if (!speaker) {
      return res.status(404).json({ error: "Speaker not found" });
    }
    res.status(200).json({ message: "Speaker deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
