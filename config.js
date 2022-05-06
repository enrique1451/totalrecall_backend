"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "totalrecall_test"
      : process.env.DATABASE_URL || "totalrecall";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Total Recall Config:".red);
console.log("SECRET_KEY:".red, SECRET_KEY);
console.log("BCRYPT_WORK_FACTOR".red, BCRYPT_WORK_FACTOR);
console.log("PORT:".green, PORT.toString());
console.log("Database:".green, getDatabaseUri());
console.log("---------------------".green);

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
