const Headphone = require("../models/headphones");
const { validateHeadphone } = require("../validations/headphones.validation");

// Create a new headphone
exports.createHeadphone = async (req, res) => {
  try {
    // Validate request body
    const isValid = validateHeadphone(req.body);
    if (!isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validateHeadphone.errors,
      });
    }

    const headphone = new Headphone(req.body);
    await headphone.save();
    res.status(201).json(headphone);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all headphones
exports.getAllHeadphones = async (req, res) => {
  try {
    console.log("Getting all headphones...");
    const headphones = await Headphone.find();
    console.log("Headphones found:", headphones.length);
    res.status(200).json(headphones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single headphone by ID
exports.getHeadphoneById = async (req, res) => {
  try {
    const headphone = await Headphone.findById(req.params.id);
    if (!headphone) {
      return res.status(404).json({ error: "Headphone not found" });
    }
    res.status(200).json(headphone);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a headphone
exports.updateHeadphone = async (req, res) => {
  try {
    // Validate request body
    const isValid = validateHeadphone(req.body);
    if (!isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validateHeadphone.errors,
      });
    }

    const headphone = await Headphone.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!headphone) {
      return res.status(404).json({ error: "Headphone not found" });
    }

    res.status(200).json(headphone);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a headphone
exports.deleteHeadphone = async (req, res) => {
  try {
    const headphone = await Headphone.findByIdAndDelete(req.params.id);
    if (!headphone) {
      return res.status(404).json({ error: "Headphone not found" });
    }
    res.status(200).json({ message: "Headphone deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
