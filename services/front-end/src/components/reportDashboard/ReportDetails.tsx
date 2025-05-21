import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {RefreshCw, StepBack } from "lucide-react";
import axios from "axios";
import { useAlerts } from "../alert/AlertContext";
import FormEvaluation from "../formEvaluation/FormEvaluation";
import { adaptFormData, FormDataNew } from "./adapters";
import PdfExporter from "./PDFExporter";

// Configuración para desarrollo
const API_BASE_URL = "http://localhost:3000/api";



// Definir interfaces para evitar el uso de 'any'
interface Question {
  text: string;
  response: string;
  observations: string;
  evidence_url: string;
}

interface Section {
  questions: Record<string, Question>;
  completionPercentage?: number; // Puede no estar definido inicialmente
}

// Definir una interfaz para la fecha de Firestore
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

interface AuditData {
  id: string;
  program: string;
  auditDate?: FirestoreTimestamp;
  createdAt?: FirestoreTimestamp;
  completionPercentage?: number; // Puede estar o no en la respuesta
  sections: Record<string, Section>;
}

// Extender la interfaz para incluir el tipo de los elementos del array en localStorage
interface StoredAudit extends AuditData {
  // Propiedades adicionales que pueden tener las auditorías almacenadas en localStorage
  success?: boolean;
}

// Definir la interfaz que necesitamos para adaptFormData
interface FormResponseSection {
  section?: string;
  id?: string;
  title: string;
  subsections: Array<{
    subsection?: string;
    id?: string;
    title: string;
    questions: Array<{
      id: string;
      text: string;
      options?: Array<{
        value: string;
        label: string;
        description?: string;
      }>;
      response?: string;
      observations?: string;
      evidence_url?: string;
    }>;
  }>;
}

interface FormResponse {
  id?: string;
  program: string;
  sections: FormResponseSection[];
}


// Función para calcular porcentajes reales basados en las respuestas
const calculatePercentage = (questions: Record<string, Question>): number => {
  if (!questions) return 0;
  
  let totalScore = 0;
  const totalQuestions = Object.keys(questions).length;
  
  if (totalQuestions === 0) return 0;
  
  // Recorrer todas las preguntas y calcular puntuación
  for (const questionId in questions) {
    // Asegurarse de que existe la propiedad response y convertirla a minúsculas
    const response = questions[questionId]?.response?.toLowerCase() || "";
    
    // Asignar puntaje según la respuesta
    if (response === "sí" || response === "si" || response === "yes") {
      totalScore += 100;
    } else if (response === "parcial" || response === "partial") {
      totalScore += 50;
    } else if (response === "no") {
      totalScore += 0;
    } else if (response === "na" || response === "n/a") {
      // No aplicable no afecta la puntuación
      totalScore += 100; 
    } else {
      console.warn(`Respuesta no reconocida: "${response}" para pregunta ${questionId}`);
      totalScore += 0; // Por defecto, no cumple
    }
  }
  
  return Math.round(totalScore / totalQuestions);
};

// Función auxiliar para convertir AuditData a FormResponse
const convertToFormResponse = (audit: AuditData): FormResponse => {
  
  // Convertir el formato de secciones de record a array
  const sectionsArray = Object.entries(audit.sections || {}).map(([sectionId, sectionData]) => {
    // Convertir las preguntas de cada sección
    const subsections = [{
      subsection: "1", // valor por defecto
      id: "1", // valor por defecto
      title: sectionId,
      questions: Object.entries(sectionData.questions || {}).map(([questionId, questionData]) => {
        // Agregar opciones basadas en la respuesta actual
        const options = [
          { value: "yes", label: "Sí", description: "Cumple totalmente" },
          { value: "partial", label: "Parcial", description: "Cumple parcialmente" },
          { value: "no", label: "No", description: "No cumple" },
          { value: "na", label: "N/A", description: "No aplicable" }
        ];
        
        // Normalizar la respuesta - asegurar que siempre haya una respuesta
        let normalizedResponse = (questionData.response || "").toLowerCase();
        if (normalizedResponse === "sí" || normalizedResponse === "si" || normalizedResponse === "yes") {
          normalizedResponse = "yes";
        } else if (normalizedResponse === "parcial" || normalizedResponse === "partial") {
          normalizedResponse = "partial";
        } else if (normalizedResponse === "n/a" || normalizedResponse === "na") {
          normalizedResponse = "na";
        } else if (normalizedResponse === "no") {
          normalizedResponse = "no";
        } else {
          console.warn(`Respuesta no reconocida: "${normalizedResponse}" para pregunta ${questionId}`);
          normalizedResponse = "no"; // Valor por defecto
        }
        
        return {
          id: questionId,
          text: questionData.text || `Pregunta ${questionId}`,
          options: options,
          response: normalizedResponse,
          observations: questionData.observations || "",
          evidence_url: questionData.evidence_url || ""
        };
      })
    }];

    return {
      section: sectionId,
      id: sectionId,
      title: sectionId,
      subsections: subsections
    };
  });

  return {
    id: audit.id,
    program: audit.program,
    sections: sectionsArray
  };
};

