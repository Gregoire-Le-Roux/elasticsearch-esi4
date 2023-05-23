const express = require("express");
const bodyParser = require("body-parser");
const elasticClient = require("./elastic-client");
require("express-async-errors");

const app = express();

app.use(bodyParser.json());

// Express routes

app.listen(8080, () => {
    console.log("api started")
})


app.get("/", (req, res) => {
    res.redirect("http://localhost:3000/");
});

// Posts routes
require('./routes/commands')(app, elasticClient);

module.exports.app = app;