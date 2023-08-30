// Dependencies
const bodyParser = require("body-parser");
const { Router, static } = require("express");
const { Client } = require("pg");
const { hashString, compareHash } = require("../public/javascript/hash");
const { createSecret, validateToken } = require("../public/javascript/auth");
const { database } = require("../public/javascript/database");
const speakeasy = require("speakeasy");
const User = require("../public/javascript/user");
require("dotenv").config();

// Create router
const router = Router();

// Middleware
router.use(static("public"));
router.use(bodyParser.urlencoded({ extended: false }));

// '/login/' : Load page
router.get("/", (req, res) => {
    res.status(200).render("login");
});

// '/login/auth' : Log the user in
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
                if (compareHash(password, row.password)) {
                    user = new User(row.id, row.username, null , row.permission, row.secret);
                }
            });
            
            // Username and password match
            if (user) {
                // Redirect to auth page
                res.status(301).render("auth", { user });
            } else {
                // Redirect user to invalid page
                res.status(401).send("INVALID USERNAME OR PASSWORD!!");
            }
        }
    });   
});

// Send user object & token
// Called from authMenu.ejs to submit final auth request
// Send a valid token from user input and use the secret from the session storage
router.post("/auth", (req, res) => {
    // Hold token and session
    const { token } = req.body;
    const secret = req.session.user.secret;

    // Stores a boolean based on success of code entered
    const authed = validateToken(token, secret);

    // Handle auth
    if (authed) {
        // Redirect user to dashboard and send cookies
        res.status(301).redirect("/dash/");
    } else {
        // Error
        res.status(404).send("INVALID 2FA CODE!!");
    }
});

// Export router
module.exports = router;