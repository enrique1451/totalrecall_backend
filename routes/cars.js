"use strict";

/** Routes for cars. */

const jsonschema = require("jsonschema");

const express = require("express");
const { authenticateJWT } = require("../middleware/auth");
const { decode } = require("jsonwebtoken");
const { query } = require("express");


const Car = require("../models/cars")
const carNewSchema = require("../schemas/carNew.json");
const carsApiProxy = require("../middleware/carsProxy");
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

//Route that queries database and returns all cars belonging to a user called from "getUserCars"
//method at totalRecallApi     
router.get("/garage/showcars", authenticateJWT, async function (req, res, next) {
      const decoded = decode(req.headers.authorization)
      const username = decoded.username


      try {
        const cars = await Car.findAllCarsForUser(username); 
        return res.json({ cars });
      } catch (err) {
        return next(err);
      }
    });


router.get("/recalls/recallsByVehicle/", carsApiProxy, async function (req, res, next) {
  console.log(req.query)
  
  try { 
       
        return res.json({ recalls });
      } catch (err) {
        return next(err);
      }
  });

module.exports = router;
