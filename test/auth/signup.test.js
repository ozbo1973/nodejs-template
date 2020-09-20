const request = require("supertest");
const app = require("../../src/app");
const User = require("../../src/models/user");
const { setUpDB, users } = require("../fixtures/db");

const baseURL = "/api/auth";
const { user1 } = users;

beforeEach(setUpDB);

/* SIGNUP */
test("Should signup new user, with encrypted password", async () => {
  const newUser = {
    username: "ozbo1973",
    email: "ozbo1973@testexample.com",
    password: "abc123#56",
  };
  const result = await request(app)
    .post(`${baseURL}/signup`)
    .send(newUser)
    .expect(201);

  const user = await User.findById(result.body.user._id);
  expect(user.password).not.toBe(newUser.password);
});

test("Should not signup user due to no data sent", async () => {
  const result = await request(app)
    .post(`${baseURL}/signup`)
    .send({})
    .expect(400);
});

test("Should not signup duplicate User", async () => {
  const { userOne } = user1;
  const result = await request(app)
    .post(`${baseURL}/signup`)
    .send(userOne)
    .expect(401);

  const user = await User.find({ username: userOne.username });

  expect(user.length).toEqual(1);
});

test("Should not signup user due to bad password", async () => {
  const newUser = {
    username: "ozbo1973",
    email: "ozbo1973@testexample.com",
    password: "abc",
  };

  const result = await request(app)
    .post(`${baseURL}/signup`)
    .send(newUser)
    .expect(401);

  expect(result.error).not.toBeNull();
});

test("Should not signup user with bad username", async () => {
  const newUser = {
    username: "ozb",
    email: "ozbo1973@testexample.com",
    password: "abc123#56",
  };

  const result = await request(app)
    .post(`${baseURL}/signup`)
    .send(newUser)
    .expect(401);

  expect(result.error).not.toBeNull();
});

test("Should not signup user with bad Email address", async () => {
  const newUser = {
    username: "ozb1973$33",
    email: "ozbo1973@",
    password: "abc123#56",
  };

  const result = await request(app)
    .post(`${baseURL}/signup`)
    .send(newUser)
    .expect(401);

  expect(result.error).not.toBeNull();
});
