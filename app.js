// Dependencies
const express = require("express");
const app = express();
const session = require("express-session");
require("dotenv").config();

// Views & Template Engines
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware
app.use(express.static("public"));
app.use(express.static("."));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000,
    }
}));

// Import external routes
const loginRoutes = require("./routes/login");
const dashboardRoutes = require("./routes/dashboard");

// Mount external routes
app.use("/login", loginRoutes);
app.use("/dash", dashboardRoutes);

// Redirect from blank to login page
app.get("/", (req, res) => {
    res.status(301).redirect("/login");
});

// Launch Server
const PORT = process.env.PORT;
app.listen(PORT, err => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server is listening on http://localhost:${PORT}`);
    }
});