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
  beforeAllHook,
  beforeEachHook
} = require("./config");


beforeAll(async function () {
  await beforeAllHook();
});


beforeEach(async function () {
  await beforeEachHook(TEST_DATA);
});


afterEach(async function () {
  await afterEachHook();
});


afterAll(async function () {
  await afterAllHook();
});


describe("POST /auth/register", async function () {
  test("Creates a new user", async function () {
    let dataObj = {
      username: "benito",
      password: "foo123",
      fullName: "benito cabrera",
      email: "benito@benitoca.com",
    };
    const response = await request(app)
        .post("/auth/register")
        .send(dataObj);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("token");
    const benitoSavedInDb = await User.findOne("benito");
    ["username", "isAdmin"].forEach(key => {
      expect(dataObj[key]).toEqual(benitoSavedInDb[key]);
    });
  });

  test("Prevents creating a user with duplicate username", async function () {
    const response = await request(app)

    
        .post("/auth/register")
        .send({
          username: "test",
          password: "test123",
          full_name: "tester mcfly",
          email: 'savvy@test.com',
        });
    expect(response.statusCode).toBe(409);
  });

  test("Prevents creating a user without required password field", async function () {
    const response = await request(app)
        .post("/auth/register")
        .send({
            username: "test",
            password: "",
            full_name: "Proof's Working",
            email: "test@reallyworks.com",
          });
    expect(response.statusCode).toBe(400);
  });
});


describe("GET /users", async function () {
  test("Gets a list of 1 user", async function () {
    const response = await request(app)
        .get("/users")
        .send({_token: `${TEST_DATA.userToken}`});
    expect(response.body.users).toHaveLength(1);
    expect(response.body.users[0]).toHaveProperty("username");
    expect(response.body.users[0]).not.toHaveProperty("password");
  });
});



  test("Responds with a 404 if it cannot find the user in question", async function () {
    const response = await request(app)
        .get(`/users`)
        .send({_token: `${TEST_DATA.userToken}`});
    expect(response.statusCode).toBe(404);
  });



