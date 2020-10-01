const request = require("supertest");
const app = require("../../src/app");
const { setUpDB, users } = require("../fixtures/db");
const User = require("../../src/models/user");

const baseURL = "/api/users";
const { user1 } = users;

beforeEach(setUpDB);

test("Should fetch user profile", async () => {
  const { userOne } = user1;
  const token = userOne.tokens[0].token;
  const result = await request(app)
    .get(`${baseURL}/me`)
    .set("Authorization", `${token}`)
    .send()
    .expect(200);
  expect(result.body.user).not.toBeNull();
});

test("Should Update user profile", async () => {
  const { userOne, userOneId } = user1;
  const changeEmail = "mychange@testexample.com";
  const token = userOne.tokens[0].token;

  const result = await request(app)
    .patch(`${baseURL}/me`)
    .set("Authorization", `${token}`)
    .send({ email: changeEmail })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.email).toBe(changeEmail);
});

test("Should not get and update profile", async () => {
  const { userOne, userOneId } = user1;
  const changeEmail = "mychange2@testexample.com";
  const token = userOne.tokens[0].token;

  await request(app).get(`${baseURL}/me`).send().expect(401);

  const result = await request(app)
    .patch(`${baseURL}/me`)
    .set("Authorization", `abcdii.diise.sss`)
    .send({ email: changeEmail })
    .expect(401);

  const user = await User.findById(userOneId);
  expect(user.email).not.toEqual(changeEmail);
});

test("Should Delete user profile", async () => {
  const { userOne, userOneId } = user1;
  const token = userOne.tokens[0].token;

  const result = await request(app)
    .delete(`${baseURL}/me`)
    .set("Authorization", `${token}`)
    .send(userOne)
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});
