import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await api.get('/rentals/');
      setRentals(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load your rentals.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'text-yellow-600';
      case 'APPROVED': return 'text-green-600';
      case 'REJECTED': return 'text-red-600';
      case 'RETURNED': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Rental Requests</h1>
        <p className="text-gray-600">Track all your rental requests and their status</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {rentals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-2">No rental requests yet</p>
          <p className="text-gray-400">Browse equipment and start renting!</p>
          <button
            onClick={() => window.location.href = '/equipment'}
            className="btn btn-primary mt-4"
          >
            Browse Equipment
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{rental.equipment?.name}</div>
                      <div className="text-sm text-gray-500">{rental.equipment?.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{formatDate(rental.start_date)}</div>
                      <div className="text-sm text-gray-500">to {formatDate(rental.end_date)}</div>
                      {rental.returned_at && (
                        <div className="text-xs text-green-600">
                          Returned: {formatDate(rental.returned_at)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={rental.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${rental.total_cost || '0.00'}
                      </div>
                      <div className="text-xs text-gray-500">{rental.rental_days || 0} days</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(rental.request_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRentals;