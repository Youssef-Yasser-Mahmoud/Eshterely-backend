const mongoose = require("mongoose");

// Sub-schemas
const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color_code: { type: String, required: true },
    images: [{ type: String, required: true }],
    price: { type: String, required: true },
  },
  { _id: false }
);

const heroSectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    banner: { type: String, required: true },
    slogan: { type: String, required: true },
  },
  { _id: false }
);

const subInformationSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
  },
  { _id: false }
);

const informationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sub_information: [subInformationSchema],
  },
  { _id: false }
);

const detailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    information: [informationSchema],
  },
  { _id: false }
);

// Main speaker schema
const speakerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    sub_category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
    is_new: { type: Boolean, default: false },
    hero_section: heroSectionSchema,
    sub_name: { type: String, required: true },
    description: { type: String, required: true },
    colors: [colorSchema],
    warranty_duration: { type: String, required: true },
    sub_description: { type: String, required: true },
    hero_section_2: heroSectionSchema,
    details: [detailSchema],
  },
  { timestamps: true }
);

const Speaker = mongoose.model("Speakers", speakerSchema);
module.exports = Speaker;
