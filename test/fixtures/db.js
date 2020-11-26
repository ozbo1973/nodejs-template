const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");

const jwtToken = (id) => jwt.sign({ _id: id }, process.env.JWT_SECRET);

/* User Data */
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "John Tester1",
  username: "JTTester1",
  email: "jttester1@testexample.biz",
  password: "ABC123#2",
  tokens: [{ token: jwtToken(userOneId) }],
  avatar: "",
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "John Tester2",
  username: "JTTester2",
  email: "jttester2@testexample.biz",
  password: "ABC123#2sew",
  tokens: [{ token: jwtToken(userTwoId) }],
};

const setUpDB = async () => {
  await User.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
};

module.exports = {
  users: { user1: { userOneId, userOne }, user2: { userTwoId, userTwo } },
  setUpDB,
};
