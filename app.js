// Dependencies
const express = require("express");
const app = express();
require("dotenv").config();

// Views & Template Engines
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware
app.use(express.static("public"));
app.use(express.static("."));

// Import external routes
const loginRoutes = require("./routes/login");
const dashboardRoutes = require("./routes/dashboard");

// Mount external routes
app.use("/login", loginRoutes);
app.use("/dash", dashboardRoutes);

// Launch Server
const PORT = process.env.PORT;
app.listen(PORT, err => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server is listening on http://localhost:${PORT}`);
    }
});