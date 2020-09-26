const request = require("supertest");
const app = require("../src/app");
const { setUpDB, users } = require("./fixtures/db");
const User = require("../src/models/user");

const baseURL = "/api/users";
const { user1 } = users;

beforeEach(setUpDB);

test("Should fetch user profile", async () => {
  const { userOne } = user1;
  const token = userOne.tokens[0].token;

  const result = await request(app)
    .get(`${baseURL}/me`)
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(200);

  expect(result.body.user).not.toBeNull();
});

test("Should Update user profile", async () => {
  const { userOne, userOneId } = user1;
  userOne.email = "mychange@testexample.com";
  const token = userOne.tokens[0].token;

  const result = await request(app)
    .patch(`${baseURL}/me`)
    .set("Authorization", `Bearer ${token}`)
    .send({ email: userOne.email })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.email).toBe(userOne.email);
});

test("Should Delete user profile", async () => {
  const { userOne, userOneId } = user1;
  const token = userOne.tokens[0].token;

  const result = await request(app)
    .delete(`${baseURL}/me`)
    .set("Authorization", `Bearer ${token}`)
    .send(userOne)
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

/* Avatars */
test("Should upload Avatar and fetch users avatar", async () => {
  const { userOne } = user1;
  await request(app)
    .post(`${baseURL}/me/avatar`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "test/fixtures/bk_autumn.jpg")
    .expect(200);

  const user = await User.findById(userOne._id);
  expect(user.avatar).toEqual(expect.any(Buffer));

  await request(app).get(`${baseURL}/${user._id}/avatar`).send().expect(200);
});

test("Should Delete user Avatar", async () => {
  const { userOne } = user1;
  const result = await request(app)
    .delete(`${baseURL}/me/avatar`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});