// Función para determinar el color según el porcentaje
const getColorForPercentage = (percentage: number): string => {
  if (percentage >= 80) {
    return "rgb(34, 197, 94)"; // Verde
  } else if (percentage >= 50) {
    return "rgb(234, 179, 8)"; // Amarillo
  } else {
    return "rgb(239, 68, 68)"; // Rojo
  }
};

// Definir interfaz para los datos crudos recibidos de la API
interface RawAuditData {
  id?: string;
  program?: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  sections?: Record<string, {
    questions?: Record<string, {
      text: string;
      response: string;
      observations: string;
      evidence_url: string;
    }>;
    completionPercentage?: number;
  }>;
  // Otros campos posibles que puedan venir en la respuesta
  [key: string]: unknown;
}

// Función para procesar y normalizar los datos de la auditoría recibidos de la API
const processAuditData = (rawData: RawAuditData): AuditData => {
    // Asegurarnos de tener una estructura base adecuada
  const processedData: AuditData = {
    id: rawData.id || '',
    program: rawData.program || 'Auditoría sin nombre',
    completionPercentage: typeof rawData.completionPercentage === 'number' ? rawData.completionPercentage : 0,
    sections: {}
  };
  // Preservar datos de fecha
  if (rawData.createdAt && typeof rawData.createdAt === 'object' &&
      'seconds' in rawData.createdAt && 'nanoseconds' in rawData.createdAt) {
    processedData.createdAt = {
      seconds: Number(rawData.createdAt.seconds),
      nanoseconds: Number(rawData.createdAt.nanoseconds)
    };
  }
  
  if (rawData.auditDate && typeof rawData.auditDate === 'object' &&
      'seconds' in rawData.auditDate && 'nanoseconds' in rawData.auditDate) {
    processedData.auditDate = {
      seconds: Number(rawData.auditDate.seconds),
      nanoseconds: Number(rawData.auditDate.nanoseconds)
    };
  }

  // Procesar secciones y preguntas si existen
  if (rawData.sections) {
    // Asumiendo que rawData.sections es un objeto con keys de secciones
    processedData.sections = { ...rawData.sections } as Record<string, Section>;
    
    // Si no hay porcentaje de completitud calculada, calcularla
    for (const sectionId in processedData.sections) {
      // Usar el valor existente o calcularlo si no existe
      if (processedData.sections[sectionId].completionPercentage === undefined) {
        processedData.sections[sectionId].completionPercentage = 
          calculatePercentage(processedData.sections[sectionId].questions);
      }
    }
    
  // Usar el porcentaje general existente o calcularlo si no existe
    if (!rawData.completionPercentage) {
      let totalScore = 0;
      const sectionCount = Object.keys(processedData.sections).length;
      
      for (const sectionId in processedData.sections) {
        totalScore += processedData.sections[sectionId].completionPercentage || 0;
      }
      
      if (sectionCount > 0) {
        processedData.completionPercentage = Math.round(totalScore / sectionCount);
      }
    }
  }
  
  return processedData;
};

