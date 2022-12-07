const express = require("express");

// Common routes
const hospitalRoutes = require("./hospitals-routes");
const authRoutes = require("./auth-routes");
//const adminRoutes = require('./admin-routes')

// Middleware
//const pagination = require('../middleware/pagination')
//const adminOnly = require('../middleware/admin-only')

const router = express.Router();

router.use("/hospitals", hospitalRoutes);
router.use("/auth", authRoutes);
//router.use('/admin', adminRoutes)

module.exports = router;
