const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validEmail,
  validPassword,
  validUsername,
  sanitizeField,
} = require("../config/validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
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
      type: String,
      required: true,
      trim: true,
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
      type: String,
      required: true,
      trim: true,
      validate(val) {
        if (!validPassword(val)) {
          throw new Error("Password must be greater than 7 characters.");
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

/* remove data on req */
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.tokens;

  return userObj;
};

/* Get the Token for authentication */
userSchema.methods.getAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "2 days",
  });

  user.tokens = user.tokens.concat({ token });

  try {
    await user.save({ validateModifiedOnly: true });
    return token;
  } catch (error) {
    console.log(error.message);
  }
};

/* Static to find credentials to login */
userSchema.statics.findByCredentials = async (email, givenPassword) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Unauthorized");
    }

    const isMatch = await bcrypt.compare(givenPassword, user.password);
    if (!isMatch) {
      throw new Error("Unauthorized");
    }

    return user;
  } catch (error) {}
};

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
