const express = require("express");
const { auth, admin, handleValidationErrors } = require("../middlewares");

const router = express.Router();
const { requireAuth, isAdmin } = auth;
const { findUserProfile } = admin;
const { getProfile } = require("../controllers/admin");

/* profile routes */

router.get("/profile/:userId", requireAuth, isAdmin, getProfile);

router.param("userId", findUserProfile);

module.exports = router;
