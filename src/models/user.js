const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const util = require("util");

const scrypt = util.promisify(crypto.scrypt);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: { type: String },
    avatar: { type: Buffer },
    tokens: [{ token: { type: String, required: true } }],
    admin: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/* MIDDLEWARES */

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.salt = crypto.randomBytes(10).toString("hex");
    user.password = await user.encryptPassword(user.password);
  }
  next();
});

userSchema.methods = {
  /* remove data on req */
  toJSON: function () {
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.salt;
    delete userObj.tokens;
    delete userObj.avatar;

    return userObj;
  },

  /* checks for matching password */
  isPasswordMatch: async function (given) {
    const user = this;
    const supplied = await user.encryptPassword(given);
    return supplied === user.password;
  },

  /* hash and salt password */
  encryptPassword: async function (password) {
    const user = this;
    if (!password) {
      return "";
    }

    const buff = await scrypt(password, user.salt, 64);
    if (!buff) {
      return "";
    }

    return buff.toString("hex");
  },

  /* Get the Token for authentication */
  getAuthToken: async function () {
    const user = this;
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: "2 days",
      }
    );

    user.tokens = user.tokens.concat({ token });

    try {
      await user.save();
      return token;
    } catch (error) {
      console.log(error.message);
    }
  },
};

const User = mongoose.model("User", userSchema);

module.exports = User;
