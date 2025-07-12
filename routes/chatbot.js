const express = require("express");
const { handleChatRequest } = require("../controllers/chatbot.controller");

const router = express.Router();

router.post("/", handleChatRequest);

router.get("/ping", (req, res) => {
  res.json({ message: "Chatbot is active" });
});

module.exports = router;
