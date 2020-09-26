const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) {
      throw new Error();
    }
    // set req.user,req.token
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ message: "Unauthorized." });
  }
};
