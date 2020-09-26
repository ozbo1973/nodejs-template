const validator = require("validator");

module.exports = {
  validEmail(val) {
    let email = validator.normalizeEmail(val);
    email = validator.escape(email);
    return validator.isEmail(email);
  },
  validUsername(val) {
    const len = { min: 5, max: 25 };
    const username = validator.escape(val);
    return validator.isLength(username, len);
  },
  validPassword(val) {
    const len = { min: 8 };
    const password = validator.escape(val);
    return validator.isLength(password, len);
  },
  sanitizeField(val) {
    return validator.escape(val);
  },
};
