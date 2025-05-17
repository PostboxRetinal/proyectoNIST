import React, { useState, useEffect } from 'react';
import FormEvaluation from '../formEvaluation/FormEvaluation';

// Datos de muestra con formato actualizado
const sampleFormData = {
  "program": "Programa de Auditoría para NIST 800-30 (Ciclo PDCA)",
  "configuracion": {
    "umbrales": {
      "riesgoBajo": 80,
      "riesgoMedio": 50
    }
  },
  "secciones": [
    {
      "id": "1",
      "titulo": "PLANIFICAR (PLAN)",
      "subSecciones": [
        {
          "id": "1.1",
          "titulo": "Risk Framing",
          "preguntas": [
            {
              "id": "1.1.1",
              "texto": "¿Existe una estrategia de gestión de riesgos documentada que incluya roles y responsabilidades?",
              "tipo": "si_no",
              "opciones": ["Sí", "No", "Parcialmente", "No aplica"],
              "descripciones": [
                "Estrategia documentada y aprobada", 
                "Sin estrategia documentada", 
                "Estrategia en desarrollo o incompleta", 
                "No aplica a este contexto"
              ],
              "respuesta": "Sí",
              "observaciones": "Se verificó la existencia del documento en el repositorio de políticas corporativas.",
              "evidencia_url": "https://ejemplo.com/politicas/gestion_riesgos.pdf",
              "esObligatoria": true
            },
            {
              "id": "1.1.2",
              "texto": "¿Se han definido y aprobado formalmente los niveles de tolerancia al riesgo?",
              "tipo": "si_no",
              "opciones": ["Sí", "No", "Parcialmente", "No aplica"],
              "descripciones": [
                "Niveles definidos y aprobados formalmente", 
                "Sin niveles definidos", 
                "Niveles definidos pero sin aprobación formal", 
                "No aplica a este contexto"
              ],
              "respuesta": "Parcialmente",
              "observaciones": "Existen niveles de tolerancia definidos en documentos internos pero pendientes de aprobación por el comité de seguridad.",
              "evidencia_url": "https://ejemplo.com/documentos/niveles_tolerancia_draft.docx",
              "esObligatoria": true
            },
            {
              "id": "1.1.3",
              "texto": "¿Está documentado un plan de comunicación de riesgos para stakeholders internos y externos?",
              "tipo": "si_no",
              "opciones": ["Sí", "No", "Parcialmente", "No aplica"],
              "descripciones": [
                "Plan documentado e implementado", 
                "Sin plan de comunicación", 
                "Plan documentado pero no implementado completamente", 
                "No aplica a este contexto"
              ],
              "respuesta": "No",
              "observaciones": "No se ha desarrollado aún un plan formal de comunicación de riesgos para los interesados.",
              "evidencia_url": "",
              "esObligatoria": true
            },
            {
              "id": "1.1.4",
              "texto": "¿Se han identificado todos los activos críticos y se les ha asignado un valor o criticidad para el negocio?",
              "tipo": "si_no",
              "opciones": ["Sí", "No", "Parcialmente", "No aplica"],
              "descripciones": [
                "Activos identificados y valorados", 
                "Sin identificación de activos", 
                "Identificación incompleta o sin valoración", 
                "No aplica a este contexto"
              ],
              "respuesta": "Parcialmente",
              "observaciones": "Se ha realizado un inventario parcial de activos pero sin asignación sistemática de criticidad.",
              "evidencia_url": "https://ejemplo.com/inventario/activos_tecnologicos.xlsx",
              "esObligatoria": true
            },
            {
              "id": "1.1.5",
              "texto": "¿Se ha establecido un calendario de revisiones al marco de riesgos?",
              "tipo": "si_no",
              "opciones": ["Sí", "No", "Parcialmente", "No aplica"],
              "descripciones": [
                "Calendario formal establecido", 
                "Sin revisiones programadas", 
                "Revisiones ad-hoc o sin programación", 
                "No aplica a este contexto"
              ],
              "respuesta": "Parcialmente",
              "observaciones": "Existen revisiones pero no siguen un calendario establecido formalmente.",
              "evidencia_url": "https://ejemplo.com/revisiones/ultima_revision_riesgos.pdf",
              "esObligatoria": true
            },
            {
              "id": "1.1.6",
              "texto": "¿La organización ha definido un proceso formal para identificar restricciones, suposiciones y preocupaciones que afectan el riesgo?",
              "tipo": "si_no",
              "opciones": ["Sí", "No", "Parcialmente", "No aplica"],
              "descripciones": [
                "Proceso formal definido", 
                "Sin proceso definido", 
                "Proceso informal o incompleto", 
                "No aplica a este contexto"
              ],
              "respuesta": "No",
              "observaciones": "No existe un proceso formal documentado para este fin.",
              "evidencia_url": "",
              "esObligatoria": true
            }
          ]
        },
        {
          "id": "1.2",
          "titulo": "Risk Assessment",
          "preguntas": [
            {
              "id": "1.2.1",
              "texto": "¿Se categorizan los orígenes de amenaza (adversarial, accidental, ambiental)?",
              "tipo": "si_no",
              "opciones": ["Sí", "No", "Parcialmente", "No aplica"],
              "descripciones": [
                "Categorización formal y completa", 
                "Sin categorización", 
                "Categorización parcial o informal", 
                "No aplica a este contexto"
              ],
              "respuesta": "Sí",
              "observaciones": "Las amenazas se categorizan según el estándar NIST SP 800-30 en el registro de amenazas.",
              "evidencia_url": "https://ejemplo.com/registro_amenazas.pdf",
              "esObligatoria": true
            },
            {
              "id": "1.2.2",
              "texto": "¿Se emplean herramientas de escaneo y pruebas de penetración para identificar vulnerabilidades?",
              "tipo": "si_no",
              "opciones": ["Sí", "No", "Parcialmente", "No aplica"],
              "descripciones": [
                "Uso regular y programado", 
                "No se utilizan herramientas", 
                "Uso ocasional o limitado", 
                "No aplica a este contexto"
              ],
              "respuesta": "Sí",
              "observaciones": "Se realizan escaneos trimestrales con Nessus y pruebas de penetración anuales con un proveedor externo.",
              "evidencia_url": "https://ejemplo.com/informes/ultimo_pentest_2024.pdf",
              "esObligatoria": true
            },
            {
              "id": "1.2.3",
              "texto": "¿Se utilizan escalas definidas de probabilidad e impacto al evaluar cada riesgo?",
              "tipo": "si_no",
              "opciones": ["Sí", "No", "Parcialmente", "No aplica"],
              "descripciones": [
                "Escalas formales definidas y aplicadas consistentemente", 
                "Sin escalas definidas", 
                "Escalas definidas pero aplicación inconsistente", 
                "No aplica a este contexto"
              ],
              "respuesta": "Parcialmente",
              "observaciones": "Existen escalas definidas pero su aplicación varía entre departamentos.",
              "evidencia_url": "https://ejemplo.com/metodologia/escalas_riesgo.docx",
              "esObligatoria": true
            }
          ]
        }
      ]
    },
    {
      "id": "2",
      "titulo": "HACER (DO)",
      "subSecciones": [
        {
          "id": "2.3",
          "titulo": "Risk Response",
          "preguntas": [
            {
              "id": "2.3.1",
              "texto": "¿Se evalúan opciones de tratamiento para cada riesgo (mitigar, transferir, aceptar, evitar)?",
              "tipo": "si_no",
              "opciones": ["Sí", "No", "Parcialmente", "No aplica"],
              "descripciones": [
                "Evaluación formal documentada", 
                "Sin evaluación sistemática", 
                "Evaluación inconsistente o no documentada", 
                "No aplica a este contexto"
              ],
              "respuesta": "Sí",
              "observaciones": "Cada riesgo identificado tiene un plan de tratamiento documentado en el registro de riesgos.",
              "evidencia_url": "https://ejemplo.com/tratamiento_riesgos.xlsx",
              "esObligatoria": true
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
  secciones: sampleFormData.secciones.map(seccion => ({
    ...seccion,
    subSecciones: seccion.subSecciones.map(subseccion => ({
      ...subseccion,
      preguntas: subseccion.preguntas.map(pregunta => {
        // Crear una copia profunda para evitar modificar el original
        const preguntaCopia = {...pregunta};
        
        if (preguntaCopia.tipo === "numerica") {
          // Para preguntas numéricas
          preguntaCopia.respuesta = "1"; // Valor bajo
        } else {
          // Para preguntas tipo si/no
          preguntaCopia.respuesta = "No";
        }
        
        return preguntaCopia;
      })
    }))
  }))
};

const mediumScoreFormData = {
  ...sampleFormData,
  program: "NIST - Escenario de Puntuación Media",
  secciones: sampleFormData.secciones.map(seccion => ({
    ...seccion,
    subSecciones: seccion.subSecciones.map(subseccion => ({
      ...subseccion,
      preguntas: subseccion.preguntas.map(pregunta => {
        // Crear una copia profunda para evitar modificar el original
        const preguntaCopia = {...pregunta};
        
        if (preguntaCopia.tipo === "numerica") {
          // Para preguntas numéricas
          preguntaCopia.respuesta = "3"; // Valor medio
        } else {
          // Para preguntas tipo si/no
          preguntaCopia.respuesta = "Parcialmente";
        }
        
        return preguntaCopia;
      })
    }))
  }))
};

const ReportVisualizationTest: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<string>("default");
  const [customThresholds, setCustomThresholds] = useState({
    riesgoBajo: 80,
    riesgoMedio: 50
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
          configuracion: {
            umbrales: customThresholds
          }
        };
      case "medium":
        return {
          ...mediumScoreFormData,
          configuracion: {
            umbrales: customThresholds
          }
        };
      default:
        return {
          ...sampleFormData,
          configuracion: {
            umbrales: customThresholds
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
                  value={customThresholds.riesgoBajo}
                  onChange={(e) => setCustomThresholds({
                    ...customThresholds,
                    riesgoBajo: Number(e.target.value)
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
                  value={customThresholds.riesgoMedio}
                  onChange={(e) => setCustomThresholds({
                    ...customThresholds,
                    riesgoMedio: Number(e.target.value)
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
        ) : formDataForDisplay && formDataForDisplay.secciones ? (
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