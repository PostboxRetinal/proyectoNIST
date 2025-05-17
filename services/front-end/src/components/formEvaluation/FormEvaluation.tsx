import React, { useMemo } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import BarReport from '../reportDashboard/BarReport';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Actualizar interfaces para reflejar la estructura real de los datos
interface Pregunta {
  id: string | number;
  texto: string;
  tipo: "si_no" | "numerica";
  opciones: string[];
  descripciones?: string[];
  respuesta?: string;
  observaciones?: string;
  evidencia_url?: string;
  esObligatoria: boolean;
}

interface SubSeccion {
  id: string | number;
  titulo: string;
  preguntas: Pregunta[];
}

interface Seccion {
  id: string | number;
  titulo: string;
  subSecciones: SubSeccion[];
}

interface FormularioData {
  program: string;
  configuracion?: {
    umbrales?: {
      riesgoBajo: number;
      riesgoMedio: number;
    }
  };
  secciones: Seccion[];
}

interface FormEvaluationProps {
  formData: FormularioData;
}

interface SectionResult {
  sectionId: string | number;
  sectionTitle: string;
  score: number;
  interpretation: string;
  color: string;
}

interface FinalResult {
  score: number;
  interpretation: string;
  color: string;
}

interface ChartDataResult {
  labels: string[];
  data: number[];
  colors: string[];
}

