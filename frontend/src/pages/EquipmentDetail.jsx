import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentalForm, setRentalForm] = useState({
    start_date: '',
    end_date: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [rentalError, setRentalError] = useState('');
  const [rentalSuccess, setRentalSuccess] = useState('');

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const response = await api.get(`/equipment/${id}/`);
      setEquipment(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load equipment details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRentalChange = (e) => {
    setRentalForm({
      ...rentalForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRentalSubmit = async (e) => {
    e.preventDefault();
    setRentalError('');
    setRentalSuccess('');
    setSubmitting(true);

    try {
      const response = await api.post('/rentals/create/', {
        equipment_id: parseInt(id),
        start_date: rentalForm.start_date,
        end_date: rentalForm.end_date,
        notes: rentalForm.notes,
      });
      
      setRentalSuccess('Rental request submitted successfully!');
      setRentalForm({
        start_date: '',
        end_date: '',
        notes: '',
      });
    } catch (err) {
      setRentalError(err.response?.data?.error || 'Failed to submit rental request. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !equipment) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Equipment not found'}</p>
        <button onClick={() => navigate('/equipment')} className="btn btn-primary mt-4">
          Back to Equipment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/equipment')}
        className="btn btn-secondary mb-4"
      >
        ← Back to Equipment
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2">
            {equipment.image ? (
              <img 
                src={`http://localhost:8000${equipment.image}`} 
                alt={equipment.name}
                className="w-full h-full object-cover"
                style={{ minHeight: '300px' }}
              />
            ) : (
              <div className="w-full h-64 md:h-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center" style={{ minHeight: '300px' }}>
                <span className="text-gray-400 text-6xl"></span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{equipment.name}</h1>
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                {equipment.category}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{equipment.description}</p>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-bold text-blue-600">${equipment.daily_price}/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span>{equipment.quantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <StatusBadge status={equipment.availability_status} />
              </div>
            </div>

            {/* Rental Form */}
            {user ? (
              equipment.available && equipment.quantity > 0 ? (
                <form onSubmit={handleRentalSubmit} className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Request to Rent</h3>
                  
                  {rentalError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3 text-sm">
                      {rentalError}
                    </div>
                  )}
                  
                  {rentalSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-3 text-sm">
                      {rentalSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={rentalForm.start_date}
                        onChange={handleRentalChange}
                        className="input-field text-sm"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        value={rentalForm.end_date}
                        onChange={handleRentalChange}
                        className="input-field text-sm"
                        required
                        min={rentalForm.start_date || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      name="notes"
                      value={rentalForm.notes}
                      onChange={handleRentalChange}
                      className="input-field text-sm"
                      rows="2"
                      placeholder="Any special requests?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary w-full"
                  >
                    {submitting ? 'Submitting...' : 'Submit Rental Request'}
                  </button>
                </form>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                  <p className="text-yellow-700">This equipment is currently not available for rent.</p>
                </div>
              )
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
                <p className="text-blue-700">
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Login
                  </button>
                  {' '}to request this equipment
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;