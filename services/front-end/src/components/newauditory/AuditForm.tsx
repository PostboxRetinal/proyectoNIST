import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileSelector from './ProfileSelector';
import CompanySelector from './CompanySelector';
import StandardSelector from './StandardSelector';
import { useAlerts } from '../alert/AlertContext';

interface AuditFormProps {
  onSubmit: (data: any) => void;
}

const AuditForm = ({ onSubmit }: AuditFormProps) => {
  const { addAlert } = useAlerts();
  const navigate = useNavigate();
  
  // Estado del formulario y errores como ya los tenías
  const [formData, setFormData] = useState({
    profileId: '',
    profileName: '',
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

  const handleProfileSelect = (id: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      profileId: id,
      profileName: name
    }));
  };

  const handleCompanySelect = (id: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      companyId: id,
      companyName: name
    }));
  };

  const handleStandardSelect = (id: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      standardId: id,
      standardName: name
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
    if (!formData.profileId) {
      newErrors.profileId = "Por favor selecciona un perfil";
      hasErrors = true;
    }
    
    if (!formData.companyId && !formData.companyName) {
      newErrors.company = "Por favor selecciona o ingresa una empresa";
      hasErrors = true;
    }
    
    if (!formData.standardId) {
      newErrors.standardId = "Por favor selecciona un estándar";
      hasErrors = true;
    }
    
    if (!formData.auditName.trim()) {
      newErrors.auditName = "El nombre de la auditoría es requerido";
      hasErrors = true;
    }
    
    if (!formData.startDate) {
      newErrors.startDate = "La fecha de inicio es requerida";
      hasErrors = true;
    }
    
    if (formData.startDate && formData.endDate && 
        new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "La fecha de finalización debe ser posterior a la fecha de inicio";
      hasErrors = true;
    }

    setErrors(newErrors);
    return { isValid: !hasErrors, errors: newErrors };
  };

  // Función para determinar la ruta destino según el estándar
  const getDestinationRoute = () => {
    // Por ahora solo ISO27001 navega a /auditory
    // En el futuro puedes agregar más rutas para otros estándares
    switch (formData.standardId) {
      case 'iso27001':
        return '/iso27001';
      // Aquí puedes agregar más casos en el futuro:
      // case 'iso9001':
      //   return '/iso9001-audit';
      default:
        return '/'; // Ruta por defecto si no hay caso específico
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors } = validateForm();
    
    if (isValid) {
      // Todo está correcto - mostrar confirmación y enviar datos
      addAlert('success', 'Evaluación creada con éxito');
      onSubmit(formData);
      
      // Navegar a la ruta correspondiente según el estándar seleccionado
      const destinationRoute = getDestinationRoute();
      navigate(destinationRoute);
    } else {
      // Mostrar los errores específicos
      Object.values(errors).forEach(errorMsg => {
        addAlert('warning', errorMsg);
      });
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
            {errors.auditName && <p className="text-red-500 text-sm mt-1">{errors.auditName}</p>}
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
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
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
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>
        </div>
      </div>
      
      {/* Sección del perfil, empresa y estándar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfileSelector 
          onSelect={handleProfileSelect} 
          error={errors.profileId} 
        />
        
        <CompanySelector 
          onSelect={handleCompanySelect} 
          onManualEntry={(name) => handleChange('companyName', name)}
          error={errors.company}
        />
        
        <StandardSelector 
          onSelect={handleStandardSelect} 
          error={errors.standardId}
        />
      </div>
      
      {/* Sección de objetivo y alcance */}
      <div className="p-6 bg-blue-50 rounded-lg space-y-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Objetivo y Alcance</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objetivo de la Auditoría
          </label>
          <textarea
            value={formData.objective}
            onChange={(e) => handleChange('objective', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto resize-none"
            rows={3}
            placeholder="Describe el objetivo principal de esta evaluación"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alcance de la Auditoría
          </label>
          <textarea
            value={formData.scope}
            onChange={(e) => handleChange('scope', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto resize-none"
            rows={3}
            placeholder="Define el alcance y límites de esta evaluación"
          />
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <Link to="/"
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
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