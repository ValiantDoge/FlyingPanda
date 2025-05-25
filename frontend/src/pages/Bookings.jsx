import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);
    

    const fetchBookings = async () => {
        try {
            const response = await axiosInstance.get('/api/booking/bookings');
            const bookingsData = response.data.data;

            // Fetch all related flight details
            const bookingsWithFlights = await Promise.all(
                bookingsData.map(async (booking) => {
                    try {
                        const flightRes = await axiosInstance.get(`/api/flights/${booking.flight}`);
                        const flightDetails = flightRes.data.data;
                        return { ...booking, flightDetails };
                    } catch (flightErr) {
                        console.error(`Failed to fetch flight ${booking.flight}`, flightErr);
                        return { ...booking, flightDetails: null };
                    }
                })
            );

            setBookings(bookingsWithFlights);
        } catch (err) {
            console.error("Error fetching bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
            <div className="grid gap-4">
                {bookings.length === 0 ? (
                    <p className="text-gray-500">No bookings found.</p>
                ) : (
                    bookings.map((booking) => {
                        const flight = booking.flightDetails;
                        return (
                            <div key={booking._id} className="bg-white shadow-md rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="font-semibold text-lg">
                                            Flight: {flight?.airline || 'N/A'}
                                        </h2>
                                        <p className="text-gray-600">
                                            From: {flight?.origin || 'N/A'} - To: {flight?.destination || 'N/A'}
                                        </p>
                                        <p className="text-gray-600">
                                            Date: {flight?.departure ? new Date(flight.departure).toLocaleDateString() : 'N/A'}
                                        </p>
                                        <p className="text-gray-600">
                                            Time: {flight?.departure ? new Date(flight.departure).toLocaleTimeString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">₹{booking.totalPrice}</p>
                                        <p className="text-sm text-gray-500">Number of Passengers: {booking.passengers}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Bookings;
