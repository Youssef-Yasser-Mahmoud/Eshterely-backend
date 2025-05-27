const speaker = require("../routes/speakers");
const televisions = require("../routes/televisions");
const headphones = require("../routes/headphones");
const soundbars = require("../routes/soundbars");
const user = require("../routes/users");
const auth = require("../routes/auth");
const cart = require("../routes/cart");
const orders = require("../routes/orders");
const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/users", user);
  app.use("/api/auth", auth);
  app.use("/api/speakers", speaker);
  app.use("/api/televisions", televisions);
  app.use("/api/headphones", headphones);
  app.use("/api/soundbars", soundbars);
  app.use("/api/cart", cart);
  app.use("/api/orders", orders);
};
