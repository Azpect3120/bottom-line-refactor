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
        // Get the secret from the database
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
    } else {
        res.status(302).redirect("/login")
    }
});


// '/settings/generateNewSecret' : Create a new secret and apply it to a user
router.post("/settings/generateNewSecret", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // Generate a new secret
    const secret = encryptString(createSecret());

    // SQL
    const query = "UPDATE users SET secret = $1 WHERE id = $2";
    const args = [ secret, user.id ];

    // Update database
    database.query(query, args, (err, result) => {
        updateDatabase(user.id, "users", query, args, result);
        // Error
        if (err) {
            console.error(err);
            res.status(500).redirect("/dash/settings");
        } else {
            res.status(301).redirect("/dash/settings");            
        }
    });
});

// '/settings/disableAuth' : Create a new secret and apply it to a user
router.post("/settings/disableAuth", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // SQL
    const query = "UPDATE users SET secret = null WHERE id = $1";
    const args = [ user.id ];

    // Update database
    database.query(query, args, (err, result) => {
        updateDatabase(user.id, "users", query, args, result);
        // Error
        if (err) {
            console.error(err);
            res.status(500).redirect("/dash/settings");
        } else {
            res.status(301).redirect("/dash/settings");            
        }
    });
});


// Export router
module.exports = router;
