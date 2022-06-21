// npm packages
const request = require("supertest");

// app imports
const app = require("../app");

const {
  TEST_DATA,
  afterAllFunction,
  beforeAllFunction

} = require("./jest config/jest.config");

beforeAll(async function () {
  await beforeAllFunction();
});


afterAll(async function () {
  await afterAllFunction();
});


describe("Tests Cars Routes and Data Entry into PostgreDB",  function () {
  test("Gets all cars for current user",  async function () {
    const response = await request(app)    
        .get(`/cars/garage/showcars?_token=${TEST_DATA.token}`)
        .set({"authorization":`${TEST_DATA.token}`})
        
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("cars")


  });

  test("Delete selected car for logged in User", async function () {
    const responseDelete = await request(app)
          .delete(`/cars/garage/showcars?_token=${TEST_DATA.token}`)
          .set({"authorization":`${TEST_DATA.token}`})
          .send({
            car: { car_id: `${TEST_DATA.carId}`, carmake: 'fake', carmodel: 'car', yearmodel: 2022 }
            
          });
    expect(response.statusCode).toBe(200);
    expect(responseDelete.body).toHaveProperty("carDeleted")
   

  });

});


