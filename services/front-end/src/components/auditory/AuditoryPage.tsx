import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAlerts } from '../alert/AlertContext';
import ControlRenderer from './ControlRenderer';
import NavBar from '../shared/NavBar';

// Define interfaces for the API data structure
interface Option {
  value: string;
  label: string;
  description: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  response: string | null;
  observations: string;
  evidence_url: string;
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
  questions?: Record<string, ControlQuestion>; // Add optional questions property
  completionPercentage?: number; // Add optional completion percentage
}

interface AuditData {
  success?: boolean;
  audit: {
    sections: Record<string, Section>;
  };
}

interface Metadata {
  standardName?: string;
  title?: string;
  companyName?: string;
  auditName?: string;
  startDate?: string;
  endDate?: string;
  auditor?: string;
}

// Define interfaces for the ControlRenderer compatible data structure
interface ControlQuestion {
  id: string;
  text: string;
  response: string | null;
  observations: string;
  evidence_url: string;
}

interface ControlSection {
  questions: Record<string, ControlQuestion>;
  completionPercentage?: number;
}

const AuditoryPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { addAlert } = useAlerts();
  
  // Estados para manejar la auditoría
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para la navegación de secciones y subsecciones
  const [currentSection, setCurrentSection] = useState<string>('');
  const [currentSubsection, setCurrentSubsection] = useState<string>('');
  
  // Función auxiliar para inicializar la primera subsección
  const initializeFirstSubsection = (sectionId: string) => {
    const subsectionMap: Record<string, string> = {
      "1": "1.1",
      "2": "2.1", 
      "3": "3.1",
      "4": "4.1"
    };
    return subsectionMap[sectionId] || "";
  };
  
  useEffect(() => {
    // Intentar recuperar los datos de la auditoría del state o del sessionStorage
    const loadAuditData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Comprobar si tenemos datos en el state
        if (location.state && location.state.auditData) {
          setAuditData(location.state.auditData);
          setMetadata(location.state.metadata);
          
          // Si hay secciones, seleccionar la primera por defecto
          if (location.state.auditData.audit && location.state.auditData.audit.sections) {
            const firstSectionKey = Object.keys(location.state.auditData.audit.sections)[0];
            setCurrentSection(firstSectionKey);
            setCurrentSubsection(initializeFirstSubsection(firstSectionKey));
          }
          
          setLoading(false);
          return;
        }
        
        // Si no hay datos en el state, intentar recuperarlos de sessionStorage
        const savedAudit = sessionStorage.getItem('currentAudit');
        if (savedAudit) {
          const parsedAudit = JSON.parse(savedAudit);
          setAuditData(parsedAudit.auditData);
          setMetadata(parsedAudit.metadata);
          
          // Si hay secciones, seleccionar la primera por defecto
          if (parsedAudit.auditData.audit && parsedAudit.auditData.audit.sections) {
            const firstSectionKey = Object.keys(parsedAudit.auditData.audit.sections)[0];
            setCurrentSection(firstSectionKey);
            setCurrentSubsection(initializeFirstSubsection(firstSectionKey));
          }
          
          setLoading(false);
          return;
        }
        
        // Si no hay datos ni en state ni en sessionStorage, hacer fetch a la API
        if (formId) {
          const response = await fetch(`http://localhost:3000/api/forms/getForms/${formId}`);
          
          if (!response.ok) {
            throw new Error('Error al obtener los detalles de la auditoría');
          }
          
          const fetchedData = await response.json();
          
          if (fetchedData.success && fetchedData.audit) {
            setAuditData(fetchedData);
            // No tenemos metadata en este caso
            
            // Seleccionar la primera sección por defecto
            if (fetchedData.audit && fetchedData.audit.sections) {
              const firstSectionKey = Object.keys(fetchedData.audit.sections)[0];
              setCurrentSection(firstSectionKey);
              setCurrentSubsection(initializeFirstSubsection(firstSectionKey));
            }
          } else {
            throw new Error('No se pudieron obtener los datos de la auditoría');
          }
        } else {
          throw new Error('ID de formulario no proporcionado');
        }
      } catch (err) {
        console.error("Error al cargar la auditoría:", err);
        setError((err as Error).message);
        addAlert('error', `Error al cargar la auditoría: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadAuditData();
  }, [formId, location.state, addAlert]);
  
  // Manejar el cambio de sección y subsección
  const handleSectionChange = (sectionId: string, subsectionId?: string) => {
    setCurrentSection(sectionId);
    
    if (subsectionId) {
      setCurrentSubsection(subsectionId);
    } else {
      // Si no se proporciona subsectionId, seleccionar la primera subsección
      setCurrentSubsection(initializeFirstSubsection(sectionId));
    }
  };
  
    // Convertir la sección para que sea compatible con ControlRenderer
    const convertSectionForControlRenderer = (section: Section | undefined): ControlSection => {
    if (!section) {
      return { questions: {} };
    }
    
      // Si la sección ya tiene el formato esperado por ControlRenderer, retornarla directamente
    if (section.questions && !section.subsections) {
      console.log("La sección ya tiene el formato esperado", section);
      return section as ControlSection;
    }
    
    // Verificar que section.subsections exista
    if (!section.subsections || !Array.isArray(section.subsections)) {
      console.error("La sección no tiene subsecciones o no es un array:", section);
      return { questions: {} };
    }

    // Encontrar la subsección actual
    const currentSubsectionData = section.subsections.find(sub => sub.subsection === currentSubsection);
    
    if (!currentSubsectionData) {
      return { questions: {} };
    }
    
    // Convertir preguntas a formato compatible con ControlRenderer
    const questions = currentSubsectionData.questions.reduce((acc, question) => {
      acc[question.id] = {
        id: question.id,
        text: question.text,
        response: question.response,
        observations: question.observations,
        evidence_url: question.evidence_url
      };
      return acc;
    }, {} as Record<string, ControlQuestion>);
    
    return {
      questions,
      completionPercentage: 0 // Puedes calcular esto basado en las respuestas si lo necesitas
    };
  };
  
  // Manejar guardar respuestas compatible con ControlRenderer
  const handleSaveResponses = async (data: { sectionId: string; updatedSection: ControlSection }) => {
    try {
      console.log('Guardando respuestas:', data);
      // Aquí iría la lógica para actualizar auditData con las respuestas actualizadas
      // y enviar los datos al servidor si es necesario
      
      addAlert('success', 'Respuestas guardadas correctamente');
    } catch (err) {
      console.error("Error al guardar las respuestas:", err);
      addAlert('error', `Error al guardar las respuestas: ${(err as Error).message}`);
    }
  };
  
  // Renderizar estado de carga
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando auditoría...</div>;
  }
  
  // Renderizar estado de error
  if (error || !auditData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Error al cargar la auditoría</h2>
        <p className="mb-4">{error || 'No se pudieron cargar los datos de la auditoría'}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Volver al inicio
        </button>
      </div>
    );
  }
  
  const controlSection = convertSectionForControlRenderer(auditData.audit.sections[currentSection]);
  
  return (
    <div className="flex flex-col h-screen">
      <NavBar
        onSelectControl={handleSectionChange}
        sections={auditData.audit.sections}
        currentSection={currentSection}
        currentSubsection={currentSubsection}
        metadata={metadata || undefined}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <ControlRenderer 
          section={controlSection}
          sectionId={currentSection}
          subsectionId={currentSubsection}
          onSave={handleSaveResponses}
          metadata={metadata || undefined}
        />
      </div>
    </div>
  );
};

export default AuditoryPage;