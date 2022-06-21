"use strict";

/** Routes for cars. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { decode } = require("jsonwebtoken");


const Car = require("../models/cars");
const carNewSchema = require("../schemas/carNew.json");
const carsApiProxy = require("../middleware/carsProxy");
const router = express.Router();


/*
Route that queries database and returns all cars belonging to a user called from "getUserCars"
method at totalRecallApi in the frontend
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

 /** POST /cars/garage/showcars 
  * Returns {"new car": modelyear, carmake, carmodel }
  * Authorization required: same-user-as-decoded token:username
 */

router.post("/garage/showcars", ensureCorrectUserOrAdmin , async function (req, res, next) {
  delete req.body._token

  const decoded = decode(req.headers.authorization)
  const username = decoded.username

 
  try {
    const validation = jsonschema.validate(req.body, carNewSchema) 

    if (!validation.valid) {
      return next({
        status: 400, 
        message: validation.errors.map(err => err.stack)
      });
    }
      const addedCar = await Car.addCarToGarage(req.body, username);
      return res.status(201).json({addedCar});
    }
    catch(err) {
      return next(err);
    }
  }),




/*
* DELETE /garage/showcars/
* Route that queries database and deletes entry that matches the desired car 
*/

router.delete("/garage/showcars", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const decoded = decode(req.headers.authorization)
  const username = decoded.username
  const car_id = req.body.car.car_id
  const carDeleted = req.body.car
  

  try {
    const car = await Car.removeCarFromUserAccount(car_id, username); 
    return res.json({ carDeleted });
  } catch (err) {
    return next(err);
  }
});



/*
Query route for NHTSA API, via proxy middleware in carApiProxy
*/     

router.get("/recalls/recallsByVehicle/", carsApiProxy, async function (req, res, next) {
  // console.log(req.query)
  
  try {
    return res.json({ recalls });
    } catch (err) {
      return next(err);
      }
  });

module.exports = router;
