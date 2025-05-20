import React, { useState, useEffect } from 'react';
import FormEvaluation from '../formEvaluation/FormEvaluation';

// Datos de muestra con formato actualizado para ser compatible con CreateAuditForm
const sampleFormData = {
  "program": "Programa de Auditoría para NIST 800-30 (Ciclo PDCA)",
  "config": {  // Cambiado de "configuracion" a "config"
    "nistThresholds": {  // Cambiado de "umbrales" a "nistThresholds"
      "lowRisk": 80,     // Cambiado de "riesgoBajo" a "lowRisk"
      "mediumRisk": 50   // Cambiado de "riesgoMedio" a "mediumRisk"
    }
  },
  "sections": [  // Cambiado de "secciones" a "sections"
    {
      "section": "1",  // Cambiado de "id" a "section"
      "title": "PLANIFICAR (PLAN)",  // Cambiado de "titulo" a "title"
      "subsections": [  // Cambiado de "subSecciones" a "subsections"
        {
          "subsection": "1.1",  // Cambiado de "id" a "subsection"
          "title": "Risk Framing",  // Cambiado de "titulo" a "title"
          "questions": [  // Cambiado de "preguntas" a "questions"
            {
              "id": "1.1.1",
              "text": "¿Existe una estrategia de gestión de riesgos documentada que incluya roles y responsabilidades?",  // "texto" a "text"
              "options": [  // Nueva estructura options que incluye value, label y description
                { 
                  "value": "yes", 
                  "label": "Sí", 
                  "description": "Estrategia documentada y aprobada" 
                },
                { 
                  "value": "no", 
                  "label": "No", 
                  "description": "Sin estrategia documentada" 
                },
                { 
                  "value": "partial", 
                  "label": "Parcialmente", 
                  "description": "Estrategia en desarrollo o incompleta" 
                },
                { 
                  "value": "na", 
                  "label": "No aplica", 
                  "description": "No aplica a este contexto" 
                }
              ],
              "response": "yes",  // Cambiado de "respuesta" a "response" y "Sí" a "yes"
              "observations": "Se verificó la existencia del documento en el repositorio de políticas corporativas.",  // "observaciones" a "observations"
              "evidence_url": "https://ejemplo.com/politicas/gestion_riesgos.pdf"  // "evidencia_url" a "evidence_url"
            },
            {
              "id": "1.1.2",
              "text": "¿Se han definido y aprobado formalmente los niveles de tolerancia al riesgo?",
              "options": [
                { "value": "yes", "label": "Sí", "description": "Niveles definidos y aprobados formalmente" },
                { "value": "no", "label": "No", "description": "Sin niveles definidos" },
                { "value": "partial", "label": "Parcialmente", "description": "Niveles definidos pero sin aprobación formal" },
                { "value": "na", "label": "No aplica", "description": "No aplica a este contexto" }
              ],
              "response": "partial",
              "observations": "Existen niveles de tolerancia definidos en documentos internos pero pendientes de aprobación por el comité de seguridad.",
              "evidence_url": "https://ejemplo.com/documentos/niveles_tolerancia_draft.docx"
            },
            {
              "id": "1.1.3",
              "text": "¿Está documentado un plan de comunicación de riesgos para stakeholders internos y externos?",
              "options": [
                { "value": "yes", "label": "Sí", "description": "Plan documentado e implementado" },
                { "value": "no", "label": "No", "description": "Sin plan de comunicación" },
                { "value": "partial", "label": "Parcialmente", "description": "Plan documentado pero no implementado completamente" },
                { "value": "na", "label": "No aplica", "description": "No aplica a este contexto" }
              ],
              "response": "no",
              "observations": "No se ha desarrollado aún un plan formal de comunicación de riesgos para los interesados.",
              "evidence_url": ""
            },
            {
              "id": "1.1.4",
              "text": "¿Se han identificado todos los activos críticos y se les ha asignado un valor o criticidad para el negocio?",
              "options": [
                { "value": "yes", "label": "Sí", "description": "Activos identificados y valorados" },
                { "value": "no", "label": "No", "description": "Sin identificación de activos" },
                { "value": "partial", "label": "Parcialmente", "description": "Identificación incompleta o sin valoración" },
                { "value": "na", "label": "No aplica", "description": "No aplica a este contexto" }
              ],
              "response": "partial",
              "observations": "Se ha realizado un inventario parcial de activos pero sin asignación sistemática de criticidad.",
              "evidence_url": "https://ejemplo.com/inventario/activos_tecnologicos.xlsx"
            },
            {
              "id": "1.1.5",
              "text": "¿Se ha establecido un calendario de revisiones al marco de riesgos?",
              "options": [
                { "value": "yes", "label": "Sí", "description": "Calendario formal establecido" },
                { "value": "no", "label": "No", "description": "Sin revisiones programadas" },
                { "value": "partial", "label": "Parcialmente", "description": "Revisiones ad-hoc o sin programación" },
                { "value": "na", "label": "No aplica", "description": "No aplica a este contexto" }
              ],
              "response": "partial",
              "observations": "Existen revisiones pero no siguen un calendario establecido formalmente.",
              "evidence_url": "https://ejemplo.com/revisiones/ultima_revision_riesgos.pdf"
            },
            {
              "id": "1.1.6",
              "text": "¿La organización ha definido un proceso formal para identificar restricciones, suposiciones y preocupaciones que afectan el riesgo?",
              "options": [
                { "value": "yes", "label": "Sí", "description": "Proceso formal definido" },
                { "value": "no", "label": "No", "description": "Sin proceso definido" },
                { "value": "partial", "label": "Parcialmente", "description": "Proceso informal o incompleto" },
                { "value": "na", "label": "No aplica", "description": "No aplica a este contexto" }
              ],
              "response": "no",
              "observations": "No existe un proceso formal documentado para este fin.",
              "evidence_url": ""
            }
          ]
        },
        {
          "subsection": "1.2",
          "title": "Risk Assessment",
          "questions": [
            {
              "id": "1.2.1",
              "text": "¿Se categorizan los orígenes de amenaza (adversarial, accidental, ambiental)?",
              "options": [
                { "value": "yes", "label": "Sí", "description": "Categorización formal y completa" },
                { "value": "no", "label": "No", "description": "Sin categorización" },
                { "value": "partial", "label": "Parcialmente", "description": "Categorización parcial o informal" },
                { "value": "na", "label": "No aplica", "description": "No aplica a este contexto" }
              ],
              "response": "yes",
              "observations": "Las amenazas se categorizan según el estándar NIST SP 800-30 en el registro de amenazas.",
              "evidence_url": "https://ejemplo.com/registro_amenazas.pdf"
            },
            {
              "id": "1.2.2",
              "text": "¿Se emplean herramientas de escaneo y pruebas de penetración para identificar vulnerabilidades?",
              "options": [
                { "value": "yes", "label": "Sí", "description": "Uso regular y programado" },
                { "value": "no", "label": "No", "description": "No se utilizan herramientas" },
                { "value": "partial", "label": "Parcialmente", "description": "Uso ocasional o limitado" },
                { "value": "na", "label": "No aplica", "description": "No aplica a este contexto" }
              ],
              "response": "yes",
              "observations": "Se realizan escaneos trimestrales con Nessus y pruebas de penetración anuales con un proveedor externo.",
              "evidence_url": "https://ejemplo.com/informes/ultimo_pentest_2024.pdf"
            },
            {
              "id": "1.2.3",
              "text": "¿Se utilizan escalas definidas de probabilidad e impacto al evaluar cada riesgo?",
              "options": [
                { "value": "yes", "label": "Sí", "description": "Escalas formales definidas y aplicadas consistentemente" },
                { "value": "no", "label": "No", "description": "Sin escalas definidas" },
                { "value": "partial", "label": "Parcialmente", "description": "Escalas definidas pero aplicación inconsistente" },
                { "value": "na", "label": "No aplica", "description": "No aplica a este contexto" }
              ],
              "response": "partial",
              "observations": "Existen escalas definidas pero su aplicación varía entre departamentos.",
              "evidence_url": "https://ejemplo.com/metodologia/escalas_riesgo.docx"
            }
          ]
        }
      ]
    },
    {
      "section": "2",
      "title": "HACER (DO)",
      "subsections": [
        {
          "subsection": "2.3",
          "title": "Risk Response",
          "questions": [
            {
              "id": "2.3.1",
              "text": "¿Se evalúan opciones de tratamiento para cada riesgo (mitigar, transferir, aceptar, evitar)?",
              "options": [
                { "value": "yes", "label": "Sí", "description": "Evaluación formal documentada" },
                { "value": "no", "label": "No", "description": "Sin evaluación sistemática" },
                { "value": "partial", "label": "Parcialmente", "description": "Evaluación inconsistente o no documentada" },
                { "value": "na", "label": "No aplica", "description": "No aplica a este contexto" }
              ],
              "response": "yes",
              "observations": "Cada riesgo identificado tiene un plan de tratamiento documentado en el registro de riesgos.",
              "evidence_url": "https://ejemplo.com/tratamiento_riesgos.xlsx"
            }
          ]
        }
      ]
    }
  ]
};

