const { BookingService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");

async function createBooking(req, res) {
    try {
        const flight = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.seats,
        });
        return res
            .status(StatusCodes.CREATED)
            .json(
                new SuccessResponse(
                    flight,
                    "Successfully created a new booking object."
                )
            );
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error, error.explanation));
    }
}

module.exports = {
    createBooking,
};
