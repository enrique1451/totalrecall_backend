"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");





/* POST /auth/register:   { user } => { token }
 * user must include { username, password, fullName email }
 * Returns JWT token which can be used to authenticate further requests.
 * Authorization required: none
 */


router.post("/register", async function (req, res, next) {

  //delete token:null prop on request.body, otherwise won't pass schema checkup
  delete req.body._token;
 
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    
    //If schema check fails, throws error
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
      }


    //destructures req.body---> sends to User model and adds to DB.     
    const newUser = await User.register({ ...req.body, isAdmin: false });

    // console.log("newUser line 65 auth.js", newUser)
    
    //Creates new token via "tokens.js"helper. return a success status code and token
    const token = createToken(newUser);
    return res.status(201).json({ token });
 
  } catch (err) {
    return next(err);
  }
});


/* POST /auth/token:  { username, password } => { token }
 * Returns JWT token which can be used to authenticate further requests.
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  //after login, deletes token so it passes schema validation. 
  delete req.body._token;

  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    /*
    Verifies username and password via "authenticate" middleware. Also creates
    new token in a similar fashion as in the register route.
    */ 
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) { 
    return next(err);
  }
});



module.exports = router;
