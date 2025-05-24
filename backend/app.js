import express from "express";

import { PORT } from "./src/config/env.js";

import userRouter from "./src/routes/user.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import connectToDatabase from "./src/database/mongodb.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";
import flightRouter from "./src/routes/flight.routes.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
];

const corsOptions = {
    origin: function (origin, callback) {
        if(!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const message = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    },
    credentials: true, 
    allowedHEaders: [
        "Content-Type",
        "Authorization",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}

// Middlewares
app.use(express.json()); // Middleware to handle JSON data which is send in request
app.use(express.urlencoded({extended: false})); // Middlware process form data send in HTML Forms
app.use(cors(corsOptions));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/flights", flightRouter);

app.use(errorMiddleware); // Middleware to log any errors

app.get("/", (req, res) => {
    res.send("Welcome to Flying Panda!");
});

app.listen(PORT, async()=>{
    console.log(`Server running on port http://localhost:${PORT}`);

    //Connet to MongoDB
    await connectToDatabase();
})
