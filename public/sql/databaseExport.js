const { Client }= require("pg");
const { database } = require("../../model/database");

const OldClient = new Client({
    user: "hmshbslo",
    host: "mahmud.db.elephantsql.com",
    database: "hmshbslo",
    password: "YyvLFj1UtYu99TwegfPHL54jTTpLgD5l",
    port: 5432

});

OldClient.connect()
  .then(() => console.log("Connection to import DB..."))
  .catch(err => console.error(err));


async function addToNewDatabase (clientName) {
    // await database.query("INSERT INTO clients (name) VALUES ($1);", [clientName.toLowerCase()]);
}


async function importFromDatabase () {
    const result = await OldClient.query("SELECT * FROM clients WHERE id > 0;");
    for (const row of result.rows) {
        await addToNewDatabase(row.name);
    }
}


importFromDatabase();

// USED TO IMPORT DATA FROM THE OLD DATABASE TO THE NEW DATABASE