const requiredFieldMsg = (field) => `${field} is required. `;
const baseConfig = {
  in: ["body"],
  trim: true,
  escape: true,
};

const emailConfig = {
  ...baseConfig,
  normalizeEmail: true,
  notEmpty: {
    errorMessage: requiredFieldMsg("Email"),
  },
  isEmail: {
    errorMessage: "Must be in email format",
  },
};

const usernameConfig = {
  ...baseConfig,
  notEmpty: {
    errorMessage: requiredFieldMsg("Email"),
  },
};

const passwordConfig = {
  ...baseConfig,
  notEmpty: {
    errorMessage: requiredFieldMsg("Password"),
  },
};

module.exports = {
  emailConfig,
  usernameConfig,
  passwordConfig,
};
