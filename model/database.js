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

/**
 * Log changes into the update database 
 * @param {string} userId
 * @param {string} tableName
 * @param {string} query 
 * @param {string[]} args 
 * @param {QueryResult<any>} result 
 */
function updateDatabase (userId, tableName, query, args, result)
{
    const updateQuery = "INSERT INTO updates (user_id, table_name, action, row_count, statement, arguments) VALUES ($1, $2, $3, $4, $5, $6);";
    const updateArguments = [ userId, tableName, result.command, result.rowCount, query, args.join(",") ];
    
    database.query(updateQuery, updateArguments, (err, result) => {
        if (err) {
            throw new Error(err);
        } else {
            return result;
        }
    });
}

// Export object & functions
exports.database = database;
exports.updateDatabase = updateDatabase;