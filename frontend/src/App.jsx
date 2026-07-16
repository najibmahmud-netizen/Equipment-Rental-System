import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EquipmentList from './pages/EquipmentList';
import EquipmentDetail from './pages/EquipmentDetail';
import MyRentals from './pages/MyRentals';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ManageEquipment from './pages/ManageEquipment';
import AddEquipment from './pages/AddEquipment';
import EditEquipment from './pages/EditEquipment';
import RentalRequests from './pages/RentalRequests';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/equipment" element={<EquipmentList />} />
              <Route path="/equipment/:id" element={<EquipmentDetail />} />
              
              {/* Protected routes */}
              <Route path="/my-rentals" element={
                <ProtectedRoute>
                  <MyRentals />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/equipment" element={
                <ProtectedRoute requireAdmin>
                  <ManageEquipment />
                </ProtectedRoute>
              } />
              <Route path="/admin/equipment/add" element={
                <ProtectedRoute requireAdmin>
                  <AddEquipment />
                </ProtectedRoute>
              } />
              <Route path="/admin/equipment/edit/:id" element={
                <ProtectedRoute requireAdmin>
                  <EditEquipment />
                </ProtectedRoute>
              } />
              <Route path="/admin/rentals" element={
                <ProtectedRoute requireAdmin>
                  <RentalRequests />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          
          {/* Footer */}
          <footer className="bg-white shadow-md mt-8">
            <div className="container mx-auto px-4 py-6 text-center text-gray-600">
              <p>© 2026 Equipment Rental System. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;