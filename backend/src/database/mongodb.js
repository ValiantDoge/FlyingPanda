import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";


if(!DB_URI) {
    throw new Error(`Undefined DB_URI environment variable. Please define in .env.${NODE_ENV || 'development'}.local`)
}

const connectToDatabase = async() => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Successfully connected to database in ${NODE_ENV} mode!`);
    }catch(error){
        console.error("Error occured while connecting to Database: ", error);
        process.exit(1);
    }
}
DB_URI
export default connectToDatabase;