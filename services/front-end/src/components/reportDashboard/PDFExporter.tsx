import React, { useState } from 'react';
import { FileDown } from 'lucide-react';
import { useAlerts } from '../alert/AlertContext';
import { Document, Page, Text, View, StyleSheet, Font, Circle, Svg, Path, pdf } from '@react-pdf/renderer';

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
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

interface TemplateConfig {
  title: string;
  borderColor: string;
  badgeColor: string;
  textColor: string;
  description: string;
  footer: string;
  gradientStart: string;
  gradientEnd: string;
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

// Configuraciones para las diferentes plantillas - Versión mejorada
const templateConfigs: Record<'good' | 'regular' | 'bad', TemplateConfig> = {
  good: {
    title: 'RESULTADO SATISFACTORIO',
    borderColor: '#22c55e',
    badgeColor: '#dcfce7',
    textColor: '#15803d',
    description: 'La evaluación muestra un alto nivel de conformidad con los estándares requeridos.',
    footer: '¡Felicitaciones! Mantenga las buenas prácticas implementadas.',
    gradientStart: '#dcfce7',
    gradientEnd: '#ffffff'
  },
  regular: {
    title: 'RESULTADO ACEPTABLE',
    borderColor: '#eab308',
    badgeColor: '#fef9c3',
    textColor: '#a16207',
    description: 'La evaluación muestra un nivel aceptable de conformidad, pero con áreas de mejora identificadas.',
    footer: 'Se recomienda implementar acciones correctivas para las áreas deficientes.',
    gradientStart: '#fef9c3',
    gradientEnd: '#ffffff'
  },
  bad: {
    title: 'RESULTADO NO SATISFACTORIO',
    borderColor: '#ef4444', 
    badgeColor: '#fee2e2',
    textColor: '#b91c1c',
    description: 'La evaluación muestra un nivel bajo de conformidad que requiere atención inmediata.',
    footer: 'Se requiere un plan de acción correctiva urgente para abordar las deficiencias encontradas.',
    gradientStart: '#fee2e2',
    gradientEnd: '#ffffff'
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

// También registramos una fuente más moderna
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459Wlhzg.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_dJE3gnD-w.ttf', fontWeight: 'bold' },
    { src: 'https://fonts.gstatic.com/s/montserrat/v15/JTUPjIg1_i6t8kCHKm459WxZcgvz-PZ1.ttf', fontStyle: 'italic' }
  ]
});

// Estilos para el PDF - Versión mejorada
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
  },
  header: {
    padding: 30,
    paddingBottom: 10,
  },
  coverGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Montserrat',
    marginBottom: 5,
    color: '#555555',
    textAlign: 'center',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    marginBottom: 5,
    color: '#666666',
    textAlign: 'center',
  },
  idText: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#888888',
    textAlign: 'center',
  },
  circleContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  circleText: {
    position: 'absolute',
    fontSize: 28,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
  },
  percentSymbol: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    padding: 8,
    width: '70%',
    alignSelf: 'center',
    borderRadius: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    textAlign: 'center',
    marginHorizontal: 60,
    marginVertical: 15,
    color: '#555555',
    lineHeight: 1.5,
  },
  footer: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
    textAlign: 'center',
    marginHorizontal: 60,
    marginVertical: 15,
    padding: 10,
    borderRadius: 4,
  },
  generationDate: {
    position: 'absolute',
    bottom: 30,
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
    margin: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  tableHeaderText: {
    fontSize: 11,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  tableRow: {
    flexDirection: 'row',
    marginVertical: 4,
    padding: 8,
    borderRadius: 4,
  },
  tableRowEven: {
    backgroundColor: '#f8f9fa',
  },
  tableCellSection: {
    flex: 3,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333333'
  },
  tableCellPercentage: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 5,
  },
  interpretationHeader: {
    marginTop: 30,
    padding: 10,
    borderRadius: 4,
  },
  interpretationTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  interpretationRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  interpretationPercentage: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    width: 80,
    fontWeight: 'bold',
  },
  interpretationValue: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#333333'
  },
  // Estilos para la página de detalles
  detailPage: {
    padding: 30,
  },
  detailHeader: {
    marginBottom: 20,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
    color: '#333333',
    paddingBottom: 5, 
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
  },
  sectionPercentage: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginBottom: 10,
    alignItems: 'center',
  },
  sectionBadge: {
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 9,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  question: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#6b7280',
    borderLeftStyle: 'solid',
  },
  questionText: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  responseContainer: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'center',
  },
  responseLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    width: 75,
    color: '#555555',
  },
  responseValue: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    backgroundColor: '#f1f5f9',
    padding: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  observationText: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
    color: '#666666',
    marginLeft: 75,
    marginTop: 3,
  },
  logoContainer: {
    position: 'absolute',
    top: 30,
    width: '100%',
    alignItems: 'center',
  },
  watermark: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    opacity: 0.07,
    transform: 'rotate(-45deg)',
  },
  watermarkText: {
    fontSize: 60,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  divider: {
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    marginVertical: 15,
  }
});

