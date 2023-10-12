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

    // Ensure user is logged in 
    if (user) {
        res.status(200).render("dashboard/workloads/salesTax", { user });
    } else {
        res.status(302).redirect("/login");
    }
});

router.post("/workloads/sales-tax/update", (req, res) => {
    // Get user from session
    const user = req.session.user;

    // Ensure user is logged in 
    if (user) {
        // Get form data
        const form = req.body;

        res.status(200).json(form);

    




        // res.status(200).render("dashboard/workloads/salesTax", { user });
    } else {
        res.status(302).redirect("/login");
    }
});



// Export router
module.exports = router;
