"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");


/** Related functions for cars. */

class Car {


  /** Given a user Find all cars in the user's garage.
   *
   * Returns [{ carmake, carmodel, yearmodel, recalls}, ...]
   * 
   * 
   **/

  static async addCarToGarage(
    {yearmodel, carmake, carmodel, recalls}, username) {
      if (!username) throw new NotFoundError(`Username not defined: ${username}`)
      
      const result = await db.query(
        `INSERT INTO cars
          (yearmodel,
            carmake,
            carmodel,           
          recalls)
        VALUES ($1, $2, $3, $4)
        RETURNING id, yearmodel, carmake, carmodel`, 
        [ 
          yearmodel,
          carmake,
          carmodel,
          recalls
        ],
      );
      const carId = result.rows[0].id
      
      const preCheck = await db.query(
        `SELECT id
        FROM cars
        WHERE id = $1`, [carId]);
        const car = preCheck.rows[0];
      
      if (!car) throw new NotFoundError(`No car with: ${carId}`);
      
      const preCheck2 = await db.query(
            `SELECT username
              FROM users
              WHERE username = $1`, [username]);
      const user = preCheck2.rows[0];
      
      if (!user) throw new NotFoundError(`No username: ${username}`);
  
      await db.query(
            `INSERT INTO users_cars (car_id, username)
              VALUES ($1, $2)`,
          [carId, username]);
    }
        
      
    /** Given a user Find all cars in the user's garage.
   *
   * Returns [{ carmake, carmodel, yearmodel, recalls}, ...]
   * 
   * 
   **/


  static async findAllCarsForUser(username) {
    const result = await db.query(
          `SELECT carmake,
                  carmodel, 
                  yearmodel,
                  recalls
           FROM cars
           INNER JOIN users_cars on users_cars.username WHERE username = $1  
           ORDER BY carmake`,
           [username]
    );

    return result.rows;
  }

}


module.exports = Car;