// Componente de logo para el PDF
const AuditLogo = () => (
  <View style={styles.logoContainer}>
    <Svg height="40" width="40">
      <Circle cx="20" cy="20" r="18" fill="#4f46e5" />
      <Circle cx="20" cy="20" r="12" fill="#ffffff" />
      <Circle cx="20" cy="20" r="6" fill="#4f46e5" />
    </Svg>
  </View>
);

// Componente de marca de agua para el PDF
const Watermark = ({ text }: { text: string }) => (
  <View style={styles.watermark}>
    <Text style={[styles.watermarkText, { color: '#e5e7eb' }]}>{text}</Text>
  </View>
);

// Componente de PDF para la portada mejorada
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
      {/* Fondo con gradiente */}
      <Svg height="300" width="595" style={styles.coverGradient}>
        <Path
          d="M0,0 L595,0 L595,300 C495,250 395,280 295,240 C195,200 95,240 0,200 L0,0 Z"
          fill={templateConfig.gradientStart}
        />
      </Svg>
      
      {/* Logo */}
      <AuditLogo />
      
      {/* Marca de agua */}
      <Watermark text="AUDITORIA" />
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>INFORME DE AUDITORÍA</Text>
        <Text style={styles.subtitle}>{auditData.program || 'Auditoría'}</Text>
        <Text style={styles.date}>{dateText}</Text>
        <Text style={styles.idText}>ID: {auditData.id}</Text>
      </View>
      
      <View style={styles.circleContainer}>
        <Svg height="100" width="100">
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke={templateConfig.borderColor}
            strokeWidth={5}
            fill="white"
          />
          <Circle
            cx="50"
            cy="50"
            r="38"
            fill={templateConfig.badgeColor}
          />
        </Svg>
        <Text style={[styles.circleText, { color: templateConfig.textColor, top: 37 }]}>
          {percentage}<Text style={styles.percentSymbol}>%</Text>
        </Text>
      </View>
      
      <Text style={[
        styles.categoryTitle, 
        { 
          backgroundColor: templateConfig.badgeColor,
          color: templateConfig.textColor,
          borderWidth: 1,
          borderColor: templateConfig.borderColor
        }
      ]}>
        {templateConfig.title}
      </Text>
      
      <Text style={styles.description}>{templateConfig.description}</Text>
      
      <Text style={[
        styles.footer, 
        { 
          color: templateConfig.textColor,
          backgroundColor: templateConfig.badgeColor,
          borderWidth: 1,
          borderColor: templateConfig.borderColor
        }
      ]}>
        {templateConfig.footer}
      </Text>
      
      <Text style={styles.generationDate}>Informe generado el {generationDate}</Text>
    </Page>
  );
};

