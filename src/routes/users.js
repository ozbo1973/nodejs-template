/* users routes */
const express = require("express");
const multer = require("multer");
const User = require("../models/user");
const { helpers, auth, hasKeys } = require("../middlewares");
const sharp = require("sharp");

const router = express.Router();
const { updatesAllowed } = helpers;
const { requireAuth } = auth;

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
router.get("/me", requireAuth, (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.patch("/me", requireAuth, hasKeys, async (req, res) => {
  const allowedFields = ["name", "email", "password", "username"];
  const { isAllowed, updates } = updatesAllowed(req.body, allowedFields);

  if (!isAllowed) {
    return res.status(400).send({ error: "Trying to update invalid field" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.status(200).send(req.user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

router.delete("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    await user.remove();
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/* Avatar routes */
router.post(
  "/me/avatar",
  uploadAvatar.single("avatar"),
  requireAuth,
  hasKeys,
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer, { failOnError: false })
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();

      req.user.avatar = buffer;
      await req.user.save();
      res.send({ message: "Avatar uploaded" });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ error: error.message });
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/me/avatar", [requireAuth], async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();

    res.status(200).send({ message: "Avatar deleted." });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

router.get("/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");

    res.status(200).send(user.avatar);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
