const { validationResult } = require("express-validator");
const helpers = require("./helpers");
const auth = require("./auth");
const admin = require("./admin");

const hasKeys = (req, res, next) => {
  const keys = Object.keys(req.body);
  if (keys.length === 0 && !req.file) {
    return res.status(400).send({ error: "No data in body of request." });
  }
  next();
};

const handleValidationErrors = (req, res, next) => {
  const { errors } = validationResult(req);
  let errMgs = [];

  if (errors.length > 0) {
    errMgs = errors.map((err) => ({ param: err.param, msg: err.msg }));
    return res.status(401).send({ message: [...errMgs] });
  }
  next();
};

module.exports = {
  hasKeys,
  handleValidationErrors,
  helpers,
  auth,
  admin,
};
