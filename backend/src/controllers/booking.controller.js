import Flight from "../models/flight.model.js";
import Booking from "../models/booking.model.js";
import mongoose from "mongoose";

export const bookFlight = async(req, res, next) => {
   try {
    const { flightId, passengers } = req.body;
    const userId = req.user._id;

    if (!flightId || !passengers) {
       const error = new Error("FlightID and number of passengers are required");
        error.statusCode = 400;
        throw error;
    }

    // Find flight and check seat availability
    const flight = await Flight.findById(flightId);
    if (!flight) {
       const error = new Error("Flight not found");
        error.statusCode = 404;
        throw error;
    }

    if (flight.availableSeats < passengers) {
      const error = new Error("Number of passengers greater than available seats");
      error.statusCode = 400;
      throw error;
    }

    // Calculate total price
    const totalPrice = flight.price * passengers;

    // Create booking and update seats in transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await Booking.create([{
        user: userId,
        flight: flightId,
        passengers,
        totalPrice
      }], { session });

      flight.availableSeats -= passengers;
      await flight.save({ session });

      await session.commitTransaction();

      res.status(201).json({
        success: true,
        data: booking[0]
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
      next(error);
  }
};


export const getMyBookings = async (req, res, next) => {
  const userid = req.user._id;
   try {
    const bookings = await Booking.find({
      user: userid
    });
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}