// Variantes de datos con formato actualizado
const lowScoreFormData = {
  ...sampleFormData,
  program: "NIST - Escenario de Puntuación Baja",
  sections: sampleFormData.sections.map(section => ({
    ...section,
    subsections: section.subsections.map(subsection => ({
      ...subsection,
      questions: subsection.questions.map(question => {
        return {
          ...question,
          response: "no"  // Cambiamos todas las respuestas a "no" para una puntuación baja
        };
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
        return {
          ...question,
          response: "partial"  // Cambiamos todas las respuestas a "partial" para puntuación media
        };
      })
    }))
  }))
};

const ReportVisualizationTest: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<string>("default");
  const [customThresholds, setCustomThresholds] = useState({
    lowRisk: 80,        // Cambiado de "riesgoBajo" a "lowRisk"
    mediumRisk: 50      // Cambiado de "riesgoMedio" a "mediumRisk"
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
          config: {        // Cambiado de "configuracion" a "config"
            nistThresholds: customThresholds  // Cambiado a nueva estructura
          }
        };
      case "medium":
        return {
          ...mediumScoreFormData,
          config: {        // Cambiado de "configuracion" a "config"
            nistThresholds: customThresholds  // Cambiado a nueva estructura
          }
        };
      default:
        return {
          ...sampleFormData,
          config: {        // Cambiado de "configuracion" a "config"
            nistThresholds: customThresholds  // Cambiado a nueva estructura
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
            <h2 className="text-lg font-semibold mb-2">Seleccionar escenario de prueba</h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="testScenario"
                  value="default"
                  checked={selectedTest === "default"}
                  onChange={() => setSelectedTest("default")}
                  className="mr-2"
                />
                <span>Escenario predeterminado (mixto)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="testScenario"
                  value="low"
                  checked={selectedTest === "low"}
                  onChange={() => setSelectedTest("low")}
                  className="mr-2"
                />
                <span>Escenario de puntuación baja</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="testScenario"
                  value="medium"
                  checked={selectedTest === "medium"}
                  onChange={() => setSelectedTest("medium")}
                  className="mr-2"
                />
                <span>Escenario de puntuación media</span>
              </label>
            </div>
          </div>
          
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