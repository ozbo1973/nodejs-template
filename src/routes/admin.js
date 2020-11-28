const express = require("express");
const { auth, admin, handleValidationErrors } = require("../middlewares");

const router = express.Router();
const { requireAuth } = auth;
const { findUserProfile, isAdmin } = admin;
const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/admin");

/* profile routes */
router.get("/profiles/:userId", requireAuth, isAdmin, getProfile);

router.patch("/profiles/:userId", requireAuth, isAdmin, updateProfile);

router.delete("/profiles/:userId", requireAuth, isAdmin, deleteProfile);

// router.post("/profiles/:userId/reset", requireAuth, isAdmin, resetUser);

router.param("userId", findUserProfile);

module.exports = router;
