import React, { useState } from 'react';
import { FileDown } from 'lucide-react';
import { useAlerts } from '../alert/AlertContext';
import { Document, Page, Text, View, StyleSheet, Font, Circle, Svg, Line, pdf } from '@react-pdf/renderer';

// Tipos
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

interface Question {
  text: string;
  response: string;
  observations: string;
  evidence_url: string;
}

interface Section {
  title?: string;
  questions: Record<string, Question>;
  completionPercentage?: number;
}

interface AuditData {
  id: string;
  program: string;
  auditDate?: FirestoreTimestamp;
  createdAt?: FirestoreTimestamp;
  completionPercentage?: number;
  sections: Record<string, Section>;
}

interface PdfExporterProps {
  auditData: AuditData;
  contentRef?: React.RefObject<HTMLDivElement | null>; // Hacemos contentRef opcional ya que no lo usaremos
}

interface TemplateConfig {
  title: string;
  borderColor: string;
  badgeColor: string;
  textColor: string;
  description: string;
  footer: string;
}

// Función para determinar la categoría según el porcentaje
const getCategory = (percentage: number): 'good' | 'regular' | 'bad' => {
  if (percentage >= 80) return 'good';
  if (percentage >= 50) return 'regular';
  return 'bad';
};

// Función para obtener el color según la categoría
const getCategoryColor = (category: 'good' | 'regular' | 'bad'): string => {
  switch (category) {
    case 'good': return '#22c55e'; // verde
    case 'regular': return '#eab308'; // amarillo
    case 'bad': return '#ef4444'; // rojo
    default: return '#6b7280'; // gris
  }
};

// Configuraciones para las diferentes plantillas
const templateConfigs: Record<'good' | 'regular' | 'bad', TemplateConfig> = {
  good: {
    title: 'RESULTADO SATISFACTORIO',
    borderColor: '#22c55e',
    badgeColor: '#dcfce7',
    textColor: '#15803d',
    description: 'La evaluación muestra un alto nivel de conformidad con los estándares requeridos.',
    footer: '¡Felicitaciones! Mantenga las buenas prácticas implementadas.'
  },
  regular: {
    title: 'RESULTADO ACEPTABLE',
    borderColor: '#eab308',
    badgeColor: '#fef9c3',
    textColor: '#a16207',
    description: 'La evaluación muestra un nivel aceptable de conformidad, pero con áreas de mejora identificadas.',
    footer: 'Se recomienda implementar acciones correctivas para las áreas deficientes.'
  },
  bad: {
    title: 'RESULTADO NO SATISFACTORIO',
    borderColor: '#ef4444', 
    badgeColor: '#fee2e2',
    textColor: '#b91c1c',
    description: 'La evaluación muestra un nivel bajo de conformidad que requiere atención inmediata.',
    footer: 'Se requiere un plan de acción correctiva urgente para abordar las deficiencias encontradas.'
  }
};

// Registrar fuente para el PDF
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf', fontWeight: 'normal' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica-bold@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica-oblique@1.0.4/Helvetica-Oblique.ttf', fontStyle: 'italic' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica-boldoblique@1.0.4/Helvetica-BoldOblique.ttf', fontWeight: 'bold', fontStyle: 'italic' }
  ]
});

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
  },
  header: {
    height: 10,
    marginBottom: 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3C3C3C'
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    marginBottom: 5,
    color: '#3C3C3C'
  },
  date: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    marginBottom: 5,
    color: '#3C3C3C'
  },
  idText: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#3C3C3C'
  },
  circleContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  circleText: {
    position: 'absolute',
    fontSize: 24,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    textAlign: 'center',
    marginHorizontal: 30,
    marginVertical: 15,
    color: '#505050'
  },
  footer: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
    textAlign: 'center',
    marginHorizontal: 30,
    marginVertical: 15,
  },
  generationDate: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    fontSize: 8,
    fontFamily: 'Helvetica',
    textAlign: 'center',
    color: '#969696'
  },
  sectionHeader: {
    marginTop: 15,
    alignItems: 'center',
  },
  contentContainer: {
    margin: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    padding: 5,
    marginBottom: 10,
  },
  tableHeaderText: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#3C3C3C'
  },
  tableRow: {
    flexDirection: 'row',
    marginVertical: 3,
    padding: 3,
  },
  tableRowEven: {
    backgroundColor: '#FAFAFA',
  },
  tableCellSection: {
    flex: 3,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#3C3C3C'
  },
  tableCellPercentage: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Helvetica',
    textAlign: 'right',
    paddingRight: 5,
  },
  interpretationHeader: {
    marginTop: 20,
    backgroundColor: '#F0F0F0',
    padding: 5,
  },
  interpretationTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#3C3C3C'
  },
  interpretationRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  interpretationPercentage: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    width: 70,
  },
  interpretationValue: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#3C3C3C'
  },
  // Estilos para la página de detalles
  detailPage: {
    padding: 30,
  },
  detailHeader: {
    marginBottom: 15,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 15,
    color: '#3C3C3C',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 3,
  },
  question: {
    marginBottom: 8,
    padding: 5,
  },
  questionText: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  responseContainer: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  responseLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    width: 70,
  },
  responseValue: {
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  observationText: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
    color: '#666666',
  }
});

