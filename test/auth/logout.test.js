const request = require("supertest");
const app = require("../../src/app");
const User = require("../../src/models/user");
const { setUpDB, users } = require("../fixtures/db");

const baseURL = "/api/auth";
const { user1 } = users;

beforeEach(setUpDB);

test("Should logout user", async () => {
  const { userOne, userOneId } = user1;
  const token = userOne.tokens[0].token;
  const result = await request(app)
    .post(`${baseURL}/logout`)
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  const hasToken = user.tokens.findIndex((userToken) => token === userToken);
  expect(hasToken).toEqual(-1);
});

test("Should not logout user", async () => {
  await request(app)
    .post(`${baseURL}/logout`)
    .set("Authorization", `Bearer abx.jdues.tu`)
    .send()
    .expect(401);

  const user = await User.findById(user1.userOneId);
  expect(user.tokens.length).toBeGreaterThan(0);
});
