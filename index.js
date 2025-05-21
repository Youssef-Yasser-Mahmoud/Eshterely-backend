const cors = require("cors");
require("dotenv").config();
const express = require("express");
const app = express();

// Log environment variables (without sensitive data)
console.log("Environment Check:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("RAILWAY_PUBLIC_DOMAIN:", process.env.RAILWAY_PUBLIC_DOMAIN);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  console.error("Stack trace:", err.stack);
  res.status(500).json({
    error: "Something broke!",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000", // Your local frontend
  process.env.RAILWAY_PUBLIC_DOMAIN
    ? process.env.RAILWAY_PUBLIC_DOMAIN.replace(/\/$/, "")
    : null,
  // Add more allowed origins as needed
].filter(Boolean);

console.log("Allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        console.log("CORS blocked request from:", origin);
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
  try {
    res.status(200).json({
      status: "ok",
      message: "Server is running",
      environment: process.env.NODE_ENV,
      database: process.env.DB_NAME ? "configured" : "not configured",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ status: "error", message: "Health check failed" });
  }
});

// Initialize application
async function startServer() {
  try {
    console.log("Starting server initialization...");

    // Initialize middleware and routes
    require("./startup/prod")(app);
    console.log("Production middleware initialized");

    // Initialize database
    require("./startup/db")();
    console.log("Database initialization started");

    // Initialize routes
    require("./startup/routes")(app);
    console.log("Routes initialized");

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      const url = process.env.RAILWAY_PUBLIC_DOMAIN
        ? process.env.RAILWAY_PUBLIC_DOMAIN.replace(/\/$/, "")
        : `http://localhost:${PORT}`;
      console.log(`Server running at: ${url}`);
      console.log("Environment:", process.env.NODE_ENV);
    });

    // Handle server errors
    server.on("error", (error) => {
      console.error("Server error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

// Start the server
startServer();

