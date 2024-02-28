// Dependencies
const { Router } = require("express");
const { Client } = require("pg");
const { decryptString } = require("../model/enc");
const { validateToken } = require("../model/auth");
const { database } = require("../model/database");
const User = require("../model/user");
require("dotenv").config();

// Create router
const router = Router();

// '/login/' : Load page
router.get("/", (req, res) => {
    console.log("GET /login/");
    res.status(200).render("login/menu");
});

// '/auth' : Check for valid username and password, send user to the auth page if 2FA is enabled on the user
router.post("/auth", (req, res) => {
    // Deconstruct body of the request
    const { username, password } = req.body;
    
    // Compare hash stored in DB to the users password
    database.query(`SELECT * FROM users WHERE username = '${username.trim()}'`, (error, result) => {
        // Catch errors
        if (error) {
            throw error;
        } else {
            // Find password matches
            let user;
            result.rows.forEach(row => {
                if (password === decryptString(row.password)) {
                    user = new User(row.id, row.username, row.password , row.permission, row.secret);
                }
            });
            
            // Username and password match
            if (user) {
                req.session.user = user;
                // Redirect to auth page if user has 2FA set up
                user.secret ? res.status(200).render("login/auth") : res.status(301).redirect("/dash/home")
            } else {
                // Redirect user to invalid page
                res.status(401).render("login/menu", { message: "Invalid username or password" });
            }
        }
    });   
});

// Send user object & token
// Called from authMenu.ejs to submit final auth request
// Send a valid token from user input and use the secret from the session storage
// '/verify' : If the user has 2FA enabled, validate the 2FA code here 
router.post("/verify", (req, res) => {
    // Hold token and session
    const { token } = req.body;
    const secret = decryptString(req.session.user.secret);

    // Stores a boolean based on success of code entered
    const authed = validateToken(token, secret);

    // Handle auth
    authed ? res.status(301).redirect("/dash/home") : res.status(401).render("login/auth", { message: "Incorrect authentication code" });
});

// Export router
module.exports = router;
