// Dependencies
const bodyParser = require("body-parser");
const { Router, static } = require("express");
const { database, updateDatabase } = require("../model/database");
const { encryptString, decryptString } = require("../model/enc");

// Create router
const router = Router();

// Middleware
router.use(static("public"));
router.use(bodyParser.urlencoded({ extended: false }));

// Routes
// '/accounts?search=<search>' : Render the accounts page and load the data
router.get("/accounts", (req, res) => {
    // Get queries from the request
    const searchQuery = req.query.search;

    // Get user from session
    const user = req.session.user;
    
    // Ensure user is logged in
    if (user) {
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
                if (searchQuery) clients = clients.filter(client => client.name.includes(searchQuery.toLowerCase()));
        
                res.status(200).render("dashboard/clients", { user, clients });
            }
        });
    } else {
        res.status(302).redirect("/login");
    }
});

// '/accounts/view?id' : Render the accounts page and render an account view
router.get('/accounts/view', (req, res) => {
    // Get queries from the request
    const client_id = req.query.client;

    // Get user from session
    const user = req.session.user;

    // Ensure user is logged in
    if (user) {
        // Get accounts
        database.query("SELECT * FROM accounts WHERE client_id = $1;", [ client_id ], (err, result) => {
            // Error
            if (err) {
                console.error("Error fetching account list", err);
                res.status(500).redirect("/dash/accounts");
            } else {
                // Collect list of accounts
                const accounts = [];
                for (const row of result.rows) {
                    accounts.push({
                        id: row.id,
                        name: row.account_name,
                        username: row.account_user,
                        password: decryptString(row.account_password),
                        notes: row.account_notes
                    });
                }

                // Sort accounts
                accounts.sort((a, b) => a.name.localeCompare(b.name));
                
                // Get client name
                database.query("SELECT name FROM clients WHERE id = $1;", [ client_id ], (err, result) => {
                    // Error
                    if (err) {
                        console.error("Error fetching client name", err);
                        res.status(500).redirect("/dash/accounts");
                    } else {
                        if (result.rows.length > 0) {
                            res.status(200).render("dashboard/accounts", { user, accounts, client_name: result.rows[0].name, client_id });
                        }
                    }
                });
            }
        });
    } else {
        res.status(302).redirect("/login");
    }
});

// '/accounts/edit/client' : Edit a client (name)
router.post("/accounts/edit/client", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // Get body from request
    const client_id = req.body.client_id;
    const new_client_name = req.body.client_name;

    // Ensure user is logged in
    if (user) {
        // SQL
        const query = "UPDATE clients SET name = $1 WHERE id = $2;";
        const args = [ new_client_name, client_id ];

        // Update database
        database.query(query, args, (err, result) => {
            if (err) {
                console.error("Error updating client name", err);
                res.status(500).redirect("/dash/accounts");
            } else {
                updateDatabase(req.session.user.id, "clients", query, args, result);
                res.status(301).redirect("/dash/accounts");
            }
        });
    } else {
        res.status(302).redirect("/login");
    }
}); 

// '/accounts/edit/account' : Edit an account (name, user, password, notes)
router.post("/accounts/edit/account", (req, res) => {
    // Get user from session
    const user = req.session.user;
        
    // Get body from request
    const account = {
        id: req.body.id,
        name: req.body.account_name,
        user: req.body.account_user,
        password: encryptString(req.body.account_password),
        notes: req.body.account_notes
    };

    // Ensure user is logged in
    if (user) {
        // SQL
        const query = "UPDATE accounts SET account_name = $1, account_user = $2, account_password = $3, account_notes = $4 WHERE id = $5;";
        const args = [ account.name, account.user, account.password, account.notes, account.id ];

        // Update database
        database.query(query, args, (err, result) => {
            if (err) {
                console.error("Error updating account details", err);
                res.status(500).redirect(`/dash/accounts/view?client=${req.body.client_id}`);
            } else {
                updateDatabase(req.session.user.id, "accounts", query, args, result);
                res.status(301).redirect(`/dash/accounts/view?client=${req.body.client_id}`);
            }
        });
    } else {
        res.status(302).redirect("/login");
    }
});

