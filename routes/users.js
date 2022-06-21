"use strict";

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { ensureCorrectUserOrAdmin} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const { createToken } = require("../helpers/tokens");



/** Routes for users. */


/** POST / { user }  => { user, token }
 * Login endpoint where username and password are verified against
 * database information
 * 
 **/

 router.post("/login", async function (req, res, next) {
  try {
    const user = await User.authenticate(req.body);
    const token = createToken(user);
    return res.status(201).json({ token });
    } catch (err) {
      return next(err);
      }
});




/** GET / => { user }
 * Returns { username, fullName, isAdmin}
 * Authorization required: admin(not functional yet) or same user-as-username in decoded token
 * Calls "/middleware/auth.js" at "ensureCorrectUserOrAdmin" to verify token 
 **/

router.get("/", ensureCorrectUserOrAdmin, async function (req, res, next) {
  let userData = res.locals.user
  // console.log("res.locals.user", userData)
  
  try {
    const user = await User.get(userData.username);
    return res.json({ user });
    } catch (err) {
      return next(err);
      }
});


module.exports = router;