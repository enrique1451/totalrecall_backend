// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");


const {
  TEST_DATA,
  afterEachFunction,
  afterAllFunction,
  beforeAllFunction,
} = require("./jest config/jest.config");


beforeAll(async function () {
  await beforeAllFunction();
});


afterEach(async function () {
  await afterEachFunction();
});

describe("Test Multiple User's Routes", function () {
  test("Creates a new user", async function () {
   
    let newUser = {
      username: "tester",
      password: "foo123",
      fullName: "tester McTest",
      email: "awesome@mctests.com",
    };
    const response = await request(app)
        .post("/auth/register")
        .send(newUser);
    // console.log(response)
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  test("Prevents creating a user with duplicate username", async function () {
    const response = await request(app)
        .post("/auth/register")
        .send({
          username: "tester",
          password: "test123",
          full_name: "tester mcfly",
          email: 'savvy@test.com',
        });
    expect(response.statusCode).toBe(400);
  });



  test("Rejects user with wrong password to log in", async function() {
    const response = await request(app)
      .post("/users/login")
      .send({
        username: "tester", 
        password: "blahblahblah"
      })
    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty("error")

      
  })  

  test("Prevents creating a user without required password field", async function () {
    const response = await request(app)
        .post("/auth/register")
        .send({
            username: "test",
            password: "",
            full_name: "Idon't HaveAPassword˚",
            email: "test@reallyworks.com",
          });
    expect(response.statusCode).toBe(400);

    await db.query("DELETE FROM users");
    await db.query("DELETE FROM cars");
    await db.end()
  });

});








