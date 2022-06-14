"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");


/** Related functions for cars. */

class Car {


  /** Signed in user add car into his/her account. 
   *
   * Returns [{ carmake, carmodel, yearmodel}, ...]
   * 
   **/

  static async addCarToGarage(
    {yearmodel, carmake, carmodel}, username) {
      if (!username) throw new NotFoundError(`Username not defined: ${username}`)

      // const carExists = await db.query(
      //  `SELECT car_id
      //   FROM cars
      //   WHERE yearmodel = $1,
      //         carmake  = $2,
      //         carmodel = $3`,
      //            [
      //             yearmodel, 
      //             carmake,
      //             carmodel
      //           ]
      //         );

      //   if (carExists) throw new BadRequestError(`Car ${yearmodel} ${carmake} ${carmodel} Already Exists`);
      const preCheck2 = await db.query(
        `SELECT username
          FROM users
          WHERE username = $1`, [username]);
  const user = preCheck2.rows[0];
  
  if (!user) throw new NotFoundError(`No username: ${username}`);

      const result = await db.query(
        `INSERT INTO cars
          (yearmodel,
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
      const addedCar = result.rows[0]
      const carId = result.rows[0].car_id
      console.log("DATABASE ADD CAR CAR ID", carId, addedCar)
  
      await db.query(
            `INSERT INTO users_cars (car_id, username)
              VALUES ($1, $2)`,
          [carId, username]);

      return addedCar;
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
                  cars.yearmodel,
                  cars.recalls
           FROM cars
           JOIN users_cars 
           ON users_cars.username = $1 
           AND users_cars.car_id = cars.car_id  
           ORDER BY carmake`,
           [username]
    );
    // console.log("username line 89 cars model===>", username)
    console.log("result from cars query in cars.models===>",result.rows)

    return result.rows;
  }

/*
* Removes selected car from car garage for the current logged in user 
*/

  static async removeCarFromUserAccount(car_id) {
    console.log(car_id)
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
}

module.exports = Car;
