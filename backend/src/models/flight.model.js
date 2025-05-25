import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
    airline: {
        type: String,
        required: [true, "Airline name is required!"]
    },
    airlineCode: {
        type: String,
        required: [true, "Airline code is required!"]
    },
    flightNumber: {
        type: Number,
        required: [true, "Flight number is required!"]
    },
    origin: {
        type: String,
        required: [true, "Origin is required!"]
    },
    availableSeats: {
        type: Number,
        required: [true, "Available seats are required!"]
    },
    destination: {
        type: String,
        required: [true, "Destination is required!"]
    },
    price: {
        type: Number,
        required: [true, "Price is required!"]
    },
    departure: {
        type: Date,
        required: [true, "Departure time is required!"],
    },
    arrival: {
        type: Date,
        required: [true, "Arrival time is required!"],
        validate: {
            validator: function(value) {
                return value > this.departure;
            },
            message: "Arrival time must be after departure time!"
        }
    },
    duration: {
        type: String,
        required: false,
    },
    operationalDays: {
        type: [Number],
        required: false,
        default: [1, 2, 3, 4, 5, 6, 7],
    },
});

// Auto calculate the duration if missing
flightSchema.pre("save", function (next) {
    if(!this.duration){
        const duration = Math.floor( (this.arrival - this.departure) / (1000 * 60 * 60 * 24) );
        this.duration = duration;
    }
    next();
})

const Flight = mongoose.model("Flight", flightSchema);

export default Flight;