// Componente para mostrar las gráficas y detalles del reporte
export default function ReportDetails() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [adaptedData, setAdaptedData] = useState<FormDataNew | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addAlert } = useAlerts();
  
  const reportContentRef = useRef<HTMLDivElement>(null);

  const dataFetchedRef = useRef(false);

 

  // Función para cargar datos
  const loadData = async (forceRefresh = false) => {
    // Si ya se cargaron datos y no se solicita una actualización forzada, salir
    if (dataFetchedRef.current && !forceRefresh) {
      return;
    }
    
    // Validar ID
    if (!id) {
      setError("ID de auditoría no proporcionado");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      let resultData: AuditData;
         
          try {
            // Intentar ruta alternativa
            const altResponse = await axios.get(`${API_BASE_URL}/forms/getForms/${id}`);
            
            
            // Procesar datos de la ruta alternativa
            if (altResponse.data.success && altResponse.data.audit) {
              resultData = processAuditData(altResponse.data.audit);
            } else {
              resultData = processAuditData(altResponse.data);
            }
            
            addAlert('success', 'Datos cargados correctamente (ruta alternativa)');
            
          } catch (secondError) {
            console.error("Error al cargar datos desde la API alternativa:", secondError);
            
            // Buscar en localStorage como último recurso
            const storedAudits = localStorage.getItem('audits');
            if (!storedAudits) {
              throw new Error('No se pudieron obtener datos: La auditoría no existe o no está disponible');
            }
            
            const audits = JSON.parse(storedAudits) as StoredAudit[];
            const storedAudit = audits.find(a => a.id === id);
            if (!storedAudit) {
              throw new Error('No se encontró la auditoría solicitada');
            }
            
            addAlert('warning', 'Usando datos almacenados localmente');
            resultData = storedAudit;
          }
    
      
      // Procesar y actualizar estados con los datos obtenidos
      setAuditData(resultData);
      
      // Preparar datos para el gráfico
      const chartLabels: string[] = [];
      const chartValues: number[] = [];
      const chartColors: string[] = [];
        Object.entries(resultData.sections).forEach(([sectionId, section]) => {
        chartLabels.push(sectionId);
        const percentage = section.completionPercentage || 0;
        chartValues.push(percentage);
        chartColors.push(getColorForPercentage(percentage));
      });
      
 
      
      // Convertir formato para componente FormEvaluation
      const formResponseData = convertToFormResponse(resultData);
      const formattedData = adaptFormData(formResponseData);
      setAdaptedData(formattedData);
      
      setError(null);
      dataFetchedRef.current = true;
      
    } catch (err) {
      console.error("Error al cargar los datos:", err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      addAlert('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Funciones de acciones
  const refreshData = () => {
    addAlert('info', 'Actualizando datos...');
    dataFetchedRef.current = false; // Resetear el estado para forzar recarga
    loadData(true); // Forzar recarga
  };
  
  

  // Efecto para cargar los datos al montar el componente - solo se ejecuta una vez
  useEffect(() => {
    if (!dataFetchedRef.current) {
      loadData();
    }
    
    // Cleanup function para reiniciar el ref cuando se desmonte
    return () => {
      dataFetchedRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); 

return (
  <div className="p-6 max-w-6xl mx-auto">
    
    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    )}
    
    {loading ? (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando detalles del reporte...</p>
      </div>
    ) : auditData ? (
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Contenedor principal que agrupa todo el contenido */}
        <div className="space-y-6" ref={reportContentRef}>
          {/* Cabecera con información básica de la auditoría */}
          <div className="border-b pb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{auditData.program || 'Auditoría'}</h2>
                <p className="text-gray-600 mt-1">
                  ID: {auditData.id}
                </p>
                <p className="text-gray-600">
                  Fecha: {auditData.createdAt ? 
                    new Date(auditData.createdAt.seconds * 1000).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Fecha no disponible'
                  }
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-gray-700">Progreso general:</span>
                <span className="font-semibold text-lg">{auditData.completionPercentage || 0}%</span>
                <div className="w-32 bg-gray-200 rounded-full h-2.5 mt-1">
                  <div 
                    className="h-2.5 rounded-full"
                    style={{ 
                      width: `${auditData.completionPercentage || 0}%`,
                      backgroundColor: getColorForPercentage(auditData.completionPercentage || 0)
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex gap-2 mt-4">
              {auditData && <PdfExporter auditData={auditData} contentRef={reportContentRef} />}
              <button
                onClick={refreshData}
                className="bg-blue-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar datos
              </button>
            <Link 
              to="/reportdashboard"
              className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
            >
                <StepBack className="h-4 w-4 mr-2" />
                Volver a la lista de auditorías
            </Link>
            </div>
          </div>
          
          {/* Leyenda de interpretación */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Interpretación de resultados:</h4>
                    <ul className="space-y-2">
                    <li className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                        <span>≥ 80%: <strong>Bueno</strong></span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                        <span>
                        50% - 79.9%: <strong>Regular</strong>
                        </span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                        <span>
                        &lt; 50%: <strong>Malo</strong>
                        </span>
                    </li>
                    </ul>
                </div>
        
          {/* Componente de evaluación con gráficos completo */}
          {adaptedData && (
            <div className="border-t pt-6">
              <FormEvaluation formData={adaptedData} />
            </div>
          )}
          
        </div>
      </div>
    ) : (
      <div className="text-center py-10">
        <p className="text-gray-500">No se encontraron datos para esta auditoría</p>
      </div>
    )}
  </div>
);
}

