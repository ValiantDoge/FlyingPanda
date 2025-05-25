import Flight from "../models/flight.model.js";

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

export const getFlight = async (req, res, next) => {
  try {
     const flight = await Flight.findById(req.params.id);
        if (!flight) {
            const error = new Error("Flight not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            data: flight,
        });
  } catch (error) {
    next(error);
  }
}

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

