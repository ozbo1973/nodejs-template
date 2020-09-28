const { validationResult } = require("express-validator");

const updatesAllowed = (fields, allowed) => {
  const updates = Object.keys(fields);
  const isAllowed = updates.every((update) => allowed.includes(update));
  return { updates, isAllowed };
};

const hasValidationErrors = (req) => {
  const { errors } = validationResult(req);
  let errMgs = [];

  if (errors.length > 0) {
    errMgs = errors.map((err) => ({ param: err.param, msg: err.msg }));
    return { message: [...errMgs] };
  }

  return { message: null };
};

module.exports = {
  updatesAllowed,
  hasValidationErrors,
};
