import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuditForm from './AuditForm';
import { useAlerts } from '../alert/AlertContext';

// Define the AuditFormData interface
interface AuditFormData {
  companyId: string;
  companyName: string;
  standardId: string;
  standardName: string;
  auditName: string;
  startDate: string;
  endDate: string;
  objective: string;
  scope: string;
  errors?: Record<string, string>;
}

const NewAuditoryComponent = () => {
  // Inicializar showValidationAlerts en false para evitar mostrar errores al cargar
  const [showValidationAlerts, setShowValidationAlerts] = useState(false);
  const { addAlert } = useAlerts();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Efecto para limpiar la bandera skipSuccessMessage del state
  useEffect(() => {
    if (location.state) {
      // Crear una copia del state actual para poder modificarlo
      const newState = { ...location.state };
      
      // Si venimos de crear una compañía, limpiar la bandera
      if (newState.skipSuccessMessage) {
        delete newState.skipSuccessMessage;
        
        // Reemplazar el state actual sin recargar la página
        navigate(location.pathname, { 
          state: Object.keys(newState).length > 0 ? newState : undefined,
          replace: true 
        });
      }
    }
  }, [location.state, location.pathname, navigate]);
  
  // Este efecto se ejecuta solo una vez al montar el componente
  // para resetear las alertas de validación
  useEffect(() => {
    // Resetear showValidationAlerts cuando se monta el componente
    setShowValidationAlerts(false);
    // Limpiar cualquier dato de validación previa almacenado
    sessionStorage.removeItem("validation-attempted");
  }, []);
  
  const handleAuditCreation = async (formData: AuditFormData) => {
    // Marcar que se ha intentado una validación
    sessionStorage.setItem("validation-attempted", "true");
    
    // Activar alertas solo cuando se intenta enviar el formulario
    setShowValidationAlerts(true);
    
    // Comprobar si hay errores en el formulario
    const hasErrors = formData.errors && Object.keys(formData.errors).length > 0;
    
    // Solo mostrar mensaje de éxito y proceder si NO hay errores
    if (!hasErrors) {
      console.log("Nueva auditoría seleccionada:", formData);
      
      // Verificar que los campos obligatorios estén realmente llenos
      if (formData.companyId && formData.standardId && formData.auditName && formData.startDate) {
        try {
          // Hacer la petición a la API para obtener los detalles de la auditoría
          const response = await fetch(`http://localhost:3000/api/forms/getForms/${formData.standardId}`);
          
          if (!response.ok) {
            throw new Error('Error al obtener los detalles de la auditoría');
          }
          
          const auditData = await response.json();
          
          // Si tenemos datos válidos, preparar los datos para la página de auditoría
          if (auditData.success && auditData.audit) {
            // Crear un objeto con la información de la auditoría y los metadatos
            const auditoryData = {
              auditData: auditData,
              metadata: {
                companyId: formData.companyId,
                companyName: formData.companyName,
                auditName: formData.auditName,
                standardId: formData.standardId,
                standardName: formData.standardName,
                startDate: formData.startDate,
                endDate: formData.endDate
              }
            };
            
            // Guardar los datos en sessionStorage para acceder a ellos en la página de auditoría
            sessionStorage.setItem('currentAudit', JSON.stringify(auditoryData));
            
            // Redirigir a la página de auditoría con el ID de la auditoría y los datos necesarios
            navigate(`/auditory/${formData.standardId}`, { 
              state: auditoryData
            });
            
            addAlert('success', 'Evaluación cargada exitosamente');
          } else {
            addAlert('error', 'No se pudo cargar la evaluación seleccionada');
          }
        } catch (error) {
          console.error("Error al cargar la evaluación:", error);
          addAlert('error', 'Error al cargar la evaluación: ' + (error as Error).message);
        }
      } else {
        // En caso de que la validación en AuditForm no haya capturado todos los errores
        addAlert('error', 'Faltan campos obligatorios por completar');
      }
    } else {
      addAlert('error', 'Por favor completa todos los campos requeridos');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-6 overflow-y-auto font-sans">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-blue-700 mb-6">Crear Nueva Evaluación</h1>
          <AuditForm 
            onSubmit={handleAuditCreation} 
            showValidationAlerts={showValidationAlerts} 
          />
        </div>
      </div>
    </div>
  );
};

export default NewAuditoryComponent;