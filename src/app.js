const express = require("express");
const morgan = require("morgan");
const path = require("path");

/* database require */
require("./db").then(() => console.log("DB Connected"));

const app = express();
const pubDir = path.join(__dirname, "../public");

/* middlewares */
app.use(express.json());
app.use(express.static(pubDir));
app.use(morgan("dev"));

/* routes */
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.status(200).send("Express Server Home Page");
});

module.exports = app;
