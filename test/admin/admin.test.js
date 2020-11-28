const request = require("supertest");
const app = require("../../src/app");
const User = require("../../src/models/user");
const { setUpDB, users } = require("../fixtures/db");

const baseURL = "/api/admin";
const { user1, user3 } = users;

const adminToken = (user) => user.tokens[0].token;

beforeEach(setUpDB);

test("Should allow admin to get profile", async () => {
  const result = await request(app)
    .get(`${baseURL}/profiles/${user1.userOneId}`)
    .set("Authorization", `${adminToken(user3.userThree)}`)
    .send()
    .expect(200);

  expect(result.body).not.toBeNull();
});

test("Should not get,patch,delete profile not an admin", async () => {
  let result = await request(app)
    .get(`${baseURL}/profiles/${user3.userThreeId}`)
    .set("Authorization", `${adminToken(user1.userOne)}`)
    .send()
    .expect(403);

  expect(result.body.error).not.toBeNull();

  result = await request(app)
    .patch(`${baseURL}/profiles/${user3.userThreeId}`)
    .set("Authorization", `${adminToken(user1.userOne)}`)
    .send({ username: "abc", admin: 1 })
    .expect(403);

  expect(result.body.error).not.toBeNull();

  result = await request(app)
    .delete(`${baseURL}/profiles/${user3.userThreeId}`)
    .set("Authorization", `${adminToken(user1.userOne)}`)
    .send()
    .expect(403);

  expect(result.body.error).not.toBeNull();
});

test("Should Allow admin to update user name and admin role", async () => {
  const updateData = { username: "ozbo1987", admin: 1 };

  const result = await request(app)
    .patch(`${baseURL}/profiles/${user1.userOneId}`)
    .set("Authorization", `${adminToken(user3.userThree)}`)
    .send(updateData)
    .expect(200);

  const user = await User.findById(result.body._id);

  expect(user.username).toEqual(updateData.username);
  expect(user.admin).toEqual(updateData.admin);
});

test("Should Delete Profile of other user", async () => {
  const result = await request(app)
    .delete(`${baseURL}/profiles/${user1.userOneId}`)
    .set("Authorization", `${adminToken(user3.userThree)}`)
    .send()
    .expect(200);

  const user = await User.findById(result.body._id);

  expect(user).toBeNull;
});
