// Dependencies
const { Router } = require("express");
const { Config } = require("pg");
const { database } = require("../model/database");

// Create router
const router = Router(); 

// '/' : Render the page
router.get("/", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // Ensure a user is logged in
    if (user) {
        res.status(200).render("settings", { user });
    } else {
        res.status(302).redirect("/login");
    }
});


// '/changeUsername' : Changes the username of the logged in user
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
        });

    // Inputted username does not match
    } else {
        res.status(401).render("settings", { user, message: "Current username does not match" });
    }
});




// Export router
module.exports = router;