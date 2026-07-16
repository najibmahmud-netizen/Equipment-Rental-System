import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import EquipmentCard from '../components/EquipmentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredEquipment, setFilteredEquipment] = useState([]);

  useEffect(() => {
    fetchEquipment();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterEquipment();
  }, [equipment, searchTerm, selectedCategory]);

  const fetchEquipment = async () => {
    try {
      const response = await api.get('/equipment/');
      setEquipment(response.data);
      setFilteredEquipment(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load equipment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/equipment/categories/');
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const filterEquipment = () => {
    let filtered = equipment;
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredEquipment(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Equipment</h1>
        <p className="text-gray-600">Find the perfect equipment for your needs</p>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, description, or category..."
              value={searchTerm}
              onChange={handleSearch}
              className="input-field"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button
            onClick={clearFilters}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Found {filteredEquipment.length} item{filteredEquipment.length !== 1 ? 's' : ''}
      </div>
      
      {error && (
        <ErrorMessage message={error} onRetry={fetchEquipment} />
      )}
      
      {/* Equipment Grid */}
      {filteredEquipment.length === 0 && !error ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">No equipment found matching your criteria.</p>
          <button onClick={clearFilters} className="btn btn-primary mt-4">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEquipment.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentList;