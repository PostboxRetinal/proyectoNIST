import React from 'react';
import { Link } from 'react-router-dom';

interface SideBarProps {
  sections: Record<string, any>;
  currentSection: string;
  onSectionChange: (sectionId: string) => void;
  metadata?: any;
}

const SideBar: React.FC<SideBarProps> = ({ sections, currentSection, onSectionChange, metadata }) => {
  const sectionIds = Object.keys(sections).sort();
  
  return (
    <div className="w-64 bg-white shadow-md h-full overflow-y-auto">
      {/* Información de la auditoría */}
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg mb-2">
          {metadata?.auditName || 'Auditoría NIST'}
        </h2>
        {metadata && (
          <>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Empresa:</span> {metadata.companyName}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Estándar:</span> {metadata.standardName}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Fecha inicio:</span> {new Date(metadata.startDate).toLocaleDateString()}
            </p>
          </>
        )}
      </div>
      
      {/* Navegación por secciones */}
      <div className="p-2">
        <h3 className="font-semibold text-sm uppercase text-gray-500 px-2 py-1">Secciones</h3>
        <ul>
          {sectionIds.map((sectionId) => {
            // Calcular el porcentaje de avance para esta sección
            const section = sections[sectionId];
            const completionPercentage = section.completionPercentage || 0;
            
            return (
              <li key={sectionId}>
                <button
                  onClick={() => onSectionChange(sectionId)}
                  className={`w-full text-left px-3 py-2 my-1 rounded flex justify-between items-center ${
                    currentSection === sectionId 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex-1">
                    <span className="font-medium">Sección {sectionId}</span>
                  </div>
                  <div className="w-10 h-5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Enlaces de navegación */}
      <div className="mt-auto p-4 border-t">
        <Link 
          to="/"
          className="block text-center w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default SideBar;