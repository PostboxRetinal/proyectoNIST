import React, { useState, useEffect } from 'react';
import { useAlerts } from '../alert/AlertContext';

interface Question {
  id: string;
  text: string;
  response: string | null;
  observations: string;
  evidence_url: string;
}

interface Section {
  questions: Record<string, Question>;
  completionPercentage?: number;
}

interface SubsectionInfo {
  id: string;
  title: string;
}

interface ResponseData {
  response: string | null;
  observations: string;
  evidence_url: string;
}

interface Metadata {
  standardName?: string;
  title?: string;
  companyName?: string;
  subsections?: Record<string, SubsectionInfo[]>;
}

interface ControlRendererProps {
  section: Section;
  sectionId: string;
  onSave: (responses: { sectionId: string; updatedSection: Section }) => Promise<void>;
  metadata?: Metadata;
  subsectionId?: string;
  readOnly?: boolean;
}

const ControlRenderer: React.FC<ControlRendererProps> = ({ section, sectionId, onSave, metadata, subsectionId, readOnly = false }) => {
  const { addAlert } = useAlerts();
  const [responses, setResponses] = useState<Record<string, ResponseData>>({});
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  
  // Determinar qué mapeo de títulos usar según el estándar
  let sectionTitles: Record<string, string> = {};
  let subsectionInfo: Record<string, SubsectionInfo[]> = {};
  
  // Verificar el estándar en los metadatos
  if (metadata?.standardName === "NIST800-30") {
    // Mapeo para NIST800-30
    sectionTitles = {
      "1": "PLANIFICAR (PLAN)",
      "2": "HACER (DO)",
      "3": "VERIFICAR (CHECK)",
      "4": "ACTUAR (ACT)"
    };
    
    subsectionInfo = {
      "1": [
        {id: "1.1", title: "Risk Framing"},
        {id: "1.2", title: "Risk Assessment"}
      ],
      "2": [
        {id: "2.1", title: "Risk Response"}
      ],
      "3": [
        {id: "3.1", title: "Risk Monitoring"}
      ],
      "4": [
        {id: "4.1", title: "Mejora continua del proceso de gestión de riesgos"}
      ]
    };
  } 
  else if (metadata?.standardName === "ISO27001") {
    // Mapeo para ISO27001
    sectionTitles = {
      "1": "PLANIFICAR (PLAN)",
      "2": "HACER (DO)",
      "3": "VERIFICAR (CHECK)",
      "4": "ACTUAR (ACT)"
    };
    
    subsectionInfo = {
      "1": [
        {id: "1.1", title: "Risk Framing"},
        {id: "1.2", title: "Risk Assessment"}
      ],
      "2": [
        {id: "2.1", title: "Risk Response"}
      ],
      "3": [
        {id: "3.1", title: "Risk Monitoring"}
      ],
      "4": [
        {id: "4.1", title: "Mejora continua del proceso de gestión de riesgos"}
      ]
    };
  }
  else {
    // Para otros estándares, usar títulos genéricos
    sectionTitles[sectionId] = `Sección ${sectionId}`;
    
    // Si hay subsecciones definidas en los metadatos, usarlas
    if (metadata?.subsections) {
      subsectionInfo = metadata.subsections;
    }
  }
  
  // Obtener el título de la subsección actual
  const getSubsectionTitle = () => {
    if (!subsectionId) return null;
    
    const subsections = subsectionInfo[sectionId];
    if (!subsections) return null;
    
    const subsection = subsections.find(sub => sub.id === subsectionId);
    return subsection ? subsection.title : null;
  };
  
  useEffect(() => {
    // Inicializar el estado de las respuestas con los valores actuales de la sección
    const initialResponses: Record<string, ResponseData> = {};
    
    if (section && section.questions) {
      Object.entries(section.questions).forEach(([questionId, question]) => {
        initialResponses[questionId] = {
          response: question.response || '',
          observations: question.observations || '',
          evidence_url: question.evidence_url || ''
        };
      });
    }
    
    setResponses(initialResponses);
    setIsFormDirty(false);
  }, [section]);
  
  // Manejar cambio en las respuestas
  const handleResponseChange = (questionId: string, field: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value
      }
    }));
    setIsFormDirty(true);
  };
  
  // Guardar cambios
  const handleSave = async () => {
    try {
      const updatedSection = {
        ...section,
        questions: Object.entries(section.questions).reduce((acc, [questionId, question]) => {
          acc[questionId] = {
            ...question,
            ...responses[questionId]
          };
          return acc;
        }, {} as Record<string, Question>)
      };
      
      await onSave({
        sectionId,
        updatedSection
      });
      
      setIsFormDirty(false);
      addAlert('success', 'Cambios guardados correctamente');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      addAlert('error', 'Error al guardar los cambios');
    }
  };
  
  // Si no hay sección o preguntas
  if (!section || !section.questions) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700">No hay preguntas disponibles en esta sección.</p>
      </div>
    );
  }
  
  // Obtener las preguntas en orden de ID
  const sortedQuestionEntries = Object.entries(section.questions)
    .sort(([idA], [idB]) => idA.localeCompare(idB, undefined, { numeric: true }));
  
  const subsectionTitle = getSubsectionTitle();
  
  return (
    <div className="max-w-4xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">
          {sectionTitles[sectionId] || `Sección ${sectionId}`}
        </h1>
        {subsectionTitle && (
          <h2 className="text-lg text-gray-600">
            {subsectionId}: {subsectionTitle}
          </h2>
        )}
      </div>
      
      {/* Solo mostrar botón si NO estamos en modo lectura */}
      {!readOnly && (
        <button
          onClick={handleSave}
          disabled={!isFormDirty}
          className={`px-4 py-2 rounded-md ${
            isFormDirty
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Guardar cambios
        </button>
      )}
    </div>
    
    {/* Mostrar mensaje de modo solo lectura cuando corresponda */}
    {readOnly && (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-blue-700">
          Modo de visualización. No se pueden realizar cambios en esta auditoría.
        </p>
      </div>
    )}
    
    {/* Mostrar el porcentaje de avance */}
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-1">
        <span>Avance de la sección</span>
        <span>{section.completionPercentage?.toFixed(2) || 0}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500" 
          style={{ width: `${section.completionPercentage || 0}%` }}
        ></div>
      </div>
    </div>
    
    {/* Preguntas */}
    <div className="space-y-6">
      {sortedQuestionEntries.map(([questionId, question]) => (
        <div key={questionId} className="p-4 bg-white rounded-lg shadow">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              {questionId}: {question.text}
            </h3>
          </div>
          
          {/* Opciones de respuesta */}
          <div className="mb-4">
            <p className="font-medium text-gray-700 mb-2">Respuesta:</p>
            <div className="flex flex-wrap gap-2">
              {['yes', 'partial', 'no', 'na'].map((option) => (
                <label key={option} className={`flex items-center space-x-2 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}>
                  <input
                    type="radio"
                    name={`response_${questionId}`}
                    value={option}
                    checked={responses[questionId]?.response === option}
                    onChange={() => !readOnly && handleResponseChange(questionId, 'response', option)}
                    className="form-radio h-4 w-4 text-blue-600"
                    disabled={readOnly}
                  />
                  <span className={`text-gray-700 ${readOnly && responses[questionId]?.response === option ? 'font-medium' : ''}`}>
                    {option === 'yes' ? 'Sí' : 
                     option === 'partial' ? 'Parcialmente' : 
                     option === 'no' ? 'No' : 
                     'No aplica'}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Observaciones */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">
              Observaciones:
            </label>
            {readOnly ? (
              <div className="p-2 border border-gray-300 rounded-md bg-gray-50 min-h-[75px]">
                {responses[questionId]?.observations || '(Sin observaciones)'}
              </div>
            ) : (
              <textarea
                value={responses[questionId]?.observations || ''}
                onChange={(e) => handleResponseChange(questionId, 'observations', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                disabled={readOnly}
              />
            )}
          </div>
          
          {/* URL de evidencia */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              URL de evidencia:
            </label>
            {readOnly ? (
              <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
                {responses[questionId]?.evidence_url ? (
                  <a 
                    href={responses[questionId]?.evidence_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {responses[questionId]?.evidence_url}
                  </a>
                ) : (
                  <span className="text-gray-500">(Sin URL de evidencia)</span>
                )}
              </div>
            ) : (
              <input
                type="text"
                value={responses[questionId]?.evidence_url || ''}
                onChange={(e) => handleResponseChange(questionId, 'evidence_url', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="https://ejemplo.com/evidencia.pdf"
                disabled={readOnly}
              />
            )}
          </div>
        </div>
      ))}
    </div>
    
    {/* Botón al final para guardar */}
    {!readOnly && (
      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={!isFormDirty}
          className={`px-4 py-2 rounded-md ${
            isFormDirty
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Guardar Cambios
        </button>
      </div>
    )}
  </div>
  );
};

export default ControlRenderer;