import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'badge-pending';
      case 'APPROVED':
        return 'badge-approved';
      case 'REJECTED':
        return 'badge-rejected';
      case 'RETURNED':
        return 'badge-returned';
      case 'AVAILABLE':
        return 'badge-available';
      default:
        return 'badge';
    }
  };

  return (
    <span className={getStatusClass()}>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;