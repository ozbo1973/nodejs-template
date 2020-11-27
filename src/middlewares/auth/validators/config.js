const requiredFieldMsg = (field) => `${field} is required. `;
const baseConfig = {
  in: ["body"],
  trim: true,
  escape: true,
};

const email = {
  ...baseConfig,
  normalizeEmail: true,
  notEmpty: {
    errorMessage: requiredFieldMsg("Email"),
  },
  isEmail: {
    errorMessage: "Must be in email format",
  },
};

const username = {
  ...baseConfig,
  notEmpty: {
    errorMessage: requiredFieldMsg("Email"),
  },
};

const password = {
  ...baseConfig,
  notEmpty: {
    errorMessage: requiredFieldMsg("Password"),
  },
};

module.exports = {
  email,
  username,
  password,
};
