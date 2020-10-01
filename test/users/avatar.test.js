const request = require("supertest");
const app = require("../../src/app");
const { setUpDB, users } = require("../fixtures/db");
const User = require("../../src/models/user");

const baseURL = "/api/users";
const { user1 } = users;

beforeEach(setUpDB);

test("Should upload Avatar and fetch users avatar", async () => {
  const { userOne } = user1;

  const result = await request(app)
    .post(`${baseURL}/me/avatar`)
    .set("Authorization", `${userOne.tokens[0].token}`)
    .attach("avatar", "test/fixtures/bk_autumn.jpg")
    .expect(200);

  const user = await User.findById(userOne._id);
  expect(user.avatar).toEqual(expect.any(Buffer));

  await request(app).get(`${baseURL}/${user._id}/avatar`).send().expect(200);
});
