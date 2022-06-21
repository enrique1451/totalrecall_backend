"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */
  
class User {
  /* authenticate user with username, password.
   * Returns { username, fullName, email, is_admin }
   * Throws UnauthorizedError is user not found or wrong password.
   */

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT username,
                  password,
                  full_name AS "fullName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
        [username],
    );
    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username/password");
  }

  /* Register user with data.
   Returns { username, fullName, , email, isAdmin }
   Throws BadRequestError on duplicates.
   */

  static async register(
      { username, password, fullName, email, isAdmin }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users(
            username,
            password,
            full_name,
            email,
            is_admin )
           VALUES ($1, $2, $3, $4, $5)
           RETURNING username, full_name AS "fullName", email, is_admin AS "isAdmin"`,
        [
          username,
          hashedPassword,
          fullName,
          email,
          isAdmin,
        ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Given a username, return data about user.
   * Returns { username, full_name,is_admin }
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
          `SELECT username,
                  full_name AS "fullName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
        [username]
    );

    const user = userRes.rows[0];
    // console.log("Return user from models file",user)

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }




}


module.exports = User;
