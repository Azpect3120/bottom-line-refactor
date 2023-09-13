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

/**
 * 
 * @param {string} clientName 
 * @param {{name: string, user: string, password: string, notes: string}} account 
 */
async function addToNewDatabase (clientName, account) {
    const result = await database.query(`SELECT id FROM clients WHERE name ILIKE '${clientName}'`);
    for (const row of result.rows) {
        const clientId = row.id;

        const res = await database.query(`
            INSERT INTO accounts 
            (client_id, account_name, account_user, account_password, account_notes) 
            VALUES ($1, $2, $3, $4, $5);
        `, [clientId, account.name, account.user, account.password, account.notes]);
        console.log(res);
    }
}


async function importFromDatabase () {
    const result = await OldClient.query("SELECT clients.name, accounts.account_name, account_user, account_password, account_notes FROM clients INNER JOIN accounts ON clients.id = accounts.client_id;");
    for (const row of result.rows) {
        await addToNewDatabase(row.name, { name: row.account_name || "", user: row.account_user || "", password: row.account_password || "", notes: row.account_notes || "" });
    }
}

async function importFromArray () {
    const array = [
        {
            name: "kamper estrada",
            account_name: "Ryan's Rent Payment",
            account_user: "connie@bottomlinebiz.net",
            account_password: "Books*2023!$",
            account_notes: ""
        },
        {
            name: "tim kamper pc",
            account_name: "Sales Tax Report",
            account_user: "tkamper@lawphx.com",
            account_password: "Taxes*2024!$",
            account_notes: "Pin 194714"
        },
        {
            name: "az fearless recovery",
            account_name: "Desert Fin CU",
            account_user: "Pin 194714",
            account_password: "OD@aT2023",
            account_notes: ""
        },
        {
            name: "maricopa community college",
            account_name: "Hayden ID",
            account_user: "HAY2158614@maricopa.edu",
            account_password: "Panther4487!",
            account_notes: "ID 36952745 PIN 4487 HAY2158614"
        },
    ]

    for (const row of array) {
        console.log(row);
        await addToNewDatabase(row.name, { name: row.account_name || "", user: row.account_user || "", password: row.account_password || "", notes: row.account_notes || "" });
    }


}


// importFromArray();

// USED TO IMPORT DATA FROM THE OLD DATABASE TO THE NEW DATABASE