const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const keys = Object.keys(req.body);
  try {
    if (keys.length === 0) {
      return res.status(400).send({ error: "No data in body of request." });
    }

    const user = new User(req.body);
    await user.save();

    res.status(201).send({ user });
  } catch (error) {
    res.status(401).send();
  }
});

module.exports = router;
