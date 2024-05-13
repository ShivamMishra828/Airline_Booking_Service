const axios = require("axios");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const AppError = require("../utils/error/app-error");
const { ServerConfig } = require("../config");
const { StatusCodes } = require("http-status-codes");

const bookingRepository = new BookingRepository();

async function createBooking(data) {
    try {
        const result = await db.sequelize.transaction(
            async function bookingImpl(t) {
                const flight = await axios.get(
                    `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
                );
                if (data.noOfSeats > flight.data.data.totalSeats) {
                    throw new AppError(
                        "Required no of seats not available",
                        StatusCodes.BAD_REQUEST
                    );
                }
                return flight.data;
            }
        );
        return result;
    } catch (error) {
        throw new AppError(error.message, error.statusCode);
    }
}

module.exports = {
    createBooking,
};
