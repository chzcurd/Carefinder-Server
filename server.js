/**
 * server.js - Set up a server
 * @type {Parsers|*}
 */

/*
 * Provides a way of working with directories and file paths
 * https://www.npmjs.com/package/path
 */
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

/*
 * This is an express server
 * https://www.npmjs.com/package/express
 */
const express = require("express");
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, "public")));

/*
 * Middleware for parsing the request body
 * https://www.npmjs.com/package/body-parser
 */
const bodyParser = require("body-parser");
server.use(bodyParser.json());

/*
 * Set various HTTP headers to help secure the server
 * https://www.npmjs.com/package/helmet
 */
const helmet = require("helmet");
server.use(helmet());

/*
 * Ruby-like logger for logging messages
 * https://www.npmjs.com/package/logger
 */
const logger = require("morgan");
server.use(logger("dev"));

/*
 * Database object modelling
 * https://www.npmjs.com/package/mongoose
 */
const mongoose = require("mongoose");

// Connect to the Mongo database
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb+srv://ChzCurd:YBaBZuD4mhbdnG5@cluster0.kqf2ce2.mongodb.net/HospitalDB?retryWrites=true&w=majority"
);

// Set up the routes
// -----------------

const apiRoutes = require("./src/routes/api-routes");

//console.log(apiRoutes);

server.use("/api", apiRoutes);

// Handle errors
// -------------

const errorHandlers = require("./src/middleware/error-handlers");
//const router = require("./src/routes/hospitals-routes");

// Catch all invalid routes
server.use(errorHandlers.invalidRoute);

// Handle mongoose errors
server.use(errorHandlers.validationErrors);

// Export the server object
module.exports = server;
