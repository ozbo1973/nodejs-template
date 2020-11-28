const request = require("supertest");
const app = require("../../src/app");
const { setUpDB, users } = require("../fixtures/db");

const baseURL = "/api/admin";
const { user1, user3 } = users;

beforeEach(setUpDB);

test("Should allow admin to get profile", async () => {
  const { userThree } = user3;
  const { userOneId } = user1;
  const token = userThree.tokens[0].token;

  const result = await request(app)
    .get(`${baseURL}/profile/${userOneId}`)
    .set("Authorization", `${token}`)
    .send()
    .expect(200);

  expect(result.body).not.toBeNull();
});

test("Should not get profile not an admin", async () => {
  const { userThreeId } = user3;
  const { userOne } = user1;
  const token = userOne.tokens[0].token;

  const result = await request(app)
    .get(`${baseURL}/profile/${userThreeId}`)
    .set("Authorization", `${token}`)
    .send()
    .expect(403);

  expect(result.body.error).not.toBeNull();
});
