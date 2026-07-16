import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-red-600 mb-3">{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary text-sm">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;