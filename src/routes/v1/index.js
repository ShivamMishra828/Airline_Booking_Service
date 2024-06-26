const express = require("express");
const bookingRoute = require("./booking-route");

const router = express.Router();

router.use("/bookings", bookingRoute);

module.exports = router;
