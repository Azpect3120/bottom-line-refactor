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
    // Get user object from session
    const user = req.session.user;

    // Ensure a user is logged in
    if (user) {
        res.status(200).render("dashboard", { user });

    // User is not found in the session: return to login page
    } else {
        res.status(301).redirect("/login");
    }
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

// Store pages
const pages = new Map();
pages.set("/home", "dashboard");
pages.set("/accounts", "accounts");
pages.set("/workload", "workload");
pages.set("/calender", "calender");
pages.set("/timecards", "timeCards");
pages.set("/devportal", "devPortal");
pages.set("/settings", "settings");

// '/dash/<page>' : dynamically load pages on the dashboard
router.get("/*", (req, res) => {
    // Get user object from session
    const user = req.session.user;
   
    // Ensure a user is loaded into the session
    if (user) {
        // Load pages
        if (pages.has(req.url)) {
            res.status(200).render(pages.get(req.url), { user })
        } else {
            res.status(404).send("404: Page not found");
        }
    // Session is empty
    } else {
        res.status(301).redirect("/login");
    }
});


// Export router
module.exports = router;