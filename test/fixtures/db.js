const mongoose = require("mongoose");
const User = require("../../src/models/user");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "John Tester1",
  username: "JTTester1",
  email: " jttester1@testexample.biz",
  password: "ABC123#2",
};

const setUpDB = async () => {
  await User.deleteMany();
  await new User(userOne).save();
};

module.exports = {
  users: { user1: { userOneId, userOne } },
  setUpDB,
};
