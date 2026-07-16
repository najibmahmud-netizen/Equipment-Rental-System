import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import EquipmentCard from '../components/EquipmentCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await api.get('/equipment/');
      setEquipment(response.data.slice(0, 6)); // Show only 6 items
      setError(null);
    } catch (err) {
      setError('Failed to load equipment.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-12 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Rent Equipment Made Easy
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Browse laptops, cameras, projectors, and more. Rent what you need, when you need it.
          </p>
          <Link to="/equipment" className="btn bg-white text-blue-600 hover:bg-blue-50">
            Start Browsing
          </Link>
        </div>
      </div>

      {/* Featured Equipment */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Equipment</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <EquipmentCard key={item.id} equipment={item} />
        ))}
      </div>

      {equipment.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No equipment available yet.</p>
          <p className="text-gray-400">Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default Home;