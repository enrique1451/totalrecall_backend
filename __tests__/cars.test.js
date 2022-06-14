// npm packages
const request = require("supertest");

// app imports
const app = require("../../app");

// model imports
const User = require("../../models/user");

const {
  TEST_DATA,
  afterEachHook,
  afterAllHook,
  beforeEachHook
} = require("./config");


beforeEach(async function () {
  await beforeEachHook(TEST_DATA);
});


afterEach(async function () {
  await afterEachHook();
});


afterAll(async function () {
  await afterAllHook();
});


describe("POST /garage/showcars", async function () {
  test("Creates a new car", async function () {
    let dataObj = {
      modelyear: "2020",
      carmake: "yugo",
      carnodel: "trash",
      };
    const response = await request(app)
        .post("/garage/showcars")
        .send(dataObj);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("car_id");
  });

  test("Gets all cars for current user", async function () {
    const response = await request(app)    
        .get("/garage/showcars")
        .send({
          _token: `${TEST_DATA.userToken}`
        });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("cars")

  });
  test("Delete selected car for logged in User", async function () {
    const response = await request(app)    
        .delete("/garage/showcars")
        .send({
          car: {
            modelyear: "2020",
            carmake: "yugo",
            carnodel: "trash" },               
        _token: `${TEST_DATA}.userToken`
        });
    expect(response.statusCode).toBe(200);
    expect(response.body.carDeleted).toHaveProperty("car_id")

  });

});


