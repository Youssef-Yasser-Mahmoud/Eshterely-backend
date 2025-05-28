const { default: Ajv } = require("ajv");
const ajv = new Ajv({ formats: { uri: true } });

const speakerSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    category: { type: "string", minLength: 1 },
    sub_category: { type: "string", minLength: 1 },
    image: { type: "string", format: "uri" },
    price: { type: "string", pattern: "^[0-9]+$" },
    is_new: { type: "boolean" },
    hero_section: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1 },
        banner: { type: "string", format: "uri" },
        slogan: { type: "string", minLength: 1 },
      },
      required: ["name", "banner", "slogan"],
      additionalProperties: false,
    },
    sub_name: { type: "string", minLength: 1 },
    description: { type: "string", minLength: 1 },
    colors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          color_code: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
          images: {
            type: "array",
            items: { type: "string", format: "uri" },
            minItems: 1,
          },
          price: { type: "string", pattern: "^[0-9]+$" },
        },
        required: ["name", "color_code", "images", "price"],
        additionalProperties: false,
      },
      minItems: 1,
    },
    warranty_duration: { type: "string", pattern: "^[0-9]+$" },
    sub_description: { type: "string", minLength: 1 },
    hero_section_2: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1 },
        banner: { type: "string", format: "uri" },
        slogan: { type: "string", minLength: 1 },
      },
      required: ["name", "banner", "slogan"],
      additionalProperties: false,
    },
    details: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          information: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", minLength: 1 },
                sub_information: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      description: { type: "string", minLength: 1 },
                    },
                    required: ["description"],
                    additionalProperties: false,
                  },
                  minItems: 1,
                },
              },
              required: ["name", "sub_information"],
              additionalProperties: false,
            },
            minItems: 1,
          },
        },
        required: ["name", "information"],
        additionalProperties: false,
      },
      minItems: 1,
    },
  },
  required: [
    "name",
    "category",
    "sub_category",
    "image",
    "price",
    "is_new",
    "hero_section",
    "sub_name",
    "description",
    "colors",
    "warranty_duration",
    "sub_description",
    "hero_section_2",
    "details",
  ],
};

const validateSpeaker = ajv.compile(speakerSchema);
module.exports = { validateSpeaker };
