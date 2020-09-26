const express = require("express");
const User = require("../models/user");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const keys = Object.keys(req.body);
  if (keys.length === 0) {
    return res.status(400).send({ error: "No data in body of request." });
  }

  try {
    const user = new User(req.body);
    await user.save();

    const token = await user.getAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(401).send();
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    const token = await user.getAuthToken();

    res.status(200).send({ user, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/logout", isAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save({ validateModifiedOnly: true });

    res.status(200).send({ message: "Logged out" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

module.exports = router;
