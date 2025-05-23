import express from "express";

import { PORT } from "./src/config/env.js";

import userRouter from "./src/routes/user.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import connectToDatabase from "./src/database/mongodb.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";
import { mongo } from "mongoose";

const app = express();

// Middlewares
app.use(express.json()); // Middleware to handle JSON data which is send in request
app.use(express.urlencoded({extended: false})); // Middlware process form data send in HTML Forms

app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)

app.use(errorMiddleware); // Middleware to log any errors

app.get("/", (req, res) => {
    res.send("Welcome to Flying Panda!");
});

app.listen(PORT, async()=>{
    console.log(`Server running on port http://localhost:${PORT}`);

    //Connet to MongoDB
    await connectToDatabase();
})
