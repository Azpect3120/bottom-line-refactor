// Dependencies
const { Router } = require("express");
const { Config } = require("pg");
const { database, updateDatabase } = require("../model/database");
const { generateDataUrl, createSecret } = require("../model/auth");
const { encryptString, decryptString } = require("../model/enc");

// Create router
const router = Router(); 

// '/settings' : Render the page
router.get("/settings", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // Ensure a user is logged in
    if (user) {
        // SQL
        const query = "SELECT secret FROM users WHERE id = $1";
        database.query(query, [ user.id ], (err, result) => {
            // Error
            if (err) {
                console.error(err);
                res.status(500).redirect("/dash/settings");
            } else {
                // Get secret 
                const secret = result.rows[0].secret;

                // Generate QR code and render
                if (secret) {
                    generateDataUrl(decryptString(secret), (err, qr_url) => {
                        if (!err) {
                            res.status(200).render("dashboard/settings", { user, qr_url, secret: decryptString(secret) });
                            return;
                        }
                    });

                // User has no secret
                } else {
                    res.status(200).render("dashboard/settings", { user, qr_url: null, secret: null });
                }
            }
        });
    // No user logged in 
    } else {
        res.status(302).redirect("/login")
    }
});


// '/settings/generateNewSecret' : Create a new secret and apply it to a user
router.post("/settings/generateNewSecret", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // Ensure user is logged in 
    if (user) {
        // Generate a new secret
        const secret = encryptString(createSecret());

        // SQL
        const query = "UPDATE users SET secret = $1 WHERE id = $2";
        const args = [ secret, user.id ];

        // Update database
        database.query(query, args, (err, result) => {
            // Error
            if (err) {
                console.error(err);
                res.status(500).redirect("/dash/settings");
            } else {
                updateDatabase(user.id, "users", query, args, result);
                res.status(301).redirect("/dash/settings");            
            }
        });
    // No user logged in
    } else {
        res.status(302).redirect("/login");
    }
});

// '/settings/disableAuth' : Create a new secret and apply it to a user
router.post("/settings/disableAuth", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // Ensure user is logged in
    if (user) {
        // SQL
        const query = "UPDATE users SET secret = null WHERE id = $1";
        const args = [ user.id ];

        // Update database
        database.query(query, args, (err, result) => {
            // Error
            if (err) {
                console.error(err);
                res.status(500).redirect("/dash/settings");
            } else {
                updateDatabase(user.id, "users", query, args, result);
                res.status(301).redirect("/dash/settings");            
            }
        });
    // No user logged in
    } else {
        res.status(302).redirect("/login");
    }
});

// '/settings/changeUsername' : Changes the username of the logged in user
router.post("/settings/changeUsername", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // Get request body
    const { newUsername, confirmPassword } = req.body;

    // Ensure user is logged in 
    if (user) {
        // Ensure password matches
        if (decryptString(user.password) === confirmPassword) {
            // SQL
            const query = "UPDATE users SET username = $1 WHERE id = $2";
            const args = [ newUsername, user.id ];

            // Update database
            database.query(query, args, (err, result) => {
                // Error
                if (err) {
                    console.error(err);
                    res.status(500).redirect("/dash/settings");
                } else {
                    updateDatabase(user.id, "users", query, args, result);
                    
                    // Update the session
                    req.session.user.username = newUsername;

                    // Redirect
                    res.status(301).redirect("/dash/settings");
                }
            });

        // INCORRECT PASSWORD
        } else {
            console.log("INCORRECT PASSWORD");
            // DO SOMETHING
        }
    // No user logged in 
    } else {
        res.status(302).redirect("/login");
    }
});

// '/settings/changePassword' : Changes the password of the logged in user
router.post("/settings/changePassword", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // Get request body
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Ensure user is logged in 
    if (user) {
        // Ensure password matches
        if (decryptString(user.password) === oldPassword) {
            // Ensure new passwords match
            if (newPassword === confirmPassword) {
                // Encrypt password
                const encryptedPassword = encryptString(confirmPassword);

                // SQL
                const query = "UPDATE users SET password = $1 WHERE id = $2";
                const args = [ encryptedPassword, user.id ];

                // Update database
                database.query(query, args, (err, result) => {
                    // Error
                    if (err) {
                        console.error(err);
                        res.status(500).redirect("/dash/settings");
                    } else {
                        updateDatabase(user.id, "users", query, args, result);
                        
                        // Update the session
                        req.session.user.password = encryptedPassword;

                        // Redirect
                        res.status(301).redirect("/dash/settings");
                    }
                });
            // New passwords do not match
            } else {
                console.log("NEW PASSWORDS DO NOT MATCH");
                // DO SOMETHING
            }

        // INCORRECT PASSWORD
        } else {
            console.log("INCORRECT PASSWORD");
            // DO SOMETHING
        }
    // No user logged in 
    } else {
        res.status(302).redirect("/login");
    }
});


// Export router
module.exports = router;
