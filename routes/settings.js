// Dependencies
const { Router, static } = require("express");
const bodyParser = require("body-parser");
const { Config } = require("pg");
const { database } = require("../public/javascript/database");

// Create router
const router = Router(); 

// Middleware
router.use(static("public"));
router.use(bodyParser.urlencoded({ extended: false }));

// '/settings/changeUsername' : Changes the username of the logged in user
router.post("/changeUsername", (req, res) => {
    // Get user object stored in session
    const user = req.session.user;

    // Get request params
    const { currentUsername, newUsername } = req.body;
    
    // Check if inputted username matches the username
    if (currentUsername === user.username) {
        // Create SQL query
        const sql = "UPDATE users SET username = $1 WHERE username = $2";
        const values = [newUsername, user.username];

        // Run query
        database.query(sql, values, (err, result) => {
            // Error
            if (err) {
                console.error("Error updating username", err);
                res.status(500).render("settings", { user, message: "Unable to update user settings" });
            } else {
                // Update user object in session
                user.username = newUsername;
                req.session.user = user;
            
                // Redirect back to settings page
                res.status(301).redirect("/dash/settings");
            }
            console.log(result);
        });

    // Inputted username does not match
    } else {
        res.status(401).render("settings", { user, message: "Current username does not match" });
    }
});




// Export router
module.exports = router;