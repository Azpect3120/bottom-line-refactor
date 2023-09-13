// Dependencies
const bodyParser = require("body-parser");
const { Router, static } = require("express");
const { database } = require("../model/database");
const { decryptString } = require("../model/enc");
const { restart } = require("nodemon");

// Create router
const router = Router();

// Middleware
router.use(static("public"));
router.use(bodyParser.urlencoded({ extended: false }));

// Routes
// '/accounts' : Render the accounts page and load the data
router.get("/accounts", (req, res) => {
    // Get queries from the request
    const searchQuery = req.query.search;

    // Get user from session
    const user = req.session.user;
    
    // Get clients from the database
    const sql = "SELECT * FROM clients;";
    
    database.query(sql, (err, result) => {
        // Error
        if (err) {
            console.error("Error fetching client list", err);
            res.status(500).render("dashboard/clients", { user, clients: [] });
        } else {
            // Get clients from query
            let clients = result.rows;

            // Sort clients
            clients.sort((a, b) => a.name.localeCompare(b.name));

            // Filter clients by search
            if (searchQuery) clients = clients.filter(client => client.name.includes(searchQuery));
    
            // Ensure a user is logged in
            if (user) {
                res.status(200).render("dashboard/clients", { user, clients });
            } else {
                res.status(302).redirect("/login");
            }
        }
    });
});

// '/accounts/view?id' : Render the accounts page and render an account view
router.get('/accounts/view', (req, res) => {
    // Get queries from the request
    const client_id = req.query.client;

    // Get user from session
    const user = req.session.user;

    const sql = `SELECT * FROM accounts WHERE client_id = '${client_id}'`;

    database.query(sql, (err, result) => {
        // Error
        if (err) {
            console.error("Error fetching account list", err);
            res.status(500).redirect("/dash/accounts");
        } else {
            const accounts = [];

            for (const row of result.rows) {
                console.log(row);
                accounts.push({
                    id: row.id,
                    name: row.account_name,
                    username: row.account_user,
                    password: decryptString(row.account_password),
                    notes: row.account_notes
                });
            }

            // Get client name
            const sql2 = `SELECT name FROM clients WHERE id = '${client_id}'`;

            database.query(sql2, (err, result) => {
                // Error
                if (err) {
                    console.error("Error fetching client name", err);
                    res.status(500).redirect("/dash/accounts");
                } else {
                    if (result.rows.length > 0) {
                        if (user) {
                            // Finally, render page
                            res.status(200).render("dashboard/accounts", { user, accounts, client_name: result.rows[0].name });
                        } else {
                            res.status(302).redirect("/login");
                        }
                    }
                }
            });
        }
    });
});

// '/accounts/edit?id' : Edit an account
router.get("/accounts/edit", (req, res) => {
    const account_id =req.query.id;

    res.status(200).send(account_id);

});


// Export router
module.exports = router;