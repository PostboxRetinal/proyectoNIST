import React from 'react';
import { Link } from 'react-router-dom';

interface Option {
  value: string;
  label: string;
  description: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  response: string | null;
  observations: string;
  evidence_url: string;
}

interface Subsection {
  subsection: string;
  title: string;
  questions: Question[];
}

interface Section {
  section: string;
  title: string;
  subsections: Subsection[];
  completionPercentage?: number;
}

// Add SubsectionInfo interface which was missing
interface SubsectionInfo {
  id: string;
  title: string;
}

interface Metadata {
  standardName?: string;
  title?: string;
  companyName?: string;
  auditName?: string;
  startDate?: string;
  endDate?: string;
  auditor?: string;
  subsections?: Record<string, SubsectionInfo[]>; // Add this property to fix the error
}

interface SideBarProps {
  sections?: Record<string, Section>;
  currentSection?: string;
  currentSubsection?: string;
  onSectionChange?: (sectionId: string, subsectionId?: string) => void;
  metadata?: Metadata;
  isOpen?: boolean;
  onClose?: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ 
  sections = {}, 
  currentSection = '',
  currentSubsection,
  onSectionChange = () => {}, 
  metadata,
  isOpen = false,
  onClose = () => {}
}) => {
  const sectionIds = Object.keys(sections).sort();
  
  // Determinar qué mapeo de títulos usar según el estándar
  let sectionTitles: Record<string, string> = {};
  let subsectionInfo: Record<string, SubsectionInfo[]> = {};
  
  // Verificar el estándar en los metadatos
  if (metadata?.standardName === "NIST800-30") {
    // Mapeo para NIST800-30
    sectionTitles = {
      "1": "PLANIFICAR (PLAN)",
      "2": "HACER (DO)",
      "3": "VERIFICAR (CHECK)",
      "4": "ACTUAR (ACT)"
    };
    
    subsectionInfo = {
      "1": [
        {id: "1.1", title: "Risk Framing"},
        {id: "1.2", title: "Risk Assessment"}
      ],
      "2": [
        {id: "2.1", title: "Risk Response"}
      ],
      "3": [
        {id: "3.1", title: "Risk Monitoring"}
      ],
      "4": [
        {id: "4.1", title: "Mejora continua del proceso de gestión de riesgos"}
      ]
    };
  } 
  else if (metadata?.standardName === "ISO27001") {
    // Mapeo para ISO27001
    sectionTitles = {
      "1": "PLANIFICAR (PLAN)",
      "2": "HACER (DO)",
      "3": "VERIFICAR (CHECK)",
      "4": "ACTUAR (ACT)"
    };
    
    subsectionInfo = {
      "1": [
        {id: "1.1", title: "Risk Framing"},
        {id: "1.2", title: "Risk Assessment"}
      ],
      "2": [
        {id: "2.1", title: "Risk Response"}
      ],
      "3": [
        {id: "3.1", title: "Risk Monitoring"}
      ],
      "4": [
        {id: "4.1", title: "Mejora continua del proceso de gestión de riesgos"}
      ]
    };
  }
  else {
    // Para otros estándares, usar títulos genéricos
    sectionIds.forEach(id => {
      sectionTitles[id] = `Sección ${id}`;
    });
    
    // Si hay subsecciones definidas en los metadatos, usarlas
    if (metadata?.subsections) {
      subsectionInfo = metadata.subsections;
    }
  }
  
  // Manejo de la navegación de secciones con cierre opcional del sidebar en móviles
  const handleSectionChange = (sectionId: string, subsectionId?: string) => {
    onSectionChange(sectionId, subsectionId);
    
    // En dispositivos móviles, cerrar el sidebar después de seleccionar
    if (window.innerWidth < 768) {
      onClose();
    }
  };
  
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out sidebar ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Botón para cerrar en móviles */}
      <button
        className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={onClose}
        aria-label="Cerrar menú"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="h-full overflow-y-auto flex flex-col">
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
                <span className="font-semibold">Fecha inicio:</span> {metadata.startDate ? new Date(metadata.startDate).toLocaleDateString() : 'No definida'}
              </p>
            </>
          )}
        </div>
        
        {/* Navegación por secciones */}
        <div className="p-2 flex-grow">
          <h3 className="font-semibold text-sm uppercase text-gray-500 px-2 py-1">Secciones</h3>
          <ul>
            {sectionIds.map((sectionId) => {
              // Calcular el porcentaje de avance para esta sección
              const section = sections[sectionId];
              const completionPercentage = section.completionPercentage || 0;
              
              // Obtener el título de la sección desde el mapeo
              const sectionTitle = sectionTitles[sectionId] || `Sección ${sectionId}`;
              
              return (
                <li key={sectionId}>
                  <button
                    onClick={() => handleSectionChange(sectionId)}
                    className={`w-full text-left px-3 py-2 my-1 rounded flex justify-between items-center ${
                      currentSection === sectionId 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex-1">
                      <span className="font-medium">{sectionTitle}</span>
                    </div>
                    <div className="w-10 h-5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                  </button>
                  
                  {/* Mostrar subsecciones si la sección está seleccionada */}
                  {currentSection === sectionId && subsectionInfo[sectionId] && (
                    <div className="pl-4 mt-1 space-y-1">
                      {subsectionInfo[sectionId].map(subsection => (
                        <button
                          key={subsection.id}
                          onClick={() => handleSectionChange(sectionId, subsection.id)}
                          className={`w-full text-left text-sm py-1 px-2 rounded ${
                            currentSubsection === subsection.id
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span className="font-medium mr-1">{subsection.id}:</span>
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  )}
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
    </div>
  );
};

export default SideBar;