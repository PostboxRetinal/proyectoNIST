import React, { useMemo } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import BarReport from '../reportDashboard/BarReport';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Actualizar interfaces para reflejar la estructura real de los datos
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

interface FormData {
  program: string;
  config: {
    nistThresholds: {
      lowRisk: number;
      mediumRisk: number;
    }
  };
  sections: Section[];
}

interface FormEvaluationProps {
  formData: FormData;
}

interface SectionResult {
  sectionId: string;
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
    if (!formData || !formData.sections) return [];

    return formData.sections.map((section: Section) => {
      // Acumular valores y contar preguntas respondidas
      let totalValue = 0;
      let totalQuestions = 0;

      // Recorrer todas las subsecciones de la sección
      section.subsections.forEach((subsection: Subsection) => {
        // Recorrer todas las preguntas de la subsección
        subsection.questions.forEach((question: Question) => {
          // Solo procesar preguntas que han sido respondidas
          if (question.response && question.response !== "na") {
            // Obtener valor numérico según la respuesta
            let valorRespuesta = 0;
            
            switch (question.response) {
              case "yes":
                valorRespuesta = 5; // Valor máximo para "Sí"
                break;
              case "partial":
                valorRespuesta = 3; // Valor medio para "Parcialmente"
                break;
              case "no":
                valorRespuesta = 1; // Valor bajo para "No"
                break;
              default:
                valorRespuesta = 0; // Valor por defecto
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
      
      // Utilizar los umbrales de configuración del formulario
      const lowRiskThreshold = formData.config?.nistThresholds?.lowRisk || 80;
      const mediumRiskThreshold = formData.config?.nistThresholds?.mediumRisk || 50;
      
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
        sectionId: section.section,
        sectionTitle: section.title,
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
    
    // Utilizar los umbrales de configuración del formulario
    const lowRiskThreshold = formData.config?.nistThresholds?.lowRisk || 80;
    const mediumRiskThreshold = formData.config?.nistThresholds?.mediumRisk || 50;
    
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
  }, [sectionResults, formData.config]);

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
            <span>≥ {formData.config?.nistThresholds?.lowRisk || 80}%: <strong>Bueno</strong></span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span>
              {formData.config?.nistThresholds?.mediumRisk || 50}% - {(formData.config?.nistThresholds?.lowRisk || 80) - 0.1}%: <strong>Regular</strong>
            </span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span>
              {`< ${formData.config?.nistThresholds?.mediumRisk || 50}%`}: <strong>Malo</strong>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FormEvaluation;