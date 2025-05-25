import * as FlightControllers from '../controllers/flight.controller.js';

import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';

const flightRouter = Router();

flightRouter.get("/", authorize, FlightControllers.getAllFlights);

flightRouter.get("/:id", authorize, FlightControllers.getFlight);

// Route to search flights
flightRouter.post("/search", authorize, FlightControllers.searchFlights);


export default flightRouter;