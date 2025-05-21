const cors = require("cors");
require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const app = express();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000", // Your local frontend
  "https://your-frontend-domain.com", // Your production frontend
  process.env.RAILWAY_PUBLIC_DOMAIN, // Railway domain
  // Add more allowed origins as needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true,
  })
);

// Health check endpoint for Railway
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    environment: process.env.NODE_ENV,
    database: process.env.DB_NAME ? "configured" : "not configured",
  });
});

// Initialize application
try {
  require("./startup/prod")(app);
  require("./startup/db")();
  require("./startup/routes")(app);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    const url = process.env.RAILWAY_PUBLIC_DOMAIN
      ? `${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : `http://localhost:${PORT}`;
    console.log(`Server running at: ${url}`);
    console.log("Environment:", process.env.NODE_ENV);
  });
} catch (error) {
  console.error("Failed to start application:", error);
  process.exit(1);
}

// module.exports = app;
// module.exports.handler = serverless(app);
