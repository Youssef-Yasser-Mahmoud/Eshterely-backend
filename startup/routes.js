const speaker = require("../routes/speakers");
const televisions = require("../routes/televisions");
const headphones = require("../routes/headphones");
const soundbars = require("../routes/soundbars");
const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/speakers", speaker);
  app.use("/api/televisions", televisions);
  app.use("/api/headphones", headphones);
  app.use("/api/soundbars", soundbars);
};
