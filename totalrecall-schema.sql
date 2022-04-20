
CREATE TABLE users (
  username VARCHAR(30) UNIQUE NOT NULL PRIMARY KEY, 
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  yearmodel INTEGER NOT NULL 
    CHECK (yearmodel > 1900),
  carmake TEXT NOT NULL,
  carmodel TEXT NOT NULL,
  recalls TEXT   
);


CREATE TABLE users_cars (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30)
    REFERENCES users ON DELETE CASCADE,
  car_id INTEGER
    REFERENCES cars ON DELETE CASCADE 
)
  
