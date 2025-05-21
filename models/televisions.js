const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
  name: String,
  color_code: String,
  images: [String],
});

const subInformationSchema = new mongoose.Schema({
  description: String,
});

const informationSchema = new mongoose.Schema({
  name: String,
  sub_information: [subInformationSchema],
});

const detailSchema = new mongoose.Schema({
  name: String,
  information: [informationSchema],
});

const heroSectionSchema = new mongoose.Schema({
  name: String,
  banner: String,
  slogan: String,
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sub_category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    is_new: {
      type: Boolean,
      default: false,
    },
    hero_section: heroSectionSchema,
    sub_name: String,
    description: String,
    colors: [colorSchema],
    warranty_duration: String,
    sub_description: String,
    hero_section_2: heroSectionSchema,
    details: [detailSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Televisions", productSchema);

module.exports = Product;
