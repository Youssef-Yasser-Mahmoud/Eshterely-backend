const mongoose = require("mongoose");

module.exports = function () {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  if (!process.env.DB_NAME) {
    console.error("DB_NAME is not defined in environment variables");
    process.exit(1);
  }

  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    })
    .then(() => {
      console.log("Connected to MongoDB");
      console.log("Database:", process.env.DB_NAME);
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};
