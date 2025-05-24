import React, { useState } from 'react';
import axiosInstance from '../api/axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;

// Sample Indian airports data
const INDIAN_AIRPORTS = [
  { code: 'DEL', name: 'Delhi (Indira Gandhi)' },
  { code: 'BOM', name: 'Mumbai (Chhatrapati Shivaji)' },
  { code: 'BLR', name: 'Bengaluru (Kempegowda)' },
  { code: 'HYD', name: 'Hyderabad (Rajiv Gandhi)' },
  { code: 'CCU', name: 'Kolkata (Netaji Subhas Chandra Bose)' },
  { code: 'MAA', name: 'Chennai (Chennai International)' },
  { code: 'GOI', name: 'Goa (Dabolim)' },
  { code: 'PNQ', name: 'Pune (Pune International)' },
  { code: 'AMD', name: 'Ahmedabad (Sardar Vallabhbhai Patel)' },
  { code: 'COK', name: 'Kochi (Cochin International)' },
];

export const FlightSearch = () => {
  const [tripType, setTripType] = useState('round-trip');
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      console.log("Flight search submitted successfully:", response.data);
   } catch (error) {
      console.error("Error submitting flight search:", error.response.data);
      return;
    
   }
   
  };


  return (
    <div className='flex justify-center p-5'>
      <div className='flex flex-col w-full gap-4'>
       
        <div className='flex w-full gap-4'>
          {/* Form section */}
          <div className='w-1/3 bg-blue-400 rounded-lg p-6'>
           {/* Trip type switcher */}
        <div className='flex bg-blue-100 rounded-lg p-1 mb-2'>
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium ${tripType === 'one-way' ? 'bg-blue-600 text-white' : 'text-blue-600'}`}
            onClick={() => setTripType('one-way')}
          >
            One Way
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium ${tripType === 'round-trip' ? 'bg-blue-600 text-white' : 'text-blue-600'}`}
            onClick={() => setTripType('round-trip')}
          >
            Round Trip
          </button>
        </div>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* From dropdown */}
              <div>
                <label className='block text-white text-sm font-medium mb-1'>From</label>
                <select
                  name='origin'
                  value={formData.from}
                  onChange={handleChange}
                  className='w-full p-3 rounded-md border border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none'
                  required
                >
                  <option value=''>Select departure</option>
                  {INDIAN_AIRPORTS.map(airport => (
                    <option key={airport.code} value={airport.code}>
                      {airport.code} - {airport.name}
                    </option>
                  ))}
                </select>
              </div>


              {/* To dropdown */}
              <div>
                <label className='block text-white text-sm font-medium mb-1'>To</label>
                <select
                  name='destination'
                  value={formData.to}
                  onChange={handleChange}
                  className='w-full p-3 rounded-md border border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none'
                  required
                >
                  <option value=''>Select destination</option>
                  {INDIAN_AIRPORTS.map(airport => (
                    <option key={airport.code} value={airport.code}>
                      {airport.code} - {airport.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Departure date */}
              <div>
                <label className='block text-white text-sm font-medium mb-1'>Departure Date</label>
                <input
                  type='date'
                  name='departureDate'
                  value={formData.departureDate}
                  onChange={handleChange}
                  className='w-full p-3 rounded-md border border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none'
                  required
                />
              </div>

              {/* Return date (conditionally rendered) */}
              {tripType === 'round-trip' && (
                <div>
                  <label className='block text-white text-sm font-medium mb-1'>Return Date</label>
                  <input
                    type='date'
                    name='returnDate'
                    value={formData.returnDate}
                    onChange={handleChange}
                    className='w-full p-3 rounded-md border border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none'
                    required={tripType === 'round-trip'}
                  />
                </div>
              )}

              {/* Passengers */}
              <div>
                <label className='block text-white text-sm font-medium mb-1'>Passengers</label>
                <select
                  name='passengers'
                  value={formData.passengers}
                  onChange={handleChange}
                  className='w-full p-3 rounded-md border border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none'
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>

              {/* Submit button */}
              <button
                type='submit'
                className='w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors mt-6'
              >
                Search Flights
              </button>
            </form>
          </div>

          {/* Results section */}
          <div className='w-2/3 bg-blue-300 rounded-lg p-6'>
            <div className='flex items-center justify-center h-full'>
              <p className='text-blue-800 text-lg'>Flight results will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};