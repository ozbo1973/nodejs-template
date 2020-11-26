const { checkSchema } = require("express-validator");
const bcrypt = require("bcryptjs");
const { emailConfig, usernameConfig, passwordConfig } = require("./config");
const User = require("../../../models/user");

module.exports = {
  validateSignup: checkSchema({
    email: {
      ...emailConfig,
      custom: {
        options: async (val) => {
          const user = await User.findOne({ email: val });
          if (user) {
            throw new Error("User already exists.");
          }
          return true;
        },
      },
    },
    username: {
      ...usernameConfig,
      isLength: {
        errorMessage: "Username must be between 5 and 25 characters",
        options: { min: 5, max: 25 },
      },
      custom: {
        options: async (val) => {
          const user = await User.findOne({ username: val });
          if (user) {
            throw new Error("User already exists.");
          }
          return true;
        },
      },
    },
    password: {
      ...passwordConfig,
      isLength: {
        errorMessage: "Password must be at least 6 chars and no more than 25",
        options: { min: 6, max: 25 },
      },
    },
  }),
  validateLogin: checkSchema({
    email: {
      ...emailConfig,
    },
    password: {
      ...passwordConfig,
      custom: {
        options: async (val, { req }) => {
          const { email } = req.body;
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("Unauthorized");
          }

          const isMatch = await user.isPasswordMatch(val);

          if (!isMatch) {
            throw new Error("Unauthorized.");
          }
          req.user = user;
          return true;
        },
      },
    },
  }),
};
