// npm packages
const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// app imports
const app = require("../../app");
const db = require("../../db");


// global auth variable to store things for all the tests
const TEST_DATA = {};

async function beforeAllHook() {
  // try {
  //   await db.query(DB_TABLES["cars"]);
  //   await db.query(DB_TABLES["users"]);
  //   await db.query(DB_TABLES["users_cars"]);
  // } catch (error) {
  //   console.error(error);
  // }
}

/**
 * Hooks to insert a user, etc in the input `testData` parameter.
 * @param {Object} TEST_DATA - build the TEST_DATA object
 */
async function beforeEachHook(TEST_DATA) {
  try {
    // login a user, get a token, store the user ID and token
    const hashedPassword = await bcrypt.hash("secret", 1);
    await db.query(
        `INSERT INTO users(username, password, full_name, email, is_admin)
                    VALUES ('test', $1, 'tester mcfly', 'savvy@test.com', false)`
        [hashedPassword]
    );

    const response = await request(app)
      .post("/login")
      .send({
        username: "test",
        password: "secret",
      });

    TEST_DATA.userToken = response.body.token;
    TEST_DATA.currentUsername = jwt.decode(TEST_DATA.userToken).username;

    // do the same for cars
    const result = await db.query(
      "INSERT INTO cars (modelyear, carmake, carmodel) VALUES ($1, $2, $3) RETURNING *",
      ["mclaren", "GT", 1000]
    );

    TEST_DATA.currentCar = result.rows[0];

    const linkCarAndOwner = await db.query(
      "INSERT INTO users_cars (car_id, username) VALUES ($1, $2) RETURNING *",
      [TEST_DATA.currentCar, TEST_DATA.currentUsername]
    );
    TEST_DATA.users_cars = linkCarAndOwner.rows[0];
  } catch (error) {
    console.error(error);
  }
}

async function afterEachHook() {
  try {
    await db.query("DELETE FROM cars");
    await db.query("DELETE FROM users");
  } catch (error) {
    console.error(error);
  }
}

async function afterAllHook() {
  try {
    // await db.query("DROP TABLE IF EXISTS cars_user");
    // await db.query("DROP TABLE IF EXISTS cars");
    // await db.query("DROP TABLE IF EXISTS users");
    await db.end();
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  afterAllHook,
  afterEachHook,
  TEST_DATA,
  beforeAllHook,
  beforeEachHook,
};