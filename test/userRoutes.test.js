const request = require("supertest");
const app = require("../src/app");
const { setUpDB, users } = require("./fixtures/db");
const User = require("../src/models/user");

const baseURL = "/api/users";
const { user1 } = users;

beforeEach(setUpDB);

test("Should fetch user profile", async () => {
  const result = await request(app).get(`${baseURL}/me`).send().expect(200);
});

test("Should Update user profile", async () => {
  const { userOne, userOneId } = user1;
  userOne.email = "mychange@testexample.com";

  const result = await request(app)
    .patch(`${baseURL}/me`)
    .send(userOne)
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.email).toBe(userOne.email);
});

test("Should Delete user profile", async () => {
  const { userOne, userOneId } = user1;
  const result = await request(app)
    .delete(`${baseURL}/me`)
    .send(userOne)
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

/* Avatars */
test("Should Upload user Avatar", async () => {
  const result = await request(app)
    .post(`${baseURL}/me/avatar`)
    .send({})
    .expect(201);
});

test("Should Delete user Avatar", async () => {
  const result = await request(app)
    .delete(`${baseURL}/me/avatar`)
    .send()
    .expect(200);
});

test("Should Fetch user Avatar", async () => {
  const result = await request(app)
    .get(`${baseURL}/12548/avatar`)
    .send()
    .expect(200);
});
