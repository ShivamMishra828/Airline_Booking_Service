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

async function makePayment(req, res) {
    try {
        const response = await BookingService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId,
        });
        return res
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(response, "Successfully made the payment.")
            );
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createBooking,
};
