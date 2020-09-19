const request = require("supertest");
const app = require("../src/app");
const { urls } = require("./fixtures/db");

test("Should ping home page and connect to DB without errors", async () => {
  await request(app).get(urls.homeURL).send().expect(200);

  expect(process.env.PORT).toBe("5001");
  expect(process.env.MONGO_URI).not.toBeNull();
});
