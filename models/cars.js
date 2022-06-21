"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");


/** Related functions for cars. */

class Car {


  /* Signed in user add car user account. 
   * Returns [{ carmake, carmodel, yearmodel}, ...]   * 
   */

  static async addCarToGarage(
    {yearmodel, carmake, carmodel}, username) {
      if (!username) throw new NotFoundError(`Username not defined: ${username}`)

      const preCheck = await db.query(
        `SELECT username
          FROM users
          WHERE username = $1`, [username]);

      const user = preCheck.rows[0];
  
  if (!user) throw new NotFoundError(`No username: ${username}`);

      const result = await db.query(
        `INSERT INTO cars
          (
            yearmodel,
            carmake,
            carmodel
            )
        VALUES ($1, $2, $3)
        RETURNING car_id, yearmodel, carmake, carmodel`, 
        [ 
          yearmodel,
          carmake,
          carmodel,
         ]
      );

      const carId = result.rows[0].car_id
      // console.log("DATABASE ADD CAR CAR ID", carId, addedCar)
  
      await db.query(
            `INSERT INTO users_cars (car_id, username)
              VALUES ($1, $2)
              RETURNING users_cars.id `,
          [carId, username]);


      return carId;
    }
  
   /*
    * Removes selected car from car garage for the current logged in user 
    */

  static async removeCarFromUserAccount(car_id) {
    // console.log(car_id)
    const result = await db.query(
      `DELETE FROM cars
              WHERE car_id = $1
              RETURNING yearmodel, carmake, carmodel`,
      [car_id]);

      const car = result.rows[0]
      
    if (result.rows.length === 0) {
      let notFound = new Error(`There exists no car with ${car_id}`);
      notFound.status = 404;
      throw notFound;
    }
    return car; 
  }  
      
  /* Given a user Find all cars in the user's garage.
   * Returns [{ carmake, carmodel, yearmodel}, ...]
   */


  static async findAllCarsForUser(username) {
    const result = await db.query(
          `SELECT 
                  cars.car_id,
                  cars.carmake,
                  cars.carmodel, 
                  cars.yearmodel
           FROM cars
           JOIN users_cars 
           ON users_cars.username = $1 
           AND users_cars.car_id = cars.car_id  
           ORDER BY carmake`,
           [username]
    );
    // console.log("username line 89 cars model===>", username)
    // console.log("result from cars query in cars.models===>",result.rows)

    return result.rows;
  }


}

module.exports = Car;
