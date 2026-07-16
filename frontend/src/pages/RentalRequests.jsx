import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const RentalRequests = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await api.get('/rentals/');
      setRentals(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load rental requests.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this rental request?')) return;
    
    try {
      await api.post(`/rentals/${id}/approve/`);
      fetchRentals();
    } catch (err) {
      alert('Failed to approve request. Please try again.');
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason === null) return;
    
    try {
      await api.post(`/rentals/${id}/reject/`, { reason });
      fetchRentals();
    } catch (err) {
      alert('Failed to reject request. Please try again.');
      console.error(err);
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm('Mark this equipment as returned?')) return;
    
    try {
      await api.post(`/rentals/${id}/return/`);
      fetchRentals();
    } catch (err) {
      alert('Failed to mark as returned. Please try again.');
      console.error(err);
    }
  };

  const filteredRentals = filter === 'ALL' 
    ? rentals 
    : rentals.filter(r => r.status === filter);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Rental Requests</h1>
        <p className="text-gray-600">Manage all rental requests</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'RETURNED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {filteredRentals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No rental requests found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{rental.customer?.username}</div>
                      <div className="text-xs text-gray-500">{rental.customer?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{rental.equipment?.name}</div>
                      <div className="text-xs text-gray-500">{rental.equipment?.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{formatDate(rental.start_date)} - {formatDate(rental.end_date)}</div>
                      <div className="text-xs text-gray-500">{rental.rental_days || 0} days</div>
                      {rental.returned_at && (
                        <div className="text-xs text-green-600">Returned: {formatDate(rental.returned_at)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={rental.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {rental.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(rental.id)}
                              className="btn btn-success text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(rental.id)}
                              className="btn btn-danger text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {rental.status === 'APPROVED' && (
                          <button
                            onClick={() => handleReturn(rental.id)}
                            className="btn btn-primary text-sm"
                          >
                            Mark Returned
                          </button>
                        )}
                        {rental.admin_notes && (
                          <div className="text-xs text-gray-500 mt-1">
                            Note: {rental.admin_notes}
                          </div>
                        )}
                      </div>
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

export default RentalRequests;