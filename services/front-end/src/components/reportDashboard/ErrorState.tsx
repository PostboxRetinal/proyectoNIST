import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Home } from 'lucide-react';

interface ErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="p-6 bg-red-50 text-red-700 rounded-lg">
      <h2 className="text-lg font-medium">No se pudo cargar el formulario</h2>
      <p>{error || 'Verifique que el ID del formulario es correcto e intente nuevamente.'}</p>
      <div className="mt-4 flex gap-4">
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Reintentar
        </button>
        <Link 
          to="/report"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
        >
          <Home className="h-5 w-5 mr-2" />
          Ver todos los formularios
        </Link>
      </div>
    </div>
  );
};

export default ErrorState;