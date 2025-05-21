const speaker = require("../routes/speakers");
const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/speakers", speaker);
};
