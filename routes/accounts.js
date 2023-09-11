// Dependencies
const bodyParser = require("body-parser");
const { Router, static } = require("express");
const { database } = require("../model/database");

// Create router
const router = Router();

// Middleware
router.use(static("public"));
router.use(bodyParser.urlencoded({ extended: false }));

// Routes
// '/' : Render the accounts page and load the data
router.get("/", (req, res) => {
    // Get user from session
    const user = req.session.user;
    
    // Get clients from the database
    const sql = "SELECT * FROM clients;";
    
    database.query(sql, (err, result) => {
        // Error
        if (err) {
            console.error("Error fetching client list", err);
            res.status(500).render("dashboard/accounts", { user, clients: [] });
        } else {
            // Get clients from query
            const clients = result.rows;
    
            // Ensure a user is logged in
            if (user) {
                res.status(200).render("dashboard/accounts", { user, clients });
            } else {
                res.status(302).redirect("/login");
            }
        }
    });

});


// Export router
module.exports = router;