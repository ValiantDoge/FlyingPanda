// node-migration.js
import mongoose from 'mongoose';
import Flight from './src/models/flight.model.js';
import { DB_URI } from './src/config/env.js';

const convertDatesToDateObjects = async () => {
    try {
        await mongoose.connect(DB_URI);
        
        console.log('Starting date conversion...');
        
        // Find all flights where departure is a string
        const flights = await Flight.find({
            departure: { $type: "string" }
        });
        
        console.log(`Found ${flights.length} flights with string dates`);
        
        for (let flight of flights) {
            // Convert string dates to Date objects
            const departureDate = new Date(flight.departure);
            const arrivalDate = new Date(flight.arrival);
            
            // Update the document
            await Flight.updateOne(
                { _id: flight._id },
                {
                    $set: {
                        departure: departureDate,
                        arrival: arrivalDate
                    }
                }
            );
            
            console.log(`Updated flight ${flight._id}`);
        }
        
        console.log('Date conversion completed!');
        await mongoose.disconnect();
        
    } catch (error) {
        console.error('Error:', error);
    }
};

convertDatesToDateObjects();