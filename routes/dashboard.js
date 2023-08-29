// Dependencies
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { Router, static }= require("express");

// Create router
const router = Router();

// Middleware
router.use(static("public"));
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));

// '/dash/' : load dashboard
router.get("/", (req, res) => {
    const username = req.cookies.username;
    const id = req.cookies.id;
    res.status(200).render("dashboard", { username, id });
});


// Export router
module.exports = router;