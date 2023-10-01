// Dependencies
const bodyParser = require("body-parser");
const { Router, static } = require("express");
const { database } = require("../model/database");

// Create router
const router = Router();

// Middleware
router.use(static("public"));
router.use(bodyParser.urlencoded({ extended: false }));

// '/' : load home dashboard
router.get("/", (req, res) => {
    // Get user object from session
    const user = req.session.user;

    // Import Change Log
    // const changeLog = require("../data/changeLog.json");

    // Ensure user is logged in 
    if (user) {
        // SQL
        const SQL = "SELECT * FROM changeLog;";

        // Query database for changes
        database.query(SQL, (err, result) => {
            // Error
            if (err) {
                console.error("Error fetching change log", err);
                res.status(404).render("dashboard/home", { user, changeLog: [] });
            } else {
                // Convert result data into change log array
                const changeLog = result.rows;

                // Format time stamp
                for (let i = 0; i < changeLog.length; i++) {
                    const date = new Date(changeLog[i].date);

                    date.setTime(date.getTime() - 3 * 60 * 60  * 1000);

                    const year = date.getFullYear();
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');
                    
                    changeLog[i].date = `${month}/${day}/${year}`;
                };
                    
                // Render webpage
                res.status(200).render("dashboard/home", { user, changeLog });
            }
        });

    } else {
        res.status(301).redirect("/login");
    }
});

// '/logChange' : Add a new change to the change log
router.post("/logChange", (req, res) => {
    // Get user object from session
    const user = req.session.user;



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
