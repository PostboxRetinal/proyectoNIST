import React, { useState } from 'react';
import { FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAlerts } from '../alert/AlertContext';

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

// Fix: Update the type to accept a RefObject that might be null
interface PdfExporterProps {
  auditData: AuditData;
  contentRef: React.RefObject<HTMLDivElement | null>;
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
const templateConfigs = {
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

const PdfExporter: React.FC<PdfExporterProps> = ({ auditData, contentRef }) => {
  const [exporting, setExporting] = useState(false);
  const { addAlert } = useAlerts();

  const exportToPDF = async () => {
    // Check if contentRef and contentRef.current exist
    if (!contentRef?.current || !auditData) return;
    
    try {
      setExporting(true);
      addAlert('info', 'Generando PDF, por favor espere...');
      
      // Determinar la categoría según el porcentaje
      const percentage = auditData.completionPercentage || 0;
      const category = getCategory(percentage);
      const templateConfig = templateConfigs[category];
      
      // Configuración PDF
      const pdfWidth = 210; // A4 width en mm
      const pdfHeight = 297; // A4 height en mm
      const margins = 15; // Márgenes en mm
      
      // Crear el PDF según la plantilla
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // ------ PÁGINA DE PORTADA (según la categoría) -------
      
      // Fondo y colores según la categoría
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
      
      // Borde superior con color según la categoría
      pdf.setDrawColor(templateConfig.borderColor.replace('#', ''));
      pdf.setLineWidth(10);
      pdf.line(0, 5, pdfWidth, 5);
      
      // Título de la portada
      pdf.setFontSize(22);
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INFORME DE AUDITORÍA', pdfWidth / 2, 40, { align: 'center' });
      
      // Programa auditado
      pdf.setFontSize(16);
      pdf.text(auditData.program || 'Auditoría', pdfWidth / 2, 55, { align: 'center' });
      
      // Fecha
      let dateText = 'Fecha: No disponible';
      if (auditData.createdAt) {
        const date = new Date(auditData.createdAt.seconds * 1000).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        dateText = `Fecha: ${date}`;
      }
      
      pdf.setFontSize(12);
      pdf.text(dateText, pdfWidth / 2, 65, { align: 'center' });
      
      // ID
      pdf.setFontSize(10);
      pdf.text(`ID: ${auditData.id}`, pdfWidth / 2, 72, { align: 'center' });
      
      // Círculo con porcentaje de cumplimiento
      const circleRadius = 30;
      const circleX = pdfWidth / 2;
      const circleY = 120;
      
      // Dibujar círculo exterior
      pdf.setDrawColor(templateConfig.borderColor.replace('#', ''));
      pdf.setLineWidth(2);
      pdf.circle(circleX, circleY, circleRadius, 'S');
      
      // Dibujar círculo interior con color de fondo
      pdf.setFillColor(templateConfig.badgeColor.replace('#', ''));
      pdf.circle(circleX, circleY, circleRadius - 1, 'F');
      
      // Texto del porcentaje
      pdf.setFontSize(24);
      pdf.setTextColor(templateConfig.textColor.replace('#', ''));
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${percentage}%`, circleX, circleY + 2, { align: 'center' });
      
      // Categoría
      pdf.setFontSize(16);
      pdf.text(templateConfig.title, pdfWidth / 2, 160, { align: 'center' });
      
      // Descripción
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      pdf.setFont('helvetica', 'normal');
      
      // Dividir descripción en múltiples líneas si es necesario
      const maxWidth = 150;
      const lines = pdf.splitTextToSize(templateConfig.description, maxWidth);
      pdf.text(lines, pdfWidth / 2, 175, { align: 'center' });
      
      // Footer
      pdf.setTextColor(templateConfig.textColor.replace('#', ''));
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'italic');
      const footerLines = pdf.splitTextToSize(templateConfig.footer, maxWidth);
      pdf.text(footerLines, pdfWidth / 2, 190, { align: 'center' });
      
      // Fecha y hora de generación del informe
      const generationDate = new Date().toLocaleString('es-ES');
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Informe generado el ${generationDate}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      
      // ------- PÁGINAS ADICIONALES CON EL CONTENIDO DEL INFORME -------
      
      // Agregar nueva página para el contenido
      pdf.addPage();
      
      // Título de sección
      pdf.setFontSize(16);
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DETALLE DE LA EVALUACIÓN', pdfWidth / 2, margins, { align: 'center' });
      
      // Subtítulo con ID y fecha
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${auditData.program} (ID: ${auditData.id}) - ${dateText}`, pdfWidth / 2, margins + 7, { align: 'center' });
      
      // Capturar el contenido HTML
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Mayor resolución
        useCORS: true,
        logging: false,
        removeContainer: true,
        backgroundColor: '#ffffff'
      });
      
      // Convertir canvas a imagen
      const imgData = canvas.toDataURL('image/png');
      
      // Calcular escalado para ajustar al ancho de la página
      const imgWidth = pdfWidth - (margins * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Añadir imagen del reporte
      let currentY = margins + 20;
      
      // Si la imagen es muy alta, dividirla en varias páginas
      if (imgHeight > pdfHeight - currentY - margins) {
        const availableHeight = pdfHeight - currentY - margins;
        let remainingHeight = imgHeight;
        let srcY = 0;
        
        while (remainingHeight > 0) {
          const currentHeight = Math.min(remainingHeight, availableHeight);
          const scale = canvas.width / imgWidth;
          
          // Calculate source height in original image pixels
          const srcHeight = currentHeight * scale;
          
          // Create a temporary canvas for the slice
          const tempCanvas = document.createElement('canvas');
          const ctx = tempCanvas.getContext('2d');
          if (!ctx) {
            throw new Error('Could not create canvas context');
          }
          
          // Set dimensions for the slice
          tempCanvas.width = canvas.width;
          tempCanvas.height = srcHeight;
          
          // Draw portion of original canvas to temp canvas
          ctx.drawImage(
            canvas,        // source
            0,             // source x
            srcY,          // source y
            canvas.width,  // source width
            srcHeight,     // source height
            0,             // dest x
            0,             // dest y
            canvas.width,  // dest width
            srcHeight      // dest height
          );
          
          // Convert temp canvas to image data
          const sliceImgData = tempCanvas.toDataURL('image/png');
          
          // Add the slice to PDF
          pdf.addImage(
            sliceImgData,   // imageData
            'PNG',          // format
            margins,        // x
            currentY,       // y
            imgWidth,       // width
            currentHeight   // height
          );
          
          remainingHeight -= currentHeight;
          srcY += srcHeight;
          
          if (remainingHeight > 0) {
            // Agregar nueva página
            pdf.addPage();
            currentY = margins;
          }
        }
      } else {
        // La imagen cabe en una sola página
        pdf.addImage(imgData, 'PNG', margins, currentY, imgWidth, imgHeight);
      }
      
      // ------- PÁGINA FINAL CON RESUMEN DE SECCIONES -------
      
      pdf.addPage();
      
      // Título de resumen
      pdf.setFontSize(16);
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RESUMEN POR SECCIONES', pdfWidth / 2, margins, { align: 'center' });
      
      // Agregar tabla de resumen
      let yPos = margins + 15;
      const sectionEntries = Object.entries(auditData.sections);
      
      // Encabezado de tabla
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margins, yPos, pdfWidth - (margins * 2), 10, 'F');
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('Sección', margins + 5, yPos + 6);
      pdf.text('Cumplimiento', pdfWidth - margins - 35, yPos + 6);
      
      yPos += 12;
      
      // Contenido de la tabla
      pdf.setFont('helvetica', 'normal');
      sectionEntries.forEach(([sectionId, section], index) => {
        const percentage = section.completionPercentage || 0;
        const sectionCategory = getCategory(percentage);
        const color = getCategoryColor(sectionCategory);
        
        // Alternar colores de fondo para filas
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(margins, yPos - 2, pdfWidth - (margins * 2), 10, 'F');
        }
        
        // Nombre de sección
        pdf.setTextColor(60, 60, 60);
        pdf.text(sectionId, margins + 5, yPos + 4);
        
        // Porcentaje con color
        pdf.setTextColor(color.replace('#', ''));
        pdf.text(`${percentage}%`, pdfWidth - margins - 35, yPos + 4);
        
        yPos += 10;
        
        // Agregar nueva página si es necesario
        if (yPos > pdfHeight - margins) {
          pdf.addPage();
          yPos = margins + 10;
        }
      });
      
      // Añadir interpretación
      yPos += 5;
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margins, yPos, pdfWidth - (margins * 2), 10, 'F');
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('Interpretación de resultados', margins + 5, yPos + 6);
      
      yPos += 15;
      
      // Leyendas de interpretación
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Bueno
      pdf.setTextColor('#22c55e');
      pdf.text('≥ 80%:', margins + 5, yPos);
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bueno', margins + 25, yPos);
      
      yPos += 8;
      
      // Regular
      pdf.setTextColor('#eab308');
      pdf.setFont('helvetica', 'normal');
      pdf.text('50% - 79.9%:', margins + 5, yPos);
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Regular', margins + 35, yPos);
      
      yPos += 8;
      
      // Malo
      pdf.setTextColor('#ef4444');
      pdf.setFont('helvetica', 'normal');
      pdf.text('< 50%:', margins + 5, yPos);
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Malo', margins + 25, yPos);
      
      // Guardar PDF
      const fileName = `Auditoria_${auditData.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      addAlert('success', `PDF generado correctamente como "${fileName}"`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      addAlert('error', 'Error al generar el PDF');
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