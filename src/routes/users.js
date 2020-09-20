/* users routes */
const express = require("express");
const User = require("../models/user");

const router = express.Router();

/* profile routes */
router.get("/me", (req, res) => {
  try {
    res.status(200).send("My Profile");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.patch("/me", async (req, res) => {
  const keys = Object.keys(req.body);
  try {
    if (keys.length === 0) {
      return res.status(400).send({ error: "Invalid update" });
    }

    const user = await User.findByIdAndUpdate(req.body._id, req.body);

    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/me", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body._id);

    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/* Avatar routes */
router.post("/me/avatar", (req, res) => {
  try {
    res.status(201).send("My Posted Avatar");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/me/avatar", (req, res) => {
  try {
    res.status(200).send("My Deleted Avatar");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/:id/avatar", (req, res) => {
  try {
    res.status(200).send("My Shown Avatar");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
