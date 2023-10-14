// Dependencies
const { Router } = require("express");
const { Client } = require("pg");
const { decryptString } = require("../model/enc");
const { validateToken } = require("../model/auth");
const { database, updateDatabase } = require("../model/database");
const User = require("../model/user");
require("dotenv").config();

// Create router
const router = Router();

// '/workloads/blbs' : Load the blbs workload page
router.get("/workloads/blbs", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // Ensure user is logged in 
    if (user) {
        res.status(200).render("dashboard/workloads/blbs", { user });
    } else {
        res.status(302).redirect("/login");
    }
});



// '/workloads/payroll' : Load the client payroll workload page
router.get("/workloads/payroll", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // Ensure user is logged in 
    if (user) {
        res.status(200).render("dashboard/workloads/payroll", { user });
    } else {
        res.status(302).redirect("/login");
    }
});
    
    
// '/workloads/sales-tax' : Load the blbs workload page
router.get("/workloads/sales-tax", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // Get params from the search query
    let { search, year } = req.query;

    // Blank queries
    search = typeof search === "undefined" ? "" : search;
    year = typeof year === "undefined" ? new Date().getFullYear() : year;

    // Ensure user is logged in 
    if (user) { 
        // Page data
        const data = {
            clients: [],
            selected_year: year,
            current_year: new Date().getFullYear()
        }

        // SQL
        const query = "SELECT * FROM salestaxworkload INNER JOIN clients ON salestaxworkload.client_id = clients.id WHERE year = $1";
        const args = [ year ];

        database.query(query, args, (err, result) => {
            if (err) {
                console.error("Error fetching workload", err);
                res.status(500).render("dashboard/workloads/salesTax", { user, data });
            } else {
                data.clients = search != "" ? result.rows.filter(client => client.name.includes(search)) : result.rows;
                console.log(data);
                res.status(200).render("dashboard/workloads/salesTax", { user, data });
            }
        });
    } else {
        res.status(302).redirect("/login");
    }
});

// Sky High Auto
// a373da8f-19e3-4cac-ab3a-33130829f88c

router.post("/workloads/sales-tax/update", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // Ensure user is logged in 
    if (user) {
        // Get formdata
        const form = req.body;

        // SQL
        const query = "UPDATE salestaxworkload SET frequency = $1, " +
            "jan = $2, feb = $3, mar = $4, apr = $5, may = $6, jun = $7, " +
            "jul = $8, aug = $9, sep = $10, oct = $11, nov = $12, dec = $13 " +
            "WHERE id = $14";
        const args = [
            form.frequency,
            form.jan,
            form.feb,
            form.mar,
            form.apr,
            form.may,
            form.jun,
            form.jul,
            form.aug,
            form.sep,
            form.oct,
            form.nov,
            form.dec,
            form.id
        ];

        // Update database
        database.query(query, args, (err, result) => {
            if (err) {
                console.error("Error updating workload", err);
                res.status(500).redirect("/dash/workloads/sales-tax");
            } else {
                updateDatabase(user.id, "salestaxworkload", query, args, result);
                res.status(201).redirect("/dash/workloads/sales-tax");
            }
        });
        // res.status(200).json(form);
    } else {
        res.status(302).redirect("/login");
    }
});



// Export router
module.exports = router;
