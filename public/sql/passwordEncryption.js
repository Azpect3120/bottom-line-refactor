const { database } = require("../../model/database");
const { encryptString, decryptString }  = require("../../model/enc"); 




async function encrypt () {
    const result = await database.query("SELECT * FROM accounts;");

    for (const row of result.rows) {
        const account = row;
        const id = account.id;
        const oldPassword = row.account_password;
        const newPassword = encryptString(oldPassword);

        const res = await database.query("UPDATE accounts SET account_password = $1 WHERE id = $2", [ newPassword, id ]);
        console.log(res);


    }
}

encrypt();