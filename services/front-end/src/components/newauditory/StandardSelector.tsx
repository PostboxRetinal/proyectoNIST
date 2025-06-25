import { useState, useEffect } from "react";
import axios from "axios";

interface StandardSelectorProps {
  onSelect: (id: string, name: string) => void;
  error?: string;
  showAlerts?: boolean;
}

interface Standard {
  id: string;
  name: string;
}

const StandardSelector = ({ onSelect, error, showAlerts = false }: StandardSelectorProps) => {
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
  const [availableStandards, setAvailableStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        setLoading(true);
        
        // Configuración para manejar problemas de CORS
        const response = await axios.get('http://localhost:3000/api/forms/getForms', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          withCredentials: false // Deshabilitar credenciales puede ayudar con CORS
        });
        
        // Basado en la estructura de respuesta que mostraste
        if (response.data && response.data.success && Array.isArray(response.data.forms)) {
        // Filtrar solo los estándares "NIST800-30" y "ISO27001"
        const filteredStandards = response.data.forms.filter(
          (standard: Standard) => standard.name === "NIST800-30" || standard.name === "ISO27001"
        );
        setAvailableStandards(filteredStandards);
        setFetchError(null);
      } else {
        console.warn('Formato de respuesta inesperado:', response.data);
        setFetchError('El formato de respuesta no es el esperado');
      }
    } catch (err) {
        console.error('Error fetching standards:', err);
        setFetchError('No se pudieron cargar los estándares. Por favor, intenta de nuevo más tarde.');
        if (showAlerts) {
          alert('Error al cargar los estándares: ' + (err instanceof Error ? err.message : String(err)));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStandards();
  }, [showAlerts]);

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
      
      {loading && (
        <div className="py-4 text-center">
          <p className="text-gray-600">Cargando estándares...</p>
        </div>
      )}

      {fetchError && (
        <div className="py-2 text-center">
          <p className="text-red-500">{fetchError}</p>
        </div>
      )}

      {!loading && !fetchError && availableStandards.length === 0 && (
        <div className="py-4 text-center">
          <p className="text-gray-600">No hay estándares disponibles</p>
        </div>
      )}
      
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