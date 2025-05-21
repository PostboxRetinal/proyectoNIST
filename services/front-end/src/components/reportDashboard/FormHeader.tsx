import React from 'react';
import { RefreshCw, FileDown, Share2 } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  date: string;
  onRefresh: () => void;
  onExportPDF: () => void;
  onShare: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ 
  title, 
  date, 
  onRefresh, 
  onExportPDF, 
  onShare 
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <div className="flex gap-2">
          <button
            onClick={onExportPDF}
            className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Exportar a PDF
          </button>
          <button
            onClick={onShare}
            className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </button>
          <button
            onClick={onRefresh}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar datos
          </button>
        </div>
      </div>
      <p className="text-gray-600">
        Fecha de creación: {new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
    </div>
  );
};

export default FormHeader;