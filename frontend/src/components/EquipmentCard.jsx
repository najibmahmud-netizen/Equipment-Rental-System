import React from 'react';
import { Link } from 'react-router-dom';

const EquipmentCard = ({ equipment }) => {
  const { id, name, category, description, daily_price, availability_status, image } = equipment;

  return (
    <div className="card">
      {image ? (
        <img 
          src={`http://localhost:8000${image}`} 
          alt={name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-4xl">📦</span>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">{category}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{description || 'No description available'}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-blue-600">${daily_price}</span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
          <div>
            {availability_status === 'Available' ? (
              <span className="badge-available">Available</span>
            ) : (
              <span className="badge-unavailable">Not Available</span>
            )}
          </div>
        </div>
        
        <Link
          to={`/equipment/${id}`}
          className="mt-3 btn btn-primary w-full text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EquipmentCard;
