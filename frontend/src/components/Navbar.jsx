import React from 'react';
import { FaPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg rounded-b-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <FaPlane className="text-white text-2xl" />
            <span className="text-white text-2xl font-bold font-mono tracking-tight">
              Flying Panda
            </span>
          </div>
          
          {/* Booking Button */}
          <button
            onClick={() => navigate('/bookings', { replace: false })}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Bookings
          </button>
        </div>
      </div>
    </nav>
  );
};