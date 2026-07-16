import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const EditEquipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    daily_price: '',
    quantity: '',
    available: true,
  });
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const response = await api.get(`/equipment/${id}/`);
      const data = response.data;
      setFormData({
        name: data.name,
        category: data.category,
        description: data.description,
        daily_price: data.daily_price,
        quantity: data.quantity,
        available: data.available,
      });
      setCurrentImage(data.image);
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
      alert('Failed to load equipment data.');
      navigate('/admin/equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      await api.put(`/equipment/${id}/update/`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/admin/equipment');
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: 'Failed to update equipment. Please try again.' });
      }
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Equipment</h1>
        <p className="text-gray-600">Update equipment details</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.general}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              required
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows="4"
              required
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Daily Price ($) *
              </label>
              <input
                type="number"
                name="daily_price"
                value={formData.daily_price}
                onChange={handleChange}
                className="input-field"
                step="0.01"
                min="0"
                required
              />
              {errors.daily_price && <p className="text-red-500 text-xs mt-1">{errors.daily_price}</p>}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input-field"
                min="1"
                required
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700">Available for rent</span>
            </label>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image
            </label>
            {currentImage && !imagePreview && (
              <div className="mb-2">
                <img
                  src={`http://localhost:8000${currentImage}`}
                  alt="Current"
                  className="h-32 object-cover rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Current image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 object-cover rounded"
                />
                <p className="text-xs text-gray-500 mt-1">New image preview</p>
              </div>
            )}
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex-1"
            >
              {saving ? 'Saving...' : 'Update Equipment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/equipment')}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEquipment;