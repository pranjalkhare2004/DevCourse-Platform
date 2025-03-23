require("dotenv").config(); // Required here as well!


const mysql = require("mysql2/promise");


async function initializeConnection() {
  try {
    console.log({
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME,
    });
    
    const connectionConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

    const connection = await mysql.createConnection(connectionConfig);

    return connection;
  } catch (err) {
    console.error("Error connecting to database:", err);
    throw err;
  }
}

module.exports = { initializeConnection };