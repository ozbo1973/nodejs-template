const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validEmail,
  validPassword,
  validUsername,
  sanitizeField,
} = require("../config/validator");

const requiredString = (msg) => ({
  type: String,
  required: [true, msg],
  trim: true,
});

const userSchema = new mongoose.Schema(
  {
    username: {
      ...requiredString("Must input username."),
      unique: true,
      lowercase: true,
      validate(val) {
        if (!validUsername(val)) {
          throw new Error(
            "Must input a valid  user name between 5 and 25 characters."
          );
        }
        sanitizeField(val);
      },
    },
    email: {
      ...requiredString("Must input email address."),
      unique: true,
      lowercase: true,
      validate(val) {
        if (!validEmail(val)) {
          throw new Error("Must be valid Email Address.");
        }
        sanitizeField(val);
      },
    },
    password: {
      ...requiredString("Must input password"),
      validate(val) {
        if (!validPassword(val)) {
          throw new Error("Password must be between 8 and 30 characters.");
        }
      },
    },
    avatar: { type: Buffer },
    tokens: [{ token: { type: String, required: true } }],
  },
  {
    timestamps: true,
  }
);

/* MIDDLEWARES */

/* pre save to hash password */
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
