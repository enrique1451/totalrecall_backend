"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "i-will-never-tell";
const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "totalrecall_test"
      : process.env.DATABASE_URL || "totalrecall";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Total Recall Config:".blue);
console.log("SECRET_KEY:".blue, SECRET_KEY);
console.log("BCRYPT_WORK_FACTOR".blue, BCRYPT_WORK_FACTOR);
console.log("PORT:".green, PORT.toString());
console.log("Database:".green, getDatabaseUri());
console.log("---------------------".green);

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
