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
    // Validate the request body
    const valid = validateTelevision(req.body);
    if (!valid) {
      return res.status(400).json({
        error: "Invalid television data",
        details: validateTelevision.errors,
      });
    }

    const television = await Television.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!television) {
      return res.status(404).json({ message: "Television not found" });
    }

    res.json(television);
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
