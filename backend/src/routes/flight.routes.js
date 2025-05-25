import * as FlightControllers from '../controllers/flight.controller.js';

import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';

const flightRouter = Router();

flightRouter.get("/", authorize, FlightControllers.getAllFlights);

// Route to search flights
flightRouter.post("/search", authorize, FlightControllers.searchFlights);

// Route to book flight
flightRouter.post("/book-flight", authorize, FlightControllers.bookFlight)

// Route to get all bookings
flightRouter.get("/bookings", authorize, FlightControllers.getMyBookings);


export default flightRouter;