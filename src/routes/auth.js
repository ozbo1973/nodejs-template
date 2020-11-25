const express = require("express");
const { hasKeys, handleValidationErrors, auth } = require("../middlewares");

const router = express.Router();
const { requireAuth } = auth;
const { validateSignup, validateLogin } = auth.validators;
const { signup, login, logout } = require("../controllers/auth");

router.post(
  "/signup",
  [hasKeys, validateSignup],
  handleValidationErrors,
  signup
);

router.post("/login", [hasKeys, validateLogin], handleValidationErrors, login);

router.post("/logout", requireAuth, logout);

module.exports = router;
