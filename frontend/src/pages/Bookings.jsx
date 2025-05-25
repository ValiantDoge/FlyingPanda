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
            const response = await axiosInstance.post('/api/flights/bookings',);
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const data = await response.json();
            setBookings(data);
            setLoading(false);
        } catch (err) {
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
                    bookings.map((booking) => (
                        <div key={booking.id} className="bg-white shadow-md rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="font-semibold text-lg">Flight: {booking.flightNumber}</h2>
                                    <p className="text-gray-600">From: {booking.origin} - To: {booking.destination}</p>
                                    <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">₹{booking.price}</p>
                                    <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Bookings;