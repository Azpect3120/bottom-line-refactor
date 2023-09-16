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
// '/dev-portal' : Render the developer portal and load the data
router.get("/dev-portal", (req, res) => {
    // Get user object from session
    const user = req.session.user;

    // Get queries from the url
    const searchQuery = req.query.search;

    // Ensure user exists 
    if (user) {     
        // Ensure user has dev permissions
        if (user.permission.toLowerCase() === "dev") {
            // SQL
            const query = "SELECT * FROM updates"; 

            // Query database
            database.query(query, (err, result) => {
                // Error
                if (err) {
                    console.error("Error fetching update list", err);
                    res.status(500).render("dashboard/devPortal", { user, updates: [] });
                } else {
                    // Get update list from database
                    let updates = result.rows;

                    // Filter by search query
                    if (searchQuery) updates = updates.filter(update => update.table_name.toLowerCase().includes(searchQuery.toLowerCase()));

                    // Sort updates
                    updates = updates.sort((a, b) => {
                        a = new Date(a.timestamp);
                        b = new Date(b.timestamp);
                        return b - a;
                    });

                    // Render the page with the updates
                    res.status(200).render("dashboard/devPortal", { user, updates });
                } 
            });
        
        } else {
            // Redirect user that doesn't have permission
            res.status(401).redirect("/dash");
        }

    } else {
        res.status(302).redirect("/login");
    }
});

// '/dev-portal/view?id=<id>' : Displays detailed information about an database update 
router.get("/dev-portal/view", (req, res) => {
    // Get the query body
    const update_id = req.query.id;

    // Get user objet from session
    const user = req.session.user;

    // Ensure user exists
    if (user) {
        // Ensure user has dev permissions
        if (user.permission.toLowerCase() === "dev")  {
            // Query database for update
            database.query("SELECT * FROM updates WHERE id = $1", [ update_id ], (err, result) => {
                // Error
                if (err) {
                    console.error("Error fetching update details", err);
                    res.status(500).redirect("/dash/dev-portal");
                } else {
                    // Get update from the query
                    const update = result.rows[0];

                    // Query database for user name
                    database.query("SELECT * FROM users WHERE id = $1", [ update.user_id ], (err, result) => {
                        // Error
                        if (err) {
                            console.error("Error fetching update username", err);
                            res.status(500).redirect("/dash/dev-portal");
                        } else {
                            // Update the username on the update object
                            update.username = result.rows[0].username;

                            // Reformat argument array
                            const args = update.arguments.split(",");
                            for (let i = 0; i < args.length; i++) {
                                args[i] = `$${i+1} : ${args[i]}`;
                            }
                            update.arguments = args.join("<br>");

                            // Render page with data
                            res.status(200).render("dashboard/update", { user, update })
                        }
                    });
                }
            });
        } else {
            // Redirect user that doesn't have permission
            res.status(401).redirect("/dash");
        }
       
    } else {
        res.status(302).redirect("/login");
    }
});


// Export router
module.exports = router;