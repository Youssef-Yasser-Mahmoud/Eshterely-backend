const cors = require("cors");
require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");

const app = express();

// Fix Cross-Origin-Opener-Policy
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://eshtrely.netlify.app",
  process.env.RAILWAY_PUBLIC_DOMAIN?.replace(/\/$/, ""),
].filter(Boolean);

console.log("Allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.log("CORS blocked request from:", origin);
      return callback(new Error("CORS policy: Origin not allowed"), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true,
  })
);

// Health check
app.get("/", (req, res) => {
  try {
    res.status(200).json({
      status: "ok",
      message: "Serverless Express running on Vercel!",
      environment: process.env.NODE_ENV,
      database: process.env.DB_NAME ? "configured" : "not configured",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ status: "error", message: "Health check failed" });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(500).json({
    error: "Something broke!",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// Startup logic
try {
  console.log("Starting Express app initialization...");
  require("./startup/prod")(app);
  require("./startup/db")();
  require("./startup/routes")(app);
  console.log("App initialized.");
} catch (error) {
  console.error("Startup failed:", error);
}

if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => {
    console.log("Local server started on port 5000");
  });
}

// Export as Serverless Function for Vercel
module.exports = app;
module.exports.handler = serverless(app);
