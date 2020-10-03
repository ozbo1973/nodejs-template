const express = require("express");
const User = require("../models/user");
const { hasKeys, handleValidationErrors, auth } = require("../middlewares");

const router = express.Router();
const { requireAuth } = auth;
const { validateSignup, validateLogin } = auth.validators;

router.post(
  "/signup",
  [hasKeys, validateSignup],
  handleValidationErrors,
  async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();

      const token = await user.getAuthToken();

      res.status(201).send({ user, token });
    } catch (error) {
      res.status(500).send();
    }
  }
);

router.post(
  "/login",
  [hasKeys, validateLogin],
  handleValidationErrors,
  async (req, res) => {
    try {
      const user = req.user;
      const token = await user.getAuthToken();

      res.status(200).send({ user, token });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  }
);

router.post("/logout", requireAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();

    res.status(200).send({ message: "Logged out" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
