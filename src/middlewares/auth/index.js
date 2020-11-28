const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const validators = require("./validators");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) {
      return res.status(401).send({ message: "Please Authenticate." });
    }

    req.isAdmin = user.admin === 1;
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Must Authenticate." });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).send({ error: "Access Denied" });
  }
  next();
};

module.exports = {
  validators,
  requireAuth,
  isAdmin,
};
