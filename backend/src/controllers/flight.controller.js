import Flight from "../models/flight.model.js";
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
      };
      const returnFlights = await Flight.find(queryReturn).sort({ departure: 1 });

      // Cartesian product of bpth outbound and return flighs
      let roundTripFlights = [];
      if(returnFlights.length === 0){
         roundTripFlights = outboundFlights.flatMap(flight1 => ({
             outbound: flight1,
             return: null
         })    
        );
      }else {
         roundTripFlights = outboundFlights.flatMap(flight1 => 
            returnFlights.map(flight2 => ({
                outbound: flight1,
                return: flight2
            }))
        );
      }
     

      res.status(200).json({
        success: true,
        data: roundTripFlights,
      });
    }else {
        res.status(200).json({
            success: true,
            data: outboundFlights,
        });
    }    
  } catch (error) {
    next(error);
  }
};
