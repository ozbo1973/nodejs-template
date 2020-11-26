const request = require("supertest");
const app = require("../../src/app");
const User = require("../../src/models/user");
const { setUpDB, users } = require("../fixtures/db");

const baseURL = "/api/auth";
const { user1 } = users;

beforeEach(setUpDB);

test("Should login existing user", async () => {
  const { email, password } = user1.userOne;

  const result = await request(app)
    .post(`${baseURL}/login`)
    .send({ email, password })
    .expect(200);

  const user = await User.findById(user1.userOne._id);

  expect(user.tokens[1].token).toBe(result.body.token);
});

test("Should not Login user.", async () => {
  const result = await request(app)
    .post(`${baseURL}/login`)
    .send({ email: user1.userOne.email, password: "abc25647!" })
    .expect(401);

  const user = await User.findOne({ email: user1.userOne.email });
  expect(user.tokens.length).not.toBeGreaterThan(1);
});
