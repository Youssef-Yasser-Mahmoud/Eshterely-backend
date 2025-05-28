const Television = require("../models/televisions");
const validateTelevision = require("../validations/televisions.validation");

exports.getAllTelevisions = async (req, res) => {
  try {
    const televisions = await Television.find();
    res.json(televisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTelevisionById = async (req, res) => {
  try {
    const television = await Television.findById(req.params.id);
    if (!television) {
      return res.status(404).json({ message: "Television not found" });
    }
    res.json(television);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.CreateTelevision = async (req, res) => {
  try {
    // Validate the request body
    const valid = validateTelevision(req.body);
    if (!valid) {
      return res.status(400).json({
        error: "Invalid television data",
        details: validateTelevision.errors,
      });
    }

    const television = new Television(req.body);
    const newTelevision = await television.save();
    res.status(201).json(newTelevision);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTelevision = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const existingTelevision = await Television.findById(id);
    if (!existingTelevision) {
      return res.status(404).json({ message: "Television not found" });
    }

    // Convert Mongoose document to plain object
    const originalData = existingTelevision.toObject();

    // Merge updates with original data
    const merged = {
      ...originalData,
      ...updates,
      category: "televisions", // enforce required field
      sub_category: "televisions", // enforce required field
    };

    const valid = validateTelevision(merged);
    if (!valid) {
      return res.status(400).json({
        error: "Invalid television data",
        details: validateTelevision.errors,
      });
    }

    const updatedTelevision = await Television.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(updatedTelevision);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTelevision = async (req, res) => {
  try {
    const television = await Television.findByIdAndDelete(req.params.id);
    if (!television) {
      return res.status(404).json({ message: "Television not found" });
    }
    res.json({ message: "Television deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
