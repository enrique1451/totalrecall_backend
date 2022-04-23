"use strict";

/** Routes for cars. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn, authenticateJWT } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Car = require("../models/cars")
const { createToken } = require("../helpers/tokens");
const carNewSchema = require("../schemas/carNew.json");
const { decode } = require("jsonwebtoken");


const router = express.Router();


 /** POST /cars/garage 
 *
 * Returns {"new car": carmake, model }
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.post("/garage", authenticateJWT , async function (req, res, next) {

    const decoded = decode(req.body._token)
    const username = decoded.username
    
    delete req.body._token
    try {
      const validation = jsonschema.validate(req.body, carNewSchema) 

      if (!validation.valid) {
        return next({
          status: 400, 
          message: validation.errors.map(err => err.stack)
        });
      }
        
        const car = await Car.addCarToGarage(req.body, username);
        return res.status(201).json({car});
      }

      catch(err) {
        return next(err);
      }
    }),

router.get("/garage/showcars", authenticateJWT, async function (req, res, next) {
      let user = res.locals.user

      try {       
        console.log(user)

        const cars = await Car.findAllCarsForUser(user.username);
        return res.json({ cars });
      } catch (err) {
        return next(err);
      }
    

    });



module.exports = router;
