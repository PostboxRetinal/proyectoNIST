import React, { useState, useEffect } from 'react';
import FormEvaluation from '../formEvaluation/FormEvaluation';

// Datos de muestra con formato corregido
const sampleFormData = {
  program: "NIST Cybersecurity Framework",
  fechaCreacion: "2025-05-17T00:00:00.000Z",
  config: {
    nistThresholds: {
      lowRisk: 80,
      mediumRisk: 50
    }
  },
  sections: [
    {
      section: "1",
      title: "IDENTIFICAR (ID)",
      subsections: [
        {
          subsection: "1.1",
          title: "Gestión de Activos",
          questions: [
            {
              id: "1.1.1",
              text: "¿Se identifican y documentan los activos físicos de la organización?",
              options: [
                { value: "yes", label: "Sí" },
                { value: "no", label: "No" },
                { value: "partial", label: "Parcialmente" },
                { value: "na", label: "No aplica" }
              ],
              response: "yes",
              observations: "Todos los activos físicos están documentados en el inventario"
            },
            {
              id: "1.1.2",
              text: "Nivel de madurez en gestión de activos",
              options: [
                { value: 0.2, label: "1" },
                { value: 0.4, label: "2" },
                { value: 0.6, label: "3" },
                { value: 0.8, label: "4" },
                { value: 1.0, label: "5" }
              ],
              response: 0.8, // Valor numérico directo
              observations: "Nivel 4 de madurez"
            }
          ]
        }
      ]
    },
    {
      section: "2",
      title: "PROTEGER (PR)",
      subsections: [
        {
          subsection: "2.1",
          title: "Control de Acceso",
          questions: [
            {
              id: "2.1.1",
              text: "¿Existen procedimientos de control de acceso documentados?",
              options: [
                { value: "yes", label: "Sí" },
                { value: "no", label: "No" },
                { value: "partial", label: "Parcialmente" },
                { value: "na", label: "No aplica" }
              ],
              response: "partial",
              observations: "Existen pero no están completamente documentados"
            },
            {
              id: "2.1.2",
              text: "Nivel de madurez en control de acceso",
              options: [
                { value: 0.2, label: "1" },
                { value: 0.4, label: "2" },
                { value: 0.6, label: "3" },
                { value: 0.8, label: "4" },
                { value: 1.0, label: "5" }
              ],
              response: 0.6, // Valor numérico directo
              observations: "Nivel 3 de madurez"
            }
          ]
        }
      ]
    },
    {
      section: "3",
      title: "DETECTAR (DE)",
      subsections: [
        {
          subsection: "3.1",
          title: "Monitoreo de Seguridad",
          questions: [
            {
              id: "3.1.1",
              text: "¿Se monitorea la red para detectar posibles incidentes?",
              options: [
                { value: "yes", label: "Sí" },
                { value: "no", label: "No" },
                { value: "partial", label: "Parcialmente" },
                { value: "na", label: "No aplica" }
              ],
              response: "yes"
            },
            {
              id: "3.1.2",
              text: "Nivel de madurez en monitoreo de seguridad",
              options: [
                { value: 0.2, label: "1" },
                { value: 0.4, label: "2" },
                { value: 0.6, label: "3" },
                { value: 0.8, label: "4" },
                { value: 1.0, label: "5" }
              ],
              response: 0.4, // Valor numérico directo
              observations: "Nivel 2 de madurez"
            }
          ]
        }
      ]
    }
  ]
};

// Variantes de datos con formato corregido
const lowScoreFormData = {
  ...sampleFormData,
  program: "NIST - Escenario de Puntuación Baja",
  sections: sampleFormData.sections.map(section => ({
    ...section,
    subsections: section.subsections.map(subsection => ({
      ...subsection,
      questions: subsection.questions.map(question => {
        // Crear una copia profunda para evitar modificar el original
        const questionCopy = {...question};
        
        if (questionCopy.options && 
            questionCopy.options.length > 0 && 
            typeof questionCopy.options[0].value === 'number') {
          // Para preguntas numéricas
          questionCopy.response = 0.2;
        } else {
          // Para preguntas tipo si/no
          questionCopy.response = "no";
        }
        
        return questionCopy;
      })
    }))
  }))
};

const mediumScoreFormData = {
  ...sampleFormData,
  program: "NIST - Escenario de Puntuación Media",
  sections: sampleFormData.sections.map(section => ({
    ...section,
    subsections: section.subsections.map(subsection => ({
      ...subsection,
      questions: subsection.questions.map(question => {
        // Crear una copia profunda para evitar modificar el original
        const questionCopy = {...question};
        
        if (questionCopy.options && 
            questionCopy.options.length > 0 && 
            typeof questionCopy.options[0].value === 'number') {
          // Para preguntas numéricas
          questionCopy.response = 0.6;
        } else {
          // Para preguntas tipo si/no
          questionCopy.response = "partial";
        }
        
        return questionCopy;
      })
    }))
  }))
};

const ReportVisualizationTest: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<string>("default");
  const [customThresholds, setCustomThresholds] = useState({
    lowRisk: 80,
    mediumRisk: 50
  });
  const [formDataForDisplay, setFormDataForDisplay] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular una carga con un pequeño retraso
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      const data = getFormDataForTest();
      setFormDataForDisplay(data);
      setIsLoading(false);
      console.log("Datos preparados para la visualización:", data);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [selectedTest, customThresholds]);

  const getFormDataForTest = () => {
    switch (selectedTest) {
      case "low":
        return {
          ...lowScoreFormData,
          config: {
            nistThresholds: customThresholds
          }
        };
      case "medium":
        return {
          ...mediumScoreFormData,
          config: {
            nistThresholds: customThresholds
          }
        };
      default:
        return {
          ...sampleFormData,
          config: {
            nistThresholds: customThresholds
          }
        };
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Entorno de Pruebas de Visualización</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">

          
          <div>
            <h2 className="text-lg font-semibold mb-2">Personalizar umbrales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Umbral para riesgo bajo (Bueno) %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={customThresholds.lowRisk}
                  onChange={(e) => setCustomThresholds({
                    ...customThresholds,
                    lowRisk: Number(e.target.value)
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Umbral para riesgo medio (Regular) %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={customThresholds.mediumRisk}
                  onChange={(e) => setCustomThresholds({
                    ...customThresholds,
                    mediumRisk: Number(e.target.value)
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 border-t-2 border-gray-100">
        <h2 className="text-xl font-bold mb-4">Vista previa del reporte</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : formDataForDisplay && formDataForDisplay.sections ? (
          <FormEvaluation formData={formDataForDisplay} />
        ) : (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            <h2 className="text-lg font-medium">Error en la carga de datos</h2>
            <p>No se pudieron preparar los datos para la visualización.</p>
            <pre className="mt-4 p-3 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(formDataForDisplay, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportVisualizationTest;