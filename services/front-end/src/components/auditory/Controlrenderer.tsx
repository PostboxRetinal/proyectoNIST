import React, { useState, useEffect } from 'react';
import { useAlerts } from '../alert/AlertContext';

interface ControlRendererProps {
  section: any;
  sectionId: string;
  onSave: (responses: any) => void;
  metadata?: any;
}

const ControlRenderer: React.FC<ControlRendererProps> = ({ section, sectionId, onSave, metadata }) => {
  const { addAlert } = useAlerts();
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  
  useEffect(() => {
    // Inicializar el estado de las respuestas con los valores actuales de la sección
    const initialResponses: Record<string, any> = {};
    
    if (section && section.questions) {
      Object.entries(section.questions).forEach(([questionId, question]: [string, any]) => {
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
  const handleSave = () => {
    const updatedSection = {
      ...section,
      questions: Object.entries(section.questions).reduce((acc: Record<string, any>, [questionId, question]: [string, any]) => {
        acc[questionId] = {
          ...question,
          ...responses[questionId]
        };
        return acc;
      }, {})
    };
    
    onSave({
      sectionId,
      updatedSection
    });
    
    setIsFormDirty(false);
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
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sección {sectionId}</h1>
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
      </div>
      
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
        {sortedQuestionEntries.map(([questionId, question]: [string, any]) => (
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
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`response_${questionId}`}
                      value={option}
                      checked={responses[questionId]?.response === option}
                      onChange={() => handleResponseChange(questionId, 'response', option)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">
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
              <textarea
                value={responses[questionId]?.observations || ''}
                onChange={(e) => handleResponseChange(questionId, 'observations', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            
            {/* URL de evidencia */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                URL de evidencia:
              </label>
              <input
                type="text"
                value={responses[questionId]?.evidence_url || ''}
                onChange={(e) => handleResponseChange(questionId, 'evidence_url', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="https://ejemplo.com/evidencia.pdf"
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Botón flotante para guardar */}
      {isFormDirty && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h1v5.586l-1.293-1.293z" />
            </svg>
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default ControlRenderer;