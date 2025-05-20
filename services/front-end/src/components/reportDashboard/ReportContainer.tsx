import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import FormEvaluation from '../formEvaluation/FormEvaluation';
import { useAlerts } from '../alert/AlertContext';
import { Link } from 'react-router-dom';
import { RefreshCw, Home, FileDown, Share2 } from 'lucide-react';

// Interfaces actualizadas para el nuevo formato de FormEvaluation
interface Option {
  value: string;
  label: string;
  description: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  response?: string;
  observations?: string;
  evidence_url?: string;
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
}

interface FormDataNew {
  program: string;
  config: {
    nistThresholds: {
      lowRisk: number;
      mediumRisk: number;
    }
  };
  sections: Section[];
}

// Interfaces para los datos recibidos de la API
interface ApiQuestion {
  id: string | number;
  text: string;
  type: string;
  options?: Array<{value: string | number; label: string; description?: string}>;
  response?: string | number;
  observations?: string;
  evidence_url?: string;
  required?: boolean;
}

interface ApiSubsection {
  id: string | number;
  subsection?: string;
  title: string;
  questions: ApiQuestion[];
}

interface ApiSection {
  id: string | number;
  section?: string;
  title: string;
  subsections: ApiSubsection[];
}

interface FormResponse {
  success: boolean;
  message?: string;
  program: string;
  fechaCreacion: string;
  sections: ApiSection[];
  configuration?: {
    thresholds?: {
      lowRisk: number;
      mediumRisk: number;
    }
  };
}

