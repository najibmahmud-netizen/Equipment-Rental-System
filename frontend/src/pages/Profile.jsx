import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/accounts/profile/');
      setProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.patch('/accounts/profile/', profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Account Information
          </h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Username:</span>
              <span className="font-medium">{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user?.email || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Full Name:</span>
              <span className="font-medium">
                {user?.first_name || ''} {user?.last_name || ''}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
            Contact Information
          </h2>

          {message.text && (
            <div className={`px-4 py-3 rounded mb-4 ${
              message.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={profile.phone || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={profile.address || ''}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Enter your address"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-full"
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;