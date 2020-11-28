/* Admin Middleware */
const User = require("../../models/user");

const findUserProfile = async (req, res, next, id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not Found");
  }
  req.profile = user;
  next();
};

module.exports = {
  findUserProfile,
};
