const { BookingService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const inMemDb = {};

async function createBooking(req, res) {
    try {
        const flight = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats,
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
        const idempotencyKey = req.headers["x-idempotency-key"];
        if (!idempotencyKey) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "idempotency key missing" });
        }
        if (inMemDb[idempotencyKey]) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Cannot retry on a successful payment" });
        }
        const response = await BookingService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId,
        });
        inMemDb[idempotencyKey] = idempotencyKey;
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
    makePayment,
};
