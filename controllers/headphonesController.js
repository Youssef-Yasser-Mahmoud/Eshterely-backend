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
    const id = req.params.id;

    // 1. Fetch the existing headphone from DB
    const existing = await Headphone.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "Headphone not found" });
    }

    // 2. Clean the incoming data (remove empty/null/undefined or empty objects)
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

    // 3. Merge existing data with cleaned update
    const merged = { ...existing.toObject(), ...cleanedData };

    // 4. Remove MongoDB metadata
    delete merged._id;
    delete merged.__v;
    delete merged.createdAt;
    delete merged.updatedAt;

    // 5. Validate the full merged data
    const isValid = validateHeadphone(merged);
    if (!isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validateHeadphone.errors,
      });
    }

    // 6. Perform update with only cleaned data
    const updated = await Headphone.findByIdAndUpdate(id, cleanedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update error:", error);
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