const FormEvaluation: React.FC<FormEvaluationProps> = ({ formData }) => {
  const sectionResults = useMemo<SectionResult[]>(() => {
    if (!formData || !formData.secciones) return [];

    return formData.secciones.map((seccion: Seccion) => {
      // Acumular valores y contar preguntas respondidas
      let totalValue = 0;
      let totalQuestions = 0;

      // Recorrer todas las subsecciones de la sección
      seccion.subSecciones.forEach((subseccion: SubSeccion) => {
        // Recorrer todas las preguntas de la subsección
        subseccion.preguntas.forEach((pregunta: Pregunta) => {
          // Solo procesar preguntas que han sido respondidas
          if (pregunta.respuesta && pregunta.respuesta !== "No aplica") {
            // Obtener valor numérico según el tipo de pregunta
            let valorRespuesta = 0;
            
            if (pregunta.tipo === "si_no") {
              // Mapear respuestas de tipo sí/no a valores numéricos
              switch (pregunta.respuesta) {
                case "Sí":
                  valorRespuesta = 5; // Valor máximo
                  break;
                case "Parcialmente":
                  valorRespuesta = 3; // Valor medio
                  break;
                case "No":
                  valorRespuesta = 1; // Valor bajo
                  break;
                default:
                  valorRespuesta = 0; // No aplica o sin respuesta
              }
            } else if (pregunta.tipo === "numerica") {
              // Convertir la respuesta a valor numérico
              valorRespuesta = parseInt(pregunta.respuesta, 10);
            }
            
            if (valorRespuesta > 0) {
              totalValue += valorRespuesta;
              totalQuestions++;
            }
          }
        });
      });

      // Calcular el puntaje según la fórmula (convertido a porcentaje en base 5)
      const score = totalQuestions > 0 ? (totalValue / (totalQuestions * 5)) * 100 : 0;
      
      // Utilizar los umbrales de configuración del formulario si están disponibles
      const lowRiskThreshold = formData.configuracion?.umbrales?.riesgoBajo || 80;
      const mediumRiskThreshold = formData.configuracion?.umbrales?.riesgoMedio || 50;
      
      // Determinar interpretación y color basados en los rangos configurados
      let interpretation = '';
      let color = '';
      
      if (score >= lowRiskThreshold) {
        interpretation = 'Bueno';
        color = 'rgb(34, 197, 94)'; // Verde
      } else if (score >= mediumRiskThreshold) {
        interpretation = 'Regular';
        color = 'rgb(234, 179, 8)'; // Amarillo
      } else {
        interpretation = 'Malo';
        color = 'rgb(239, 68, 68)'; // Rojo
      }
      
      return {
        sectionId: seccion.id,
        sectionTitle: seccion.titulo,
        score: parseFloat(score.toFixed(2)),
        interpretation,
        color
      };
    });
  }, [formData]);

  // Calcular el resultado final
  const finalResult = useMemo<FinalResult>(() => {
    if (sectionResults.length === 0) return { score: 0, interpretation: 'No evaluado', color: 'gray' };

    const totalScore = sectionResults.reduce((sum: number, section: SectionResult) => sum + section.score, 0);
    const averageScore = totalScore / sectionResults.length;
    
    // Utilizar los umbrales de configuración del formulario si están disponibles
    const lowRiskThreshold = formData.configuracion?.umbrales?.riesgoBajo || 80;
    const mediumRiskThreshold = formData.configuracion?.umbrales?.riesgoMedio || 50;
    
    let interpretation = '';
    let color = '';
    
    if (averageScore >= lowRiskThreshold) {
      interpretation = 'Bueno';
      color = 'rgb(34, 197, 94)'; // Verde
    } else if (averageScore >= mediumRiskThreshold) {
      interpretation = 'Regular';
      color = 'rgb(234, 179, 8)'; // Amarillo
    } else {
      interpretation = 'Malo';
      color = 'rgb(239, 68, 68)'; // Rojo
    }
    
    return {
      score: parseFloat(averageScore.toFixed(2)),
      interpretation,
      color
    };
  }, [sectionResults, formData.configuracion]);

  // Preparar datos para el gráfico de barras
  const chartData = useMemo<ChartDataResult>(() => {
    return {
      labels: sectionResults.map((section: SectionResult) => section.sectionTitle),
      data: sectionResults.map((section: SectionResult) => section.score),
      colors: sectionResults.map((section: SectionResult) => section.color)
    };
  }, [sectionResults]);

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Evaluación del Formulario</h2>
      
      {/* Resultado Final */}
      <div className="mb-8 p-4 border rounded-lg text-center" style={{ borderColor: finalResult.color }}>
        <h3 className="text-xl font-semibold mb-2">Resultado Final</h3>
        <div className="flex flex-col items-center">
          <div 
            className="w-32 h-32 rounded-full flex items-center justify-center mb-4 text-white text-2xl font-bold"
            style={{ backgroundColor: finalResult.color }}
          >
            {finalResult.score}%
          </div>
          <p className="text-lg font-medium" style={{ color: finalResult.color }}>
            Interpretación: <span className="font-bold">{finalResult.interpretation}</span>
          </p>
        </div>
      </div>
      
      {/* Gráfico de Barras */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Resultados por Sección</h3>
        <div className="h-80">
          <BarReport 
            data={chartData.data}
            labels={chartData.labels}
            backgroundColor={chartData.colors}
            title="Puntuación por sección (%)"
          />
        </div>
      </div>
      
      {/* Tabla de resultados por sección */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Detalle por Sección</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Sección</th>
                <th className="py-3 px-4 text-center">Puntaje</th>
                <th className="py-3 px-4 text-center">Interpretación</th>
              </tr>
            </thead>
            <tbody>
              {sectionResults.map((section: SectionResult, index: number) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-3 px-4">{section.sectionId}</td>
                  <td className="py-3 px-4">{section.sectionTitle}</td>
                  <td className="py-3 px-4 text-center font-medium" style={{ color: section.color }}>
                    {section.score}%
                  </td>
                  <td className="py-3 px-4 text-center font-medium" style={{ color: section.color }}>
                    {section.interpretation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Leyenda de interpretación */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Interpretación de resultados:</h4>
        <ul className="space-y-2">
          <li className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span>≥ {formData.configuracion?.umbrales?.riesgoBajo || 80}%: <strong>Bueno</strong></span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span>
              {formData.configuracion?.umbrales?.riesgoMedio || 50}% - {(formData.configuracion?.umbrales?.riesgoBajo || 80) - 0.1}%: <strong>Regular</strong>
            </span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span>
              {`< ${formData.configuracion?.umbrales?.riesgoMedio || 50}%`}: <strong>Malo</strong>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FormEvaluation;