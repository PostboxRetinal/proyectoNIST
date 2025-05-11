import { useState } from "react";

interface StandardSelectorProps {
  onSelect: (id: string, name: string) => void;
  error?: string;
}

interface Standard {
  id: string;
  name: string;
  description: string;
}

const StandardSelector = ({ onSelect, error }: StandardSelectorProps) => {
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
  
  // Estándares disponibles
  const availableStandards: Standard[] = [
    { 
      id: 'iso27001', 
      name: 'ISO/IEC 27001', 
      description: 'Gestión de seguridad de la información' 
    },
    { 
      id: 'iso9001', 
      name: 'ISO 9001', 
      description: 'Gestión de calidad' 
    },
    { 
      id: 'iso14001', 
      name: 'ISO 14001', 
      description: 'Gestión ambiental' 
    },
    { 
      id: 'iso22301', 
      name: 'ISO 22301', 
      description: 'Continuidad del negocio' 
    },
    { 
      id: 'ieee830', 
      name: 'IEEE 830', 
      description: 'Especificación de requisitos de software' 
    }
  ];

  const handleSelectStandard = (standardId: string) => {
    setSelectedStandard(standardId);
    const standard = availableStandards.find(s => s.id === standardId);
    if (standard) {
      onSelect(standard.id, standard.name);
    }
  };

  return (
    <div className="bg-white border border-gray-200 font-sans rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Estándar de Evaluación</h3>
      
      <div className="space-y-3">
        {availableStandards.map((standard) => (
          <div 
            key={standard.id}
            className={`border p-3 rounded-md cursor-pointer transition-colors ${
              selectedStandard === standard.id 
                ? 'bg-blue-50 border-blue-300' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleSelectStandard(standard.id)}
          >
            <div className="flex items-center">
              <div className="h-4 w-4 mr-2">
                <div className={`h-full w-full rounded-full border ${
                  selectedStandard === standard.id 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`} />
              </div>
              <div>
                <p className="font-medium">{standard.name}</p>
                <p className="text-xs text-gray-500">{standard.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default StandardSelector;