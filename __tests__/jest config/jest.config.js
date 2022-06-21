// npm packages
const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// app importsx
const app = require("../../app");
const db = require("../../db");
const { getDatabaseUri } = require("../../config");


// global auth variable to store things for all the tests
const TEST_DATA = {};

/**
 * insert a user, etc in the input `testData` parameter.
 * @param {Object} TEST_DATA - build the TEST_DATA object
 */

async function beforeAllFunction() {
  try {
    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "b4All", 
        password: "secreet", 
        fullName: "before gonzales",
        email: "before@all.com",
      })
     
    TEST_DATA.token = response.body.token;
    TEST_DATA.username = jwt.decode(TEST_DATA.token).username;

 
/* Insert for "cars" table and link to user view "users-cars" table */
    const responseCar = await request(app)
      .post(`/cars/garage/showcars?_token=${TEST_DATA.token}`)
      .set("authorization", TEST_DATA.token)
      .send({
        yearmodel: "2022", 
        carmake: "fake", 
        carmodel: "car"
      },{_token:TEST_DATA.token} )

     TEST_DATA.carId = responseCar.body.addedCar
     
  } catch (error) {
    console.error(error);
  }
}

async function afterEachFunction() {
  try {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM cars");
    await db.query("DELETE FROM users_cars");
  } catch (error) {
    console.error(error);
  } 

}

async function afterAllFunction() {
  try {
    // await db.query("DROP TABLE IF EXISTS users");
    // await db.query("DROP TABLE IF EXISTS cars");
    // await db.query("DROP TABLE IF EXISTS users_cars");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM cars");
    await db.query("DELETE FROM users_cars");

    await db.end();
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  afterAllFunction,
  afterEachFunction,
  TEST_DATA,
  beforeAllFunction,
};