const ReportContainer: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [adaptedData, setAdaptedData] = useState<FormDataNew | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addAlert } = useAlerts();

  // Función actualizada para transformar los datos de la API al nuevo formato
  const adaptFormData = (data: FormResponse): FormDataNew => {
    return {
      program: data.program,
      config: {
        nistThresholds: {
          lowRisk: data.configuration?.thresholds?.lowRisk || 80,
          mediumRisk: data.configuration?.thresholds?.mediumRisk || 50
        }
      },
      sections: data.sections.map(section => ({
        section: section.section?.toString() || section.id?.toString() || '',
        title: section.title,
        subsections: section.subsections.map(subsection => ({
          subsection: subsection.subsection?.toString() || subsection.id?.toString() || '',
          title: subsection.title,
          questions: subsection.questions.map(question => {
            // Convertir las opciones y valores al nuevo formato
            const options = question.options?.map(opt => ({
              value: typeof opt.value === 'number' 
                ? (opt.value >= 0.8 ? 'yes' : opt.value >= 0.5 ? 'partial' : 'no')
                : String(opt.value), 
              label: opt.label,
              description: opt.description || ''
            })) || [];

            // Normalizar la respuesta para que siempre sea "yes", "no", "partial", o "na"
            let normalizedResponse = '';
            if (question.response !== undefined) {
              if (typeof question.response === 'number') {
                if (question.response >= 0.8) normalizedResponse = 'yes';
                else if (question.response >= 0.5) normalizedResponse = 'partial';
                else normalizedResponse = 'no';
              } else {
                normalizedResponse = String(question.response).toLowerCase();
              }
            }

            return {
              id: question.id.toString(),
              text: question.text,
              options: options,
              response: normalizedResponse,
              observations: question.observations,
              evidence_url: question.evidence_url
            };
          })
        }))
      }))
    };
  };

  // Función para obtener los datos del formulario desde la API
  const fetchFormData = async () => {
    if (!formId) {
      setLoading(false);
      setError('No se proporcionó un ID de formulario');
      addAlert('warning', 'No se proporcionó un ID de formulario');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = `http://localhost:3000/api/forms/getForms/${formId}`;
      console.log(`Fetching form data from: ${endpoint}`);
      
      const response = await axios.get<FormResponse>(endpoint);
      console.log('Response received:', response);
      
      if (response.data && response.data.sections) {
        console.log('Form data received:', response.data);
        setFormData(response.data);
        
        // Adaptar los datos al nuevo formato para FormEvaluation
        const adaptedFormData = adaptFormData(response.data);
        console.log('Adapted data for FormEvaluation:', adaptedFormData);
        setAdaptedData(adaptedFormData);
        
        addAlert('success', 'Formulario cargado correctamente');
      } else {
        throw new Error('No se recibieron datos válidos del formulario');
      }
    } catch (err: any) {
      console.error('Error al cargar el formulario:', err);
      setError(err.response?.data?.message || err.message || 'Error desconocido al cargar el formulario');
      addAlert('error', `Error al cargar el formulario: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("FormId recibido:", formId);
    fetchFormData();
  }, [formId]); // Ejecutar cuando cambie formId

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
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Cargando formulario...</p>
      </div>
    );
  }

  if (error || !formData || !adaptedData) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <h2 className="text-lg font-medium">No se pudo cargar el formulario</h2>
        <p>{error || 'Verifique que el ID del formulario es correcto e intente nuevamente.'}</p>
        <div className="mt-4 flex gap-4">
          <button 
            onClick={fetchFormData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Reintentar
          </button>
          <Link 
            to="/"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Cabecera del reporte */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-2">{formData.program}</h1>
          <div className="flex gap-2">
            <button
              onClick={exportToPDF}
              className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Exportar a PDF
            </button>
            <button
              onClick={shareReport}
              className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </button>
            <button
              onClick={fetchFormData}
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar datos
            </button>
          </div>
        </div>
        <p className="text-gray-600">
          Fecha de creación: {new Date(formData.fechaCreacion).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Componente de evaluación que muestra gráficas */}
      <FormEvaluation formData={adaptedData} />

      {/* Secciones detalladas del formulario */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Detalles del Formulario</h2>
        
        {adaptedData.sections.map((section) => (
          <div key={section.section} className="mb-6 p-4 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              {section.section}: {section.title}
            </h3>
            
            {section.subsections.map((subsection) => (
              <div key={subsection.subsection} className="mb-4 pl-4 border-l-2 border-gray-200">
                <h4 className="text-lg font-medium mb-2">
                  {subsection.subsection}: {subsection.title}
                </h4>
                
                <ul className="space-y-3">
                  {subsection.questions.map((question) => {
                    // Encontrar la opción seleccionada
                    const selectedOption = question.options?.find(
                      (opt) => opt.value === question.response
                    );
                    
                    // Determinar color según la respuesta
                    let valueColor = 'text-gray-800';
                    if (question.response === 'yes') valueColor = 'text-green-600';
                    else if (question.response === 'no') valueColor = 'text-red-600';
                    else if (question.response === 'partial') valueColor = 'text-yellow-600';
                    
                    return (
                      <li key={question.id} className="p-3 bg-gray-50 rounded-md">
                        <div className="mb-1">
                          <span className="font-medium">{question.id}: </span>
                          {question.text}
                        </div>
                        <div className="flex justify-between text-sm">
                          <div>
                            <span className="text-gray-600">Respuesta: </span>
                            <span className={`font-medium ${valueColor}`}>
                              {selectedOption?.label || 'No respondido'}
                            </span>
                            {selectedOption?.description && (
                              <span className="text-gray-500 ml-2">
                                ({selectedOption.description})
                              </span>
                            )}
                          </div>
                          {question.observations && (
                            <div className="text-gray-600">
                              <span>Observaciones: </span>
                              <span>{question.observations}</span>
                            </div>
                          )}
                        </div>
                        {question.evidence_url && (
                          <div className="mt-2">
                            <a 
                              href={question.evidence_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Ver evidencia adjunta
                            </a>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Botones de navegación */}
      <div className="mt-8 flex justify-center">
        <Link 
          to="/"
          className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-2 rounded-lg text-lg flex items-center transition-colors"
        >
          <Home className="h-5 w-5 mr-2" />
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ReportContainer;