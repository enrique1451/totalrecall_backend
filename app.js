"use strict";
/** Express app for totalrecall. */

const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path")

const cors = require("cors");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const carsApiProxy = require("./middleware/carsProxy")
const authRoutes = require("./routes/auth");
const carsRoutes = require("./routes/cars");
const usersRoutes = require("./routes/users");
const morgan = require("morgan");
// const { passDataToProxy, passDataToNext } = require("./middleware/proxyObjectHandler");
const app = express();
const router = express.Router()

app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/cars", carsRoutes);

app.use("/recalls", carsApiProxy)


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});  



module.exports = app;
