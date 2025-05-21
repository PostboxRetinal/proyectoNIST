import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAlerts } from '../alert/AlertContext';

// Importar componentes
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import FormList from './FormList';
import { FormDetail } from './FormDetail';

// Importar tipos y adaptadores desde adapters.ts en lugar de reportTypes
import { adaptFormData, adaptFormList, FormDataNew } from './adapters';

// Definir interfaces locales para tipado en este componente
interface FormResponse {
  success: boolean;
  program: string;
  fechaCreacion: string;
  sections: Array<{
    section?: string | number;
    id?: string | number;
    title: string;
    subsections: Array<{
      subsection?: string | number;
      id?: string | number;
      title: string;
      questions: Array<{
        id: string | number;
        text: string;
        options?: Array<{
          value: string; // Solo string, no number
          label: string;
          description?: string;
        }>;
        response?: string; // Solo string, no number
        observations?: string;
        evidence_url?: string;
      }>;
    }>;
  }>;
  // Ya no hay configuración de umbrales
}

interface FormListItem {
  id: string;
  name: string;
  date: string;
  status: string;
}

const ReportContainer: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [adaptedData, setAdaptedData] = useState<FormDataNew | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableForms, setAvailableForms] = useState<FormListItem[]>([]);
  const { addAlert } = useAlerts();

  // Usando useCallback para envolver las funciones que se usan en dependencias
  const loadAvailableForms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/forms/getForms');
      console.log('Forms list received:', response.data);
      
      if (response.data?.success && Array.isArray(response.data.forms)) {
        // Adaptamos el formato de la respuesta al que necesitamos para la UI
        const forms = adaptFormList(response.data.forms);
        setAvailableForms(forms);
        addAlert('success', 'Lista de formularios cargada');
      } else {
        throw new Error('No se recibieron datos válidos de la lista de formularios');
      }
    } catch (err: unknown) {
      console.error('Error al cargar los formularios:', err);
      
      let errorMessage = 'Error desconocido al cargar los formularios';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        errorMessage = errorObj.response?.data?.message || errorMessage;
      }
      
      setError(errorMessage);
      addAlert('error', `Error al cargar los formularios: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [addAlert]);

  // Función para obtener los datos de un formulario específico
  const fetchFormData = useCallback(async () => {
    if (!formId) {
      loadAvailableForms();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = `http://localhost:3000/api/forms/getForms/${formId}`;
      console.log(`Fetching form data from: ${endpoint}`);
      
      const response = await axios.get(endpoint);
      console.log('Response received:', response.data);
      
      if (response.data?.success && response.data.form) {
        const formData = {
          success: true,
          program: response.data.form.program || 'Sin nombre',
          fechaCreacion: response.data.form.date || new Date().toISOString(),
          sections: response.data.form.sections || []
          // Eliminado el campo configuration con umbrales
        };
        
        setFormData(formData);
        
        // Adaptar los datos al nuevo formato para FormEvaluation
        const adaptedFormData = adaptFormData(formData);
        console.log('Adapted data for FormEvaluation:', adaptedFormData);
        setAdaptedData(adaptedFormData);
        
        addAlert('success', 'Formulario cargado correctamente');
      } else {
        throw new Error(response.data?.message || 'No se recibieron datos válidos del formulario');
      }
    } catch (err: unknown) {
      console.error('Error al cargar el formulario:', err);
      
      let errorMessage = 'Error desconocido al cargar el formulario';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        }
      }
      
      setError(errorMessage);
      addAlert('error', `Error al cargar el formulario: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [formId, addAlert, loadAvailableForms]);

  useEffect(() => {
    console.log("FormId recibido:", formId);
    if (formId) {
      fetchFormData();
    } else {
      loadAvailableForms();
    }
  }, [formId, fetchFormData, loadAvailableForms]);

  // Función para exportar a PDF (implementación futura)
  const exportToPDF = () => {
    addAlert('info', 'Exportando a PDF...');
    // Aquí iría la implementación para generar el PDF
  };

  // Función para compartir el informe (implementación futura)
  const shareReport = () => {
    addAlert('info', 'Compartiendo informe...');
    // Aquí iría la implementación para compartir
  };

  if (loading) {
    return <LoadingState />;
  }

  // Si no hay formId, mostrar la lista de formularios disponibles
  if (!formId) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Formularios Disponibles</h1>
        <FormList forms={availableForms} />
      </div>
    );
  }

  // Si hay error o no hay datos, mostrar mensaje de error
  if (error || !formData || !adaptedData) {
    return <ErrorState error={error} onRetry={fetchFormData} />;
  }

  // Si hay datos, mostrar el reporte completo
  return (
    <FormDetail
      formData={adaptedData}
      date={formData.fechaCreacion}
      onRefresh={fetchFormData}
      onExportPDF={exportToPDF}
      onShare={shareReport}
    />
  );
};

export default ReportContainer;