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
                    
                    console.log(updates);
                    

                    res.status(200).render("dashboard/devPortal", { user, updates });
                } 
            });
        
        } else {
            // Redirect user that doesn't have permission
        }

    } else {
        res.status(302).redirect("/login");
    }
});


// Export router
module.exports = router;