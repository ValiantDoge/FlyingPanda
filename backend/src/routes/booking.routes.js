import * as BookingControllers from '../controllers/booking.controller.js';

import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';

const bookingRouter = Router();

// Route to book flight
bookingRouter.post("/book-flight", authorize, BookingControllers.bookFlight)

// Route to get all bookings
bookingRouter.get("/bookings", authorize, BookingControllers.getMyBookings);


export default bookingRouter;