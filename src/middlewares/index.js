const helpers = require("./helpers");
const auth = require("./auth");

const hasKeys = (req, res, next) => {
  const keys = Object.keys(req.body);
  if (keys.length === 0 && !req.file) {
    return res.status(400).send({ error: "No data in body of request." });
  }
  next();
};

module.exports = {
  hasKeys,
  helpers,
  auth,
};
