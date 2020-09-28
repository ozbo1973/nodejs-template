const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      trim: true,
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
  delete userObj.avatar;

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
    await user.save();
    return token;
  } catch (error) {
    console.log(error.message);
  }
};

/* Static to find credentials to login */
// userSchema.statics.findByCredentials = async (email, givenPassword) => {
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       throw new Error("Unauthorized");
//     }

//     const isMatch = await bcrypt.compare(givenPassword, user.password);
//     if (!isMatch) {
//       throw new Error("Unauthorized");
//     }

//     return user;
//   } catch (error) {}
// };

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
