"use strict";

const express = require("express");
const router = express.Router();
const jsonschema = require("jsonschema");
const userUpdateSchema = require("../schemas/userUpdate.json");
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
 *
 * Returns { username, fullName, isAdmin}
 *
 * Authorization required: admin or same user-as-username in decoded token
 * 
 * Calls "/middleware/auth.js" at "ensureCorrectUserOrAdmin" to verify that 
 * 
 * username and token are consistent and valid, otherwise returns error.  
 **/

router.get("/", ensureCorrectUserOrAdmin, async function (req, res, next) {
  let userData = res.locals.user
  console.log("res.locals.user", userData)
  
  try {
    const user = await User.get(userData.username);
    return res.json({ user });
    } catch (err) {
      return next(err);
      }
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
    } catch (err) {
      return next(err);
      }

});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
      }
});


module.exports = router;