// Dependencies
const { Router } = require("express");

// Create router
const router = Router();

// '/' : load dashboard
router.get("/", (req, res) => {
    // Get user object from session
    const user = req.session.user;

    // Ensure a user is logged in
    user ? res.status(200).render("dashboard/home", { user }) : res.status(301).redirect("/login")
});

// '/logout' : logout of dashboard
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
