"use strict";

/** Routes for cars. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { decode } = require("jsonwebtoken");


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

router.post("/garage", ensureCorrectUserOrAdmin , async function (req, res, next) {

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

/*
Route that queries database and returns all cars belonging to a user called from "getUserCars"
method at totalRecallApi
*/     
router.get("/garage/showcars", ensureCorrectUserOrAdmin, async function (req, res, next) {
      const decoded = decode(req.headers.authorization)
      const username = decoded.username


      try {
        const cars = await Car.findAllCarsForUser(username); 
        console.log("Line 60 from cars.js(routes)", cars)
        return res.json({ cars });
      } catch (err) {
        return next(err);
      }
    });


/*
* DELETE /garage/showcars/
* Route that queries database and deletes entry that matches the desired car 
*/

router.delete("/garage/showcars", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const decoded = decode(req.headers.authorization)
  const username = decoded.username
  const car = req.body.car.car_id

  try {
    const cars = await Car.removeCarFromUserAccount(car, username); 
    return res.json({ cars });
  } catch (err) {
    return next(err);
  }
});



/*
Route that queries NHTSA API via proxy to avoid CORS errors
*/     

router.get("/recalls/recallsByVehicle/", carsApiProxy, async function (req, res, next) {
  console.log(req.query)
  
  try {
    return res.json({ recalls });
    } catch (err) {
      return next(err);
      }
    });

module.exports = router;
