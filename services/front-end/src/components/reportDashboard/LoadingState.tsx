import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Cargando datos...</p>
    </div>
  );
};

export default LoadingState;