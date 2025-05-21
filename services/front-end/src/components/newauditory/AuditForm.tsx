import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CompanySelector from './CompanySelector';
import StandardSelector from './StandardSelector';
import { useAlerts } from '../alert/AlertContext';

// Create a proper type instead of using 'any'
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

interface AuditFormProps {
  onSubmit: (formData: AuditFormData) => void;
  showValidationAlerts?: boolean;
}

// Clave para almacenar el estado del formulario entre navegaciones
const FORM_DATA_STORAGE_KEY = "audit-form-data";

const AuditForm = ({ onSubmit, showValidationAlerts = false }: AuditFormProps) => {
  const { addAlert } = useAlerts();
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState<AuditFormData>({
    companyId: '',
    companyName: '',
    standardId: '',
    standardName: '',
    auditName: '',
    startDate: '',
    endDate: '',
    objective: '',
    scope: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos guardados al montar el componente
  useEffect(() => {
    try {
      const savedData = sessionStorage.getItem(FORM_DATA_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          ...parsedData
        }));
      }
    } catch (error) {
      console.error("Error al cargar datos guardados:", error);
    }
  }, []);

  // Guardar datos cuando cambian
  useEffect(() => {
    // Solo guardar si hay al menos un campo con valor
    if (Object.values(formData).some(value => value)) {
      sessionStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error cuando se modifica el campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCompanySelect = (id: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      companyId: id,
      companyName: name
    }));
    
    // Limpiar error de compañía si existe
    if (errors.companyId) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.companyId;
        return newErrors;
      });
    }
  };

  const handleStandardSelect = (id: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      standardId: id,
      standardName: name
    }));
    
    // Limpiar error de estándar si existe
    if (errors.standardId) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.standardId;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
      // Validación de empresa
      if (!formData.companyId && !formData.companyName) {
        newErrors.companyId = "Por favor selecciona una empresa";
        hasErrors = true;
      }
      
      // Validación de estándar
      if (!formData.standardId) {
        newErrors.standardId = "Por favor selecciona un estándar";
        hasErrors = true;
      }
      
      // Validación de nombre de auditoría
      if (!formData.auditName || formData.auditName.trim() === "") {
        newErrors.auditName = "El nombre de la auditoría es requerido";
        hasErrors = true;
      }
      
      // Validación de fecha de inicio
      if (!formData.startDate) {
        newErrors.startDate = "La fecha de inicio es requerida";
        hasErrors = true;
      }
      
      // Validación de fecha de finalización (si está presente)
      if (formData.startDate && formData.endDate && 
          new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = "La fecha de finalización debe ser posterior a la fecha de inicio";
        hasErrors = true;
      }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm();
    if (isValid) {
      // Use addAlert to inform about successful form submission
      addAlert('success', 'Formulario de auditoría creado correctamente');
      onSubmit(formData);
      
      // Navegar a /auditory cuando el formulario es válido
      navigate('/auditory', { 
        state: { 
          formData,
          fromCreation: true  // Para saber que venimos de la creación
        } 
      });
    } else {
      // Use addAlert to notify about validation errors
      addAlert('error', 'Por favor corrige los errores en el formulario');
      onSubmit({ ...formData, errors });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans">
      {/* Sección de datos básicos */}
      <div className="p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Información Básica</h2>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Evaluación
            </label>
            <input
              type="text"
              value={formData.auditName}
              onChange={(e) => handleChange('auditName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Auditoría Anual de Seguridad 2025"
            />
            {errors.auditName && showValidationAlerts && 
              <p className="text-red-500 text-sm mt-1">{errors.auditName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.startDate && showValidationAlerts && 
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Finalización (Estimada)
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.endDate && showValidationAlerts && 
              <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>
        </div>

      </div>
      
      {/* Sección de empresa y estándar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompanySelector
          onSelect={handleCompanySelect}
          error={errors.companyId}
          currentFormData={formData}
          showAlerts={showValidationAlerts}
        />
        
        <StandardSelector 
          onSelect={handleStandardSelect} 
          error={errors.standardId}
          showAlerts={showValidationAlerts}
        />
      </div>            
      {/* Botones de acción */}
      <div className="flex justify-center gap-4">
        <Link to="/"
          className="px-6 py-2 bg-red-600 border border-gray-300 rounded-md text-white hover:bg-red-700 transition-colors"
        >
          Cancelar
        </Link>
        
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors"
        >
          Crear Evaluación
        </button>
      </div>
    </form>
  );
};

export default AuditForm;