/**
 * hospitalsRoutes.js - The hospitals router
 *
 * This file is the router file for the hospitals.  It routes URI endpoints to
 * controller functions.  The routes support CRUD architecture.
 */
const express = require("express");

const hospitalsController = require("../controllers/hospitals-controller");
const { catchErrors } = require("../middleware/error-handlers");
const { verifyJWT } = require("../middleware/jwt-handler");

const router = express.Router();

// CRUD Controller for the Hospital(s)
// -----------------------------------
// Remember that here, the '/' is relative to the '/hospitals'
// route defined in server.js as "app.use('/hospitals', hospitals);"
// todo: should be an admin-only route
// (C)reate a new hospital with given information
// POST /hospitals
// Example: POST http://localhost:3000/hospitals
//router.post('/', catchErrors(hospitalsController.store), apikeyRequired)

// (R)ead a hospital(s) in various ways
// GET /hospitals?<list of query parameters>
// Example: GET http://localhost:3000/hospitals?city=CHICAGO
router.get("/", verifyJWT, catchErrors(hospitalsController.index));

router.post("/", verifyJWT, catchErrors(hospitalsController.store));

router.put("/", verifyJWT, catchErrors(hospitalsController.update));

router.delete("/", verifyJWT, catchErrors(hospitalsController.delete));

//router.post('/', providerIdRequired, catchErrors(hospitalsController.store))

module.exports = router;
