import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
             Equipment Rental
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/equipment" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Browse
            </Link>
            
            {user ? (
              <>
                {isAdmin && (
                  <div className="relative group">
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition font-medium">
                      Admin ▼
                    </Link>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                      <Link to="/admin/equipment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Manage Equipment
                      </Link>
                      <Link to="/admin/rentals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Rental Requests
                      </Link>
                    </div>
                  </div>
                )}
                <Link to="/my-rentals" className="text-gray-700 hover:text-blue-600 transition font-medium">
                  My Rentals
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition font-medium">
                   {user.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;