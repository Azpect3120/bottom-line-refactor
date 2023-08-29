// Dependencies
const { Client } = require("pg");
require("dotenv").config();

// Create database object
const database = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432
});

// Connect to database
database.connect()
    .then(() => console.log("Connection to database successful..."))
    .catch(err => console.error(err));

// Export object
exports.database = database;