import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuditForm from './AuditForm';
import { useAlerts } from '../alert/AlertContext';

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
  }, [location.state, navigate]);
  
  // Este efecto se ejecuta solo una vez al montar el componente
  // para resetear las alertas de validación
  useEffect(() => {
    // Resetear showValidationAlerts cuando se monta el componente
    setShowValidationAlerts(false);
    // Limpiar cualquier dato de validación previa almacenado
    sessionStorage.removeItem("validation-attempted");
  }, []);
  
  const handleAuditCreation = (formData: any) => {
    // Marcar que se ha intentado una validación
    sessionStorage.setItem("validation-attempted", "true");
    
    // Activar alertas solo cuando se intenta enviar el formulario
    setShowValidationAlerts(true);
    
    // Comprobar si hay errores en el formulario
    const hasErrors = formData.errors && Object.keys(formData.errors).length > 0;
    
    // Solo mostrar mensaje de éxito si NO hay errores
    if (!hasErrors) {
      console.log("Nueva auditoría creada:", formData);
      
      // Verificar que los campos obligatorios estén realmente llenos
      if (formData.companyId && formData.standardId && formData.auditName && formData.startDate) {
        addAlert('success', 'Evaluación creada exitosamente');
        // Aquí iría la lógica para enviar los datos al backend
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