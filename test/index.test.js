const request = require("supertest");
const app = require("../src/app");

const baseURL = "/";

test("Should ping home page and connect to DB without errors", async () => {
  await request(app).get(baseURL).send().expect(200);

  expect(process.env.PORT).toBe("5001");
  expect(process.env.MONGO_URI).not.toBeNull();
});
