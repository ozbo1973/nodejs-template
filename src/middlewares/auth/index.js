const validators = require("./validators");
const requireAuth = require("./requireAuth");

module.exports = {
  validators,
  requireAuth,
  isAdmin: (req, res, next) => {
    if (!req.isAdmin) {
      return res.status(403).send({ error: "Access Denied" });
    }
    next();
  },
};
