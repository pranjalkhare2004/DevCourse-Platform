// test-db.js (Temporary file for testing only)
require("dotenv").config(); // Required here as well!

const { initializeConnection } = require("./config/database");

initializeConnection()
  .then(() => console.log("✅ Database connection successful"))
  .catch((err) => console.error("❌ Database connection failed:", err));
