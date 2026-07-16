import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/rentals/dashboard/');
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button onClick={fetchStats} className="btn btn-primary mt-4">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of equipment rental system</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/admin/equipment/add"
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center hover:bg-blue-100 transition"
        >
          <div className="text-2xl mb-1"></div>
          <div className="font-medium text-blue-700">Add Equipment</div>
        </Link>
        <Link
          to="/admin/equipment"
          className="bg-green-50 border border-green-200 rounded-lg p-4 text-center hover:bg-green-100 transition"
        >
          <div className="text-2xl mb-1"></div>
          <div className="font-medium text-green-700">Manage Equipment</div>
        </Link>
        <Link
          to="/admin/rentals"
          className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center hover:bg-purple-100 transition"
        >
          <div className="text-2xl mb-1"></div>
          <div className="font-medium text-purple-700">Rental Requests</div>
        </Link>
      </div>

      {/* Rental Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats?.statistics?.total || 0}</div>
          <div className="text-sm text-gray-500">Total Requests</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats?.statistics?.pending || 0}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats?.statistics?.approved || 0}</div>
          <div className="text-sm text-gray-500">Approved</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats?.statistics?.rejected || 0}</div>
          <div className="text-sm text-gray-500">Rejected</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats?.statistics?.returned || 0}</div>
          <div className="text-sm text-gray-500">Returned</div>
        </div>
      </div>

      {/* Equipment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Equipment Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Items:</span>
              <span className="font-medium">{stats?.equipment_stats?.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Available:</span>
              <span className="font-medium text-green-600">{stats?.equipment_stats?.available || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Unavailable:</span>
              <span className="font-medium text-red-600">{stats?.equipment_stats?.unavailable || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      {stats?.recent_requests && stats.recent_requests.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-800">Recent Rental Requests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recent_requests.slice(0, 10).map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{request.customer?.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{request.equipment?.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(request.request_date).toLocaleDateString()}
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

export default AdminDashboard;