import React, { useState } from "react";
import axiosInstance from "../api/axios";
import airportLogo from "../assets/airport-logo.jpg";
import { LiaPlaneArrivalSolid, LiaPlaneDepartureSolid } from "react-icons/lia";
import { toast } from 'react-hot-toast';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;

// Sample Indian airports data
const INDIAN_AIRPORTS = [
  { code: "DEL", name: "Delhi (Indira Gandhi)" },
  { code: "BOM", name: "Mumbai (Chhatrapati Shivaji)" },
  { code: "BLR", name: "Bengaluru (Kempegowda)" },
  { code: "HYD", name: "Hyderabad (Rajiv Gandhi)" },
  { code: "CCU", name: "Kolkata (Netaji Subhas Chandra Bose)" },
  { code: "MAA", name: "Chennai (Chennai International)" },
  { code: "GOI", name: "Goa (Dabolim)" },
  { code: "PNQ", name: "Pune (Pune International)" },
  { code: "AMD", name: "Ahmedabad (Sardar Vallabhbhai Patel)" },
  { code: "COK", name: "Kochi (Cochin International)" },
];

const BookingModal = ({ flight, returnFlight, passengers, onClose, onConfirm, price }) => {
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
        
        <div className="mb-4">
          <h3 className="font-semibold">Outbound Flight Details</h3>
          <p>
            {flight.airline} ({flight.airlineCode}) - {flight.origin} to {flight.destination}
          </p>
          <p>
            Departure: {new Date(flight.departure).toLocaleString()}
          </p>
          <p>Duration: {flight.duration}</p>
          <p>Price: ₹{flight.price}</p>
        </div>

        {returnFlight && (
           <div className="mb-4">
          <h3 className="font-semibold">Return Flight Details</h3>
          <p>
            {returnFlight.airline} ({returnFlight.airlineCode}) - {returnFlight.origin} to {returnFlight.destination}
          </p>
          <p>
            Departure: {new Date(returnFlight.departure).toLocaleString()}
          </p>
          <p>Duration: {returnFlight.duration}</p>
          <p>Price: ₹{returnFlight.price}</p>
        </div>
        )
        }

        <div className="mb-4">
          <p>Total Price: ₹{price}</p>
        </div>
       

        <div className="mb-4">
          <h3 className="font-semibold">Passenger Details</h3>
          <p>Number of Passengers: {passengers}</p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const FlightSearch = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedReturn, setReturnFlight] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const handleBookClick = (flight) => {
    setSelectedFlight(flight.outbound || flight);
    if (flight.return) setReturnFlight(flight.return);
    setShowBookingModal(true);
    setSelectedPrice(flight.price);
  };

  const handleConfirmBooking = async () => {
    try {
      await axiosInstance.post(
        `${BACKEND_URL}/api/booking/book-flight`,
        {
          flightId: selectedFlight._id,
          passengers: formData.passengers,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if(selectedReturn){
        await axiosInstance.post(
        `${BACKEND_URL}/api/booking/book-flight`,
        {
          flightId: selectedReturn._id,
          passengers: formData.passengers,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      }
      toast.success("Booking confirmed!");
      // You might want to redirect to bookings page or show success message
    } catch (error) {
      toast.error(error.response?.data?.error || "Booking failed");
      throw error;
    }
  };

  const [tripType, setTripType] = useState("round-trip");
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    passengers: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `${BACKEND_URL}/api/flights/search`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // Set search results
      setSearchResults(response.data.data);
    } catch (error) {
      toast.error(error.response.data.error);
      return;
    }
  };

  return (
    <div className="flex justify-center p-5">
      <div className="flex flex-col w-full gap-4">
        <div className="flex w-full gap-4">
          {/* Form section */}
          <div className="w-1/3 bg-blue-400 rounded-lg p-6">
            {/* Trip type switcher */}
            <div className="flex bg-blue-100 rounded-lg p-1 mb-2">
              <button
                className={`flex-1 py-2 px-4 rounded-md font-medium ${
                  tripType === "one-way"
                    ? "bg-blue-600 text-white"
                    : "text-blue-600"
                }`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, returnDate: "" }));
                  setSearchResults([]);
                  setTripType("one-way");
                  setSelectedFlight(null);
                  setReturnFlight(null);
                  setSelectedPrice(null);
                }}
              >
                One Way
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md font-medium ${
                  tripType === "round-trip"
                    ? "bg-blue-600 text-white"
                    : "text-blue-600"
                }`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, returnDate: "" }));
                  setSearchResults([]);
                  setTripType("round-trip");
                   setSelectedFlight(null);
                  setReturnFlight(null);
                  setSelectedPrice(null);
                }}
              >
                Round Trip
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* From dropdown */}
              <div>
                <label className="block text-white text-sm font-medium mb-1">
                  From
                </label>
                <select
                  name="origin"
                  value={formData.from}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  required
                >
                  <option value="">Select departure</option>
                  {INDIAN_AIRPORTS.map((airport) => (
                    <option key={airport.code} value={airport.code}>
                      {airport.code} - {airport.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* To dropdown */}
              <div>
                <label className="block text-white text-sm font-medium mb-1">
                  To
                </label>
                <select
                  name="destination"
                  value={formData.to}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  required
                >
                  <option value="">Select destination</option>
                  {INDIAN_AIRPORTS.map((airport) => (
                    <option key={airport.code} value={airport.code}>
                      {airport.code} - {airport.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Departure date */}
              <div>
                <label className="block text-white text-sm font-medium mb-1">
                  Departure Date
                </label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  required
                />
              </div>

              {/* Return date (conditionally rendered) */}
              {tripType === "round-trip" && (
                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md border border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    required={tripType === "round-trip"}
                  />
                </div>
              )}

              {/* Passengers */}
                      <div>
                      <label className="block text-white text-sm font-medium mb-1">
                        Passengers
                      </label>
                      <input
                        type="number"
                        name="passengers"
                        min="1"
                        max="9"
                        value={formData.passengers}
                        onChange={handleChange}
                        className="w-full p-3 rounded-md border border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        required
                      />
                      </div>

                      {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors mt-6"
              >
                Search Flights
              </button>
            </form>
          </div>

          {/* Results section */}
          <div className="w-2/3 bg-blue-300 rounded-lg p-6">
            <div className="flex items-center justify-center h-full">
              {searchResults.length > 0 ? (
                <div className="w-full">
                  <h2 className="text-lg font-semibold mb-4">Flight Results</h2>
                  <ul className="space-y-4">
                    {searchResults.map((flight, index) => (
                      <li key={index} className="p-4">
                        {tripType === "round-trip" &&
                        flight.outbound != null ? (
                          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md w-full max-w-3xl">
                            <div className="flex items-center gap-4">
                              <img
                                src={airportLogo}
                                alt="flyingpanda-logo"
                                className="h-10 w-auto"
                              />
                              <div className="flex flex-col mx-14">
                                <div className="text-sm w-full mx-14">
                                  <span className="mb-2 font-bold">
                                    {flight.outbound.airline} ({flight.outbound.airlineCode})
                                  </span>
                                  <div className="flex items-center justify-center gap-4">
                                    <div className="text-lg font-semibold text-gray-800">
                                      {new Date(
                                        flight.outbound.departure
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                    <div className="text-gray-400">
                                      {flight.outbound.duration}
                                    </div>
                                    <div className="text-lg font-semibold text-gray-800">
                                      {new Date(
                                        flight.outbound.arrival
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                                    <span>{flight.outbound.origin}</span>
                                    <div className="flex m-5">
                                      <LiaPlaneDepartureSolid className="text-blue-500 whitespace-nowrap" />
                                    </div>

                                    <span>{flight.outbound.destination}</span>
                                  </div>
                                </div>
                                {flight.return !== null ? (
                                  <div className="text-sm w-full mx-14">
                                     <span className="mb-2 font-bold">
                                    {flight.return.airline} ({flight.return.airlineCode})
                                  </span>
                                    <div className="flex items-center justify-center gap-4">
                                      <div className="text-lg font-semibold text-gray-800">
                                        {new Date(
                                          flight.return.departure
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </div>
                                      <div className="text-gray-400">
                                        {flight.return.duration}
                                      </div>
                                      <div className="text-lg font-semibold text-gray-800">
                                        {new Date(
                                          flight.return.arrival
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                                      <span>{flight.return.origin}</span>
                                      <div className="flex m-5">
                                        <LiaPlaneArrivalSolid className="text-blue-500 whitespace-nowrap" />
                                      </div>

                                      <span>{flight.return.destination}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-sm w-full mx-14">
                                    <div className="text-gray-500">
                                      No return flight available
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xl font-semibold text-gray-800">
                                ₹{flight.price}
                              </div>
                              <button 
                              onClick={() => handleBookClick(flight)}
                              className="mt-2 px-4 py-1 bg-blue-900 text-white text-sm rounded-md hover:bg-blue-800">
                                Book →
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md w-full max-w-3xl">
                            <div className="flex items-center gap-4">
                              <img
                                src={airportLogo}
                                alt="flyingpanda-logo"
                                className="h-10 w-auto"
                              />
                              <div className="text-sm w-full mx-14">
                                 <span className="mb-2 font-bold">
                                    {flight.airline} ({flight.airlineCode})
                                  </span>
                                <div className="flex items-center justify-center gap-4">
                                  <div className="text-lg font-semibold text-gray-800">
                                    {new Date(
                                      flight.departure
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                  <div className="text-gray-400">
                                    {flight.duration}
                                  </div>
                                  <div className="text-lg font-semibold text-gray-800">
                                    {new Date(
                                      flight.arrival
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                                  <span>{flight.origin}</span>
                                  <div className="flex m-5">
                                    <LiaPlaneDepartureSolid className="text-blue-500 whitespace-nowrap" />
                                  </div>

                                  <span>{flight.destination}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xl font-semibold text-gray-800">
                                ₹{flight.price}
                              </div>
                              <button className="mt-2 px-4 py-1 bg-blue-900 text-white text-sm rounded-md hover:bg-blue-800"
                               onClick={() => handleBookClick(flight)}>
                                Book →
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-700">
                  No flights found. Please adjust your search criteria.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

       {showBookingModal && selectedFlight && (
        <BookingModal
          flight={selectedFlight}
          returnFlight={selectedReturn}
          passengers={formData.passengers}
          price={selectedPrice}
          onClose={() => setShowBookingModal(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};