// Componente de PDF para la portada
const CoverPage = ({ auditData }: { auditData: AuditData }) => {
  const percentage = auditData.completionPercentage || 0;
  const category = getCategory(percentage);
  const templateConfig = templateConfigs[category];
  const generationDate = new Date().toLocaleString('es-ES');
  
  let dateText = 'Fecha: No disponible';
  if (auditData.createdAt) {
    const date = new Date(auditData.createdAt.seconds * 1000).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    dateText = `Fecha: ${date}`;
  }
  
  return (
    <Page size="A4" style={styles.page}>
      {/* Barra superior de color */}
      <Svg height="10" width="595">
        <Line
          x1="0"
          y1="5" 
          x2="595" 
          y2="5"
          strokeWidth={10}
          stroke={templateConfig.borderColor}
        />
      </Svg>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>INFORME DE AUDITORÍA</Text>
        <Text style={styles.subtitle}>{auditData.program || 'Auditoría'}</Text>
        <Text style={styles.date}>{dateText}</Text>
        <Text style={styles.idText}>ID: {auditData.id}</Text>
      </View>
      
      <View style={styles.circleContainer}>
        <Svg height="60" width="60">
          <Circle
            cx="30"
            cy="30"
            r="30"
            stroke={templateConfig.borderColor}
            strokeWidth={2}
          />
          <Circle
            cx="30"
            cy="30"
            r="29"
            fill={templateConfig.badgeColor}
          />
        </Svg>
        <Text style={[styles.circleText, { color: templateConfig.textColor }]}>
          {percentage.toFixed(2)}%
        </Text>
      </View>
      
      <Text style={[styles.categoryTitle, { color: templateConfig.textColor }]}>
        {templateConfig.title}
      </Text>
      
      <Text style={styles.description}>{templateConfig.description}</Text>
      
      <Text style={[styles.footer, { color: templateConfig.textColor }]}>
        {templateConfig.footer}
      </Text>
      
      <Text style={styles.generationDate}>Informe generado el {generationDate}</Text>
    </Page>
  );
};

// Componente para la página de detalles - en lugar de una imagen, haremos una versión nativa de React PDF
const DetailPage = ({ auditData }: { auditData: AuditData }) => {
  // Función para formatear las respuestas
  const formatResponse = (response: string): string => {
    const normalized = response.toLowerCase();
    if (normalized === 'yes' || normalized === 'si' || normalized === 'sí') return 'Sí';
    if (normalized === 'no') return 'No';
    if (normalized === 'partial') return 'Parcial';
    if (normalized === 'na' || normalized === 'n/a') return 'N/A';
    return response; // Si no coincide con ninguno, devolver el original
  };

  // Función para obtener el color según la respuesta
  const getResponseColor = (response: string): string => {
    const normalized = response.toLowerCase();
    if (normalized === 'yes' || normalized === 'si' || normalized === 'sí') return '#22c55e'; // verde
    if (normalized === 'partial') return '#eab308'; // amarillo
    if (normalized === 'no') return '#ef4444'; // rojo
    return '#6b7280'; // gris para N/A
  };

  return (
    <>
      {/* Podemos necesitar múltiples páginas dependiendo de la cantidad de secciones y preguntas */}
      {Object.entries(auditData.sections).map(([sectionId, section], idx) => (
        <Page size="A4" style={[styles.page, styles.detailPage]} key={sectionId}>
          {/* Mostrar encabezado solo en la primera página de detalles */}
          {idx === 0 && (
            <View style={styles.detailHeader}>
              <Text style={styles.title}>DETALLE DE LA EVALUACIÓN</Text>
              <Text style={styles.idText}>
                {auditData.program} (ID: {auditData.id})
                {auditData.createdAt && ` - Fecha: ${new Date(auditData.createdAt.seconds * 1000).toLocaleDateString()}`}
              </Text>
            </View>
          )}
          
          {/* Título de sección */}
          <View>
            <Text style={styles.sectionTitle}>{section.title || sectionId}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5 }}>
              <Text style={[styles.idText, { color: getCategoryColor(getCategory(section.completionPercentage || 0)) }]}>
                Porcentaje de cumplimiento: {(section.completionPercentage || 0).toFixed(2)}%
              </Text>
            </View>
          </View>
          
          {/* Preguntas de la sección */}
          {Object.entries(section.questions).map(([questionId, question]) => (
            <View style={styles.question} key={questionId}>
              <Text style={styles.questionText}>{question.text}</Text>
              
              <View style={styles.responseContainer}>
                <Text style={styles.responseLabel}>Respuesta:</Text>
                <Text style={[styles.responseValue, { color: getResponseColor(question.response) }]}>
                  {formatResponse(question.response)}
                </Text>
              </View>
              
              {question.observations && (
                <View style={styles.responseContainer}>
                  <Text style={styles.responseLabel}>Observaciones:</Text>
                  <Text style={styles.observationText}>{question.observations}</Text>
                </View>
              )}
            </View>
          ))}
        </Page>
      ))}
    </>
  );
};

