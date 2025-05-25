import Flight from "../models/flight.model.js";
import Booking from "../models/booking.model.js";
import mongoose from "mongoose";

export const getAllFlights = async (req, res, next) => {
  try {
    const flights = await Flight.find({});
    res.status(200).json({
      success: true,
      data: flights,
    });
  } catch (error) {
    next(error);
  }
};

export const searchFlights = async (req, res, next) => {
  try {
    const { origin, destination, departureDate, passengers, returnDate } = req.body;

    if (origin == null || destination == null || departureDate == null || passengers == null) {
      const error = new Error("Origin, destination, departure date, and passengers are required");
      error.statusCode = 400;
      throw error;
    }

    if (passengers < 1) {
      const error = new Error("Passengers count cannot be less than 1");
      error.statusCode = 400;
      throw error;
    }

    if(origin === destination) {
      const error = new Error("Origin and destination cannot be the same");
      error.statusCode = 400;
      throw error;
    }

    const departureDt = new Date(departureDate);
    const start = new Date(
      Date.UTC(
        departureDt.getUTCFullYear(),
        departureDt.getUTCMonth(),
        departureDt.getUTCDate()
      )
    );
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const query = {
      origin: origin,
      destination: destination,
      departure: {
        $gte: start,
        $lt: end,
      },
      availableSeats: {
        $gte: passengers,
      }
    };
    const outboundFlights = await Flight.find(query).sort({ departure: 1 });
    if (returnDate != null && returnDate != "") {
      const returnDt = new Date(returnDate);
      const returnStart = new Date(
        Date.UTC(
          returnDt.getUTCFullYear(),
          returnDt.getUTCMonth(),
          returnDt.getUTCDate()
        )
      );
      const returnEnd = new Date(returnStart);
      returnEnd.setUTCDate(returnEnd.getUTCDate() + 1);

      const queryReturn = {
        origin: destination,
        destination: origin,
        departure: {
          $gte: returnStart,
          $lt: returnEnd,
        },
         availableSeats: {
          $gte: passengers,
        }
      };
      const returnFlights = await Flight.find(queryReturn).sort({ departure: 1 });

      // Cartesian product of bpth outbound and return flighs
      let roundTripFlights = [];
      if(returnFlights.length === 0){
         roundTripFlights = outboundFlights.flatMap(flight1 => ({
             outbound: flight1,
             return: null,
             price: flight1.price * passengers
         })    
        );
      }else {
         roundTripFlights = outboundFlights.flatMap(flight1 => 
            returnFlights.map(flight2 => ({
                outbound: flight1,
                return: flight2,
                price: flight1.price + flight2.price * passengers
            }))
        );
      }
     

      res.status(200).json({
        success: true,
        data: roundTripFlights,
      });
    }else {
        const outboundFlightsWithPrice = outboundFlights.map(flight => ({
            ...flight.toObject(),
            price: flight.price * passengers
        }));
        res.status(200).json({
            success: true,
            data: outboundFlightsWithPrice,
        });
    }    
  } catch (error) {
    next(error);
  }
};


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