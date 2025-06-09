import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'primary', fullScreen = false }) => {
  // Size classes
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-16 w-16',
  };

  // Color classes
  const colorClasses = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-600',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.medium;
  const spinnerColor = colorClasses[color] || colorClasses.primary;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 ${spinnerColor}`}></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 ${spinnerColor}`}></div>
    </div>
  );
};

export default LoadingSpinner;