// Componente para la página de resumen de secciones
const SummaryPage = ({ auditData }: { auditData: AuditData }) => {
  const sectionEntries = Object.entries(auditData.sections);
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>RESUMEN POR SECCIONES</Text>
      </View>
      
      <View style={styles.contentContainer}>
        {/* Encabezado de tabla */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 3 }]}>Sección</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Cumplimiento</Text>
        </View>
        
        {/* Filas de tabla */}
        {sectionEntries.map(([sectionId, section], index) => {
          const percentage = section.completionPercentage || 0;
          const sectionCategory = getCategory(percentage);
          const color = getCategoryColor(sectionCategory);
          
          return (
            <View 
              key={sectionId}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.tableRowEven : {}
              ]}
            >
              <Text style={styles.tableCellSection}>
                {section.title || sectionId}
              </Text>
              <Text style={[styles.tableCellPercentage, { color }]}>
                {percentage.toFixed(2)}%
              </Text>
            </View>
          );
        })}
        
        {/* Interpretación de resultados */}
        <View style={[styles.interpretationHeader, { marginTop: 20 }]}>
          <Text style={styles.interpretationTitle}>Interpretación de resultados</Text>
        </View>
        
        <View style={styles.interpretationRow}>
          <Text style={[styles.interpretationPercentage, { color: '#22c55e' }]}>≥ 80%:</Text>
          <Text style={styles.interpretationValue}>Bueno</Text>
        </View>
        
        <View style={styles.interpretationRow}>
          <Text style={[styles.interpretationPercentage, { color: '#eab308' }]}>50% - 79.9%:</Text>
          <Text style={styles.interpretationValue}>Regular</Text>
        </View>
        
        <View style={styles.interpretationRow}>
          <Text style={[styles.interpretationPercentage, { color: '#ef4444' }]}>{'< 50%'}:</Text>
          <Text style={styles.interpretationValue}>Malo</Text>
        </View>
      </View>
    </Page>
  );
};

// Componente para el documento PDF completo
const AuditPDF = ({ auditData }: { auditData: AuditData }) => {
  return (
    <Document>
      {/* Portada */}
      <CoverPage auditData={auditData} />
      
      {/* Detalles - versión nativa en React PDF */}
      <DetailPage auditData={auditData} />
      
      {/* Resumen de secciones */}
      <SummaryPage auditData={auditData} />
    </Document>
  );
};

const PdfExporter: React.FC<PdfExporterProps> = ({ auditData }) => {
  const [exporting, setExporting] = useState(false);
  const { addAlert } = useAlerts();
  
  const exportToPDF = async () => {
    if (!auditData) return;
    
    try {
      setExporting(true);
      addAlert('info', 'Generando PDF, por favor espere...');
      
      // Crear el documento PDF - ya no usamos html2canvas, solo React PDF
      const pdfInstance = pdf(<AuditPDF auditData={auditData} />);
      
      // Guardar el archivo
      const fileName = `Auditoria_${auditData.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      const blob = await pdfInstance.toBlob();
      
      // Crear un enlace de descarga y hacer clic en él
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      
      // Limpieza
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
      
      addAlert('success', `PDF generado correctamente como "${fileName}"`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      
      let errorMessage = 'Error desconocido al generar el PDF.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      addAlert('error', `Error al generar el PDF: ${errorMessage}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={exportToPDF}
      disabled={exporting}
      className={`
        bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg 
        flex items-center transition-colors text-sm
        ${exporting ? 'opacity-70 cursor-not-allowed' : ''}
      `}
    >
      {exporting ? (
        <>
          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
          Exportando...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4 mr-2" />
          Exportar a PDF
        </>
      )}
    </button>
  );
};

export default PdfExporter;