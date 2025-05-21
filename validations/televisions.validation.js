const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true, formats: { uri: true } });

const televisionSchema = {
  type: "object",
  required: [
    "name",
    "category",
    "sub_category",
    "image",
    "price",
    "hero_section",
    "details",
  ],
  properties: {
    name: { type: "string", minLength: 1 },
    category: { type: "string", enum: ["televisions"] },
    sub_category: { type: "string", enum: ["televisions"] },
    image: {
      type: "string",
      format: "uri",
    },
    price: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    is_new: { type: "boolean" },
    hero_section: {
      type: "object",
      required: ["name", "banner", "slogan"],
      properties: {
        name: { type: "string" },
        banner: {
          type: "string",
          format: "uri",
        },
        slogan: { type: "string" },
      },
    },
    sub_name: { type: "string" },
    description: { type: "string" },
    colors: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "color_code", "images"],
        properties: {
          name: { type: "string" },
          color_code: { type: "string" },
          images: {
            type: "array",
            items: {
              type: "string",
              format: "uri",
            },
          },
        },
      },
    },
    warranty_duration: { type: "string" },
    sub_description: { type: "string" },
    hero_section_2: {
      type: "object",
      required: ["name", "banner", "slogan"],
      properties: {
        name: { type: "string" },
        banner: {
          type: "string",
          format: "uri",
        },
        slogan: { type: "string" },
      },
    },
    details: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "information"],
        properties: {
          name: {
            type: "string",
            enum: ["sound", "picture", "design", "Connectivity"],
          },
          information: {
            type: "array",
            items: {
              type: "object",
              required: ["name", "sub_information"],
              properties: {
                name: { type: "string" },
                sub_information: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["description"],
                    properties: {
                      description: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

// Compile the schema
const validate = ajv.compile(televisionSchema);

module.exports = validate;
