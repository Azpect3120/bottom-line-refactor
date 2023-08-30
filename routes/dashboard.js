// Dependencies
const bodyParser = require("body-parser");
const { Router, static }= require("express");
require("dotenv").config();

// Create router
const router = Router();

// Middleware
router.use(static("public"));
router.use(bodyParser.urlencoded({ extended: false }));

// '/dash/' : load dashboard
router.get("/", (req, res) => {
    const user = req.session.user;
    const username = user.username;
    const id = user.id;
    res.status(200).render("dashboard", { username, id });
});

// '/dash/logout' : logout of dashboard
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session: ", err);
            res.status(500).send("ERROR DESTROYING SESSION!");
        } else {
            res.status(302).redirect("/login");
        }
    });
});


// Export router
module.exports = router;