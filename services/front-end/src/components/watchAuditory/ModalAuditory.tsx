import { useState, useEffect } from "react";
import axios from "axios";

interface StandardSelectorProps {
  onSelect: (id: string, name: string) => void;
  error?: string;
  showAlerts?: boolean;
}

// Ampliamos la interfaz Standard para incluir más información
interface Standard {
  id: string;
  name: string;
  // Añadimos campos adicionales que devuelve la API
  program?: string;
  auditDate?: string;
  company?: string;
  completionPercentage?: number;
}


const ModalAuditory = ({ onSelect, error, showAlerts = false }: StandardSelectorProps) => {
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
          withCredentials: false
        });
        
        if (response.data && response.data.success && Array.isArray(response.data.forms)) {
            // Procesar las auditorías para mostrar más información
            const processedForms = response.data.forms.map((form: Standard) => ({
                id: form.id,
                name: form.name,
                // Formatear la fecha si existe
                auditDate: form.auditDate ? new Date(form.auditDate).toLocaleDateString() : 'Sin fecha',
                // Información adicional si está disponible
                company: form.company || 'Empresa no especificada'
            }));
            
            setAvailableStandards(processedForms);
            setFetchError(null);
        } else {
            console.warn('Formato de respuesta inesperado:', response.data);
            setFetchError('El formato de respuesta no es el esperado');
        }
      } catch (err) {
        console.error('Error fetching standards:', err);
        setFetchError('No se pudieron cargar las auditorías. Por favor, intenta de nuevo más tarde.');
        if (showAlerts) {
          alert('Error al cargar las auditorías: ' + (err instanceof Error ? err.message : String(err)));
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
        console.log("Auditoría seleccionada:", standard); // Añadir log para depuración
        // Usamos el nombre y el ID para la navegación
        onSelect(standard.id, standard.name);
    }
    };

  
  return (
    <div className="bg-white border border-gray-200 font-sans rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Auditorías Disponibles</h3>
      
      {loading && (
        <div className="py-4 text-center">
          <p className="text-gray-600">Cargando auditorías...</p>
        </div>
      )}

      {fetchError && (
        <div className="py-2 text-center">
          <p className="text-red-500">{fetchError}</p>
        </div>
      )}

      {!loading && !fetchError && availableStandards.length === 0 && (
        <div className="py-4 text-center">
          <p className="text-gray-600">No hay auditorías disponibles</p>
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
              <div className="flex-1">
                <p className="font-medium">{standard.name}</p>
                <div className="text-sm text-gray-500 mt-1">
                  <p>ID: {standard.id.substring(0, 8)}...</p>
                  {standard.auditDate && <p>Fecha: {standard.auditDate}</p>}
                  {standard.company && <p>Empresa: {standard.company}</p>}
                  {standard.completionPercentage !== undefined && 
                    <p>Progreso: {Math.round(standard.completionPercentage * 100)}%</p>
                  }
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ModalAuditory;