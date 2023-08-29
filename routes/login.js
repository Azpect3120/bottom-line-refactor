// Dependencies
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { Router, static } = require("express");
const { Client } = require("pg");
const { hashString, compareHash } = require("../public/javascript/hash");
const { database } = require("../public/javascript/database");

// Create router
const router = Router();

// Middleware
router.use(static("public"));
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));

// '/login/' : Load page
router.get("/", (req, res) => {
    res.status(200).render("login");
});

// '/login/login' : Log the user in
router.post("/login", (req, res) => {
    // Deconstruct body of the request
    const { username, password } = req.body;
    
    // Compare hash stored in DB to the users password
    database.query(`SELECT password, id FROM users WHERE username = '${username.trim()}'`, (error, result) => {
        // Catch errors
        if (error) {
            throw error;
        } else {
            // Find password matches
            let valid = false;
            let id;
            result.rows.forEach(row => {
                if (compareHash(password, row.password)) {
                    id = row.id;
                    valid = true;
                }
            });
            
            // Send response
            if (valid) {
                // Define cookies
                res.cookie("id", id);
                res.cookie("username", username);
                // Redirect user to dashboard and send cookies
                res.status(301).redirect("/dash/");
            } else {
                res.status(401).send("INVALID USERNAME OR PASSWORD!!");
            }
        }
    });   
});

// Export router
module.exports = router;