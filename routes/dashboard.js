// Dependencies
const bodyParser = require("body-parser");
const { Router, static } = require("express");
const { database, updateDatabase } = require("../model/database");

// Create router
const router = Router();

// Middleware
router.use(static("public"));
router.use(bodyParser.urlencoded({ extended: false }));

// '/' : load home dashboard
router.get("/home", (req, res) => {
    // Get user object from session
    const user = req.session.user;

    // Get search query from request
    const searchQuery = req.query.search;

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
                let changeLog = result.rows;

                // Filter searches
                if (searchQuery) changeLog = changeLog.filter(change => change.title.toLowerCase().includes(searchQuery.toLowerCase()) || change.description.toLowerCase().includes(searchQuery.toLowerCase()));

                // Sort update log in descending order
                changeLog.sort((a, b) => b.date - a.date);

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
router.post("/home/logChange", (req, res) => {
    // Get user object from session
    const user = req.session.user;

    // Ensure user is logged in
    if (user) {
        // Get request body
        const { title, description } = req.body;
        
        // SQL
        const query = "INSERT INTO changeLog (title, description) VALUES ($1, $2);";
        const args = [ title, description ];

        // Update database
        database.query(query, args, (err, result) => {
            // Error
            if (err) {
                console.error("Error updating change log", err);
                res.status(500).redirect("/dash/home");
            } else {
                updateDatabase(user.id, "changeLog", query, args, result);
                res.status(301).redirect("/dash/home");
            }
        });

    } else {
        res.status(301).redirect("/login");
    }
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
