/* Admin Controllers */

const { updatesAllowed } = require("../middlewares/helpers");

exports.getProfile = (req, res) => {
  try {
    res.status(200).send(req.profile);
  } catch (error) {
    res.status(500).send();
  }
};

exports.updateProfile = async (req, res) => {
  const allowedFields = ["name", "username", "admin"];
  const { isAllowed, updates } = updatesAllowed(req.body, allowedFields);

  if (!isAllowed) {
    return res.status(400).send({ error: "Trying to update invalid field" });
  }

  try {
    updates.forEach((update) => (req.profile[update] = req.body[update]));
    await req.profile.save();

    res.status(200).send(req.profile);
  } catch (error) {
    res.status(500).send();
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const profile = req.profile;
    if (!profile) {
      return res.status(404).send({ error: "Profile not found." });
    }
    await req.profile.remove();
    req.profile = null;
    res.status(200).send(profile);
  } catch (error) {
    res.status(500).send();
  }
};
