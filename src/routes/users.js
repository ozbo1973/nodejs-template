/* users routes */
const express = require("express");
const multer = require("multer");
const { auth, hasKeys } = require("../middlewares");

const router = express.Router();
const { requireAuth } = auth;
const {
  getMe,
  updateMe,
  deleteMe,
  myAvatar,
  deleteMyAvatar,
  getMyAvatar,
} = require("../controllers/users");

const uploadAvatar = multer({
  limits: { fileSize: 2000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("please upload the supported file type"));
    }
    cb(undefined, true);
  },
});

/* profile routes */
router.get("/me", requireAuth, getMe);

router.patch("/me", requireAuth, hasKeys, updateMe);

router.delete("/me", requireAuth, deleteMe);

/* Avatar routes */
router.post(
  "/me/avatar",
  uploadAvatar.single("avatar"),
  requireAuth,
  hasKeys,
  myAvatar
);

router.delete("/me/avatar", requireAuth, deleteMyAvatar);

router.get("/:id/avatar", getMyAvatar);

module.exports = router;