// Componente para la página de detalles - versión mejorada
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

  // Función para obtener el color de fondo según la respuesta
  const getResponseBgColor = (response: string): string => {
    const normalized = response.toLowerCase();
    if (normalized === 'yes' || normalized === 'si' || normalized === 'sí') return '#dcfce7'; // verde claro
    if (normalized === 'partial') return '#fef9c3'; // amarillo claro
    if (normalized === 'no') return '#fee2e2'; // rojo claro
    return '#f1f5f9'; // gris claro para N/A
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
                {auditData.createdAt && ` - Fecha: ${new Date(auditData.createdAt.seconds * 1000).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}`}
              </Text>
            </View>
          )}
          
          {/* Marca de agua */}
          <Watermark text="CONFIDENCIAL" />
          
          {/* Título de sección */}
          <View>
            <Text style={styles.sectionTitle}>{section.title || sectionId}</Text>
            <View style={styles.sectionPercentage}>
              <Text style={[
                styles.sectionBadge, 
                { 
                  backgroundColor: getResponseBgColor(
                    getCategory(section.completionPercentage || 0) === 'good' ? 'yes' : 
                    getCategory(section.completionPercentage || 0) === 'regular' ? 'partial' : 'no'
                  ),
                  color: getCategoryColor(getCategory(section.completionPercentage || 0))
                }
              ]}>
                Cumplimiento: {section.completionPercentage || 0}%
              </Text>
            </View>
          </View>
          
          {/* Preguntas de la sección */}
          {Object.entries(section.questions).map(([questionId, question]) => {
            const responseColor = getResponseColor(question.response);
            
            return (
              <View 
                style={[
                  styles.question, 
                  { borderLeftColor: responseColor }
                ]} 
                key={questionId}
              >
                <Text style={styles.questionText}>{question.text}</Text>
                
                <View style={styles.responseContainer}>
                  <Text style={styles.responseLabel}>Respuesta:</Text>
                  <Text style={[
                    styles.responseValue, 
                    { 
                      color: responseColor,
                      backgroundColor: getResponseBgColor(question.response)
                    }
                  ]}>
                    {formatResponse(question.response)}
                  </Text>
                </View>
                
                {question.observations && (
                  <Text style={styles.observationText}>{question.observations}</Text>
                )}
              </View>
            );
          })}
        </Page>
      ))}
    </>
  );
};

// Componente para la página de resumen de secciones - versión mejorada
const SummaryPage = ({ auditData }: { auditData: AuditData }) => {
  const sectionEntries = Object.entries(auditData.sections);
  const percentage = auditData.completionPercentage || 0;
  const category = getCategory(percentage);
  const templateConfig = templateConfigs[category];
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={[styles.header, { borderBottomWidth: 2, borderBottomColor: templateConfig.borderColor, borderBottomStyle: 'solid' }]}>
        <Text style={styles.title}>RESUMEN POR SECCIONES</Text>
        <Text style={styles.idText}>
          {auditData.program} - Cumplimiento general: {percentage}%
        </Text>
      </View>
      
      {/* Marca de agua */}
      <Watermark text="RESUMEN" />
      
      <View style={styles.contentContainer}>
        {/* Encabezado de tabla */}
        <View style={[styles.tableHeader, { backgroundColor: '#4f46e5' }]}>
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
              <Text style={[
                styles.tableCellPercentage,
                styles.responseValue,
                { 
                  color,
                  backgroundColor: templateConfigs[sectionCategory].badgeColor,
                  textAlign: 'center',
                  width: 'auto'
                }
              ]}>
                {percentage.toFixed(1)}%
              </Text>
            </View>
          );
        })}
        
        <View style={styles.divider} />
        
        {/* Interpretación de resultados */}
        <View style={[styles.interpretationHeader, { backgroundColor: '#4f46e5' }]}>
          <Text style={styles.interpretationTitle}>Interpretación de resultados</Text>
        </View>
        
        <View style={[styles.interpretationRow, { backgroundColor: '#f8f9fa', padding: 8, borderRadius: 4 }]}>
          <Text style={[styles.interpretationPercentage, { color: '#22c55e' }]}>≥ 80%:</Text>
          <Text style={styles.interpretationValue}>Bueno - Cumplimiento satisfactorio</Text>
        </View>
        
        <View style={[styles.interpretationRow, { padding: 8, borderRadius: 4 }]}>
          <Text style={[styles.interpretationPercentage, { color: '#eab308' }]}>50% - 79.9%:</Text>
          <Text style={styles.interpretationValue}>Regular - Requiere mejoras</Text>
        </View>
        
        <View style={[styles.interpretationRow, { backgroundColor: '#f8f9fa', padding: 8, borderRadius: 4 }]}>
          <Text style={[styles.interpretationPercentage, { color: '#ef4444' }]}>{'< 50%'}:</Text>
          <Text style={styles.interpretationValue}>Malo - Requiere atención inmediata</Text>
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
      
      {/* Resumen de secciones */}
      <SummaryPage auditData={auditData} />
      
      {/* Detalles - versión nativa en React PDF */}
      <DetailPage auditData={auditData} />
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
      className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center transition-colors text-sm shadow-md"
      style={{ opacity: exporting ? 0.7 : 1, cursor: exporting ? 'not-allowed' : 'pointer' }}
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