// '/accounts/add/account' : Add an account (name, user, password, notes)
router.post("/accounts/add/account", (req, res) => {
    // Get user from session
    const user = req.session.user;
        
    // Get body from request
    const account = {
        name: req.body.name,
        user: req.body.user,
        password: encryptString(req.body.password),
        notes: req.body.notes
    };
    
    // Ensure user is logged in
    if (user) {
        // SQL
        const query = "INSERT INTO accounts (client_id, account_name, account_user, account_password, account_notes) VALUES ($1, $2, $3, $4, $5);";
        const args = [ req.body.client_id, account.name, account.user, account.password, account.notes ];

        // Update database
        database.query(query, args, (err, result) => {
            if (err) {
                console.error("Error adding account to client", err);
                res.status(500).redirect(`/dash/accounts/view?client=${req.body.client_id}`);
            } else {
                updateDatabase(req.session.user.id, "accounts", query, args, result);
                res.status(301).redirect(`/dash/accounts/view?client=${req.body.client_id}`);
            }
        });
    } else {
        res.status(302).redirect("/login");
    }
});

// 'accounts/add/client' : Add a client (name)
router.post("/accounts/add/client", (req, res) => {
    // Get user from session
    const user = req.session.user;
        
    // Get body from request
    const { name } = req.body;

    // Ensure user is logged in 
    if (user) {
        // SQL
        const query = "INSERT INTO clients (name) VALUES ($1);";
        const args = [ name.toLowerCase() ];

        // Update database
        database.query(query, args, (err, result) => {
            if (err) {
                console.error("Error creating new client", err);
                res.status(500).redirect("/dash/accounts");
            } else {
                updateDatabase(user.id, "clients", query, args, result);
                res.status(301).redirect("/dash/accounts");
            }
        });
    } else {
        res.status(302).redirect("/login");
    }
}); 

// '/accounts/delete/client' : Deletes a client from the database
router.post("/accounts/delete/client", (req, res) => {
    // Get user object from session
    const user = req.session.user;

    // Get body from request
    const client_id = req.body.client_id;

    // Ensure user exists
    if (user) {
        // Ensure user has permission to delete
        if (user.permission.toLowerCase() === "dev" || user.permission.toLowerCase() === "admin") {
            // SQL
            const query = `DELETE FROM clients WHERE id = $1;`;
            const args = [ client_id ];

            // Query database
            database.query(query, args,(err, result) => {
                if (err) {
                    console.error("Error deleting client", err);
                    res.status(500).redirect("/dash/accounts");
                } else {
                    updateDatabase(user.id, "clients", query, args, result);
                    res.status(204).redirect("/dash/accounts");
                }
            });

        // Redirect user that doesn't have permission
        } else {
            res.status(401).render("pop-ups/unauthorized", { user });
        }
    } else {
        res.status(302).redirect("/login");
    }
});

// '/accounts/delete/account' : Deletes an account from the database
router.post("/accounts/delete/account", (req, res) => {
    // Get user object from session
    const user = req.session.user;

    // Get body from request
    const account_id = req.body.account_id;

    // Ensure user exists
    if (user) {
        // Ensure user has permission to delete
        if (user.permission.toLowerCase() === "dev" || user.permission.toLowerCase() === "admin") {
            // SQL
            const query = `DELETE FROM accounts WHERE id = $1;`;
            const args = [ account_id ];            

            // Query database
            database.query(query, args,(err, result) => {
                if (err) {
                    console.error("Error deleting account", err);
                    res.status(500).redirect("/dash/accounts");
                } else {
                    updateDatabase(user.id, "accounts", query, args, result);
                    res.status(204).redirect("/dash/accounts");
                }
            });

        // Redirect user that doesn't have permission
        } else {
            res.status(401).render("pop-ups/unauthorized", { user });
        }
    } else {
        res.status(302).redirect("/login");
    }
});

// Export router
module.exports = router;
