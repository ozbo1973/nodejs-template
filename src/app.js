const express = require("express");
const path = require("path");

require("./db");

const app = express();
const pubDir = path.join(__dirname, "../public");

app.use(express.json());
app.use(express.static(pubDir));

app.get("/", (req, res) => {
  res.status(200).send("Express Server Home Page");
});

module.exports = app;
