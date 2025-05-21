import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAlerts } from '../alert/AlertContext';
import ControlRenderer from './ControlRenderer';
import NavBar from '../shared/NavBar';


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
  
// Definir una interfaz para las respuestas
  interface ResponseData {
    [questionId: string]: {
      response: string | null;
      observations?: string;
      evidence_url?: string;
    };
  }
  
  // Manejar guardar respuestas
  const handleSaveResponses = async (responses: ResponseData) => {
    // Implementar la lógica para guardar las respuestas
    try {
            // Usar las respuestas para actualizar el estado o enviar al servidor
      console.log('Guardando respuestas:', responses);
      // Ejemplo de cómo podrías actualizar las respuestas
      // const response = await fetch(`http://localhost:3000/api/forms/update/${formId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(responses)
      // });
      
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
  
  return (
    <div className="flex flex-col h-screen">
    <NavBar
      onSelectControl={handleSectionChange}
      sections={auditData.audit.sections}
      currentSection={currentSection}
      currentSubsection={currentSubsection}
      metadata={metadata}
    />
    <div className="flex-1 overflow-y-auto p-6">
      <ControlRenderer 
        section={auditData.audit.sections[currentSection]}
        sectionId={currentSection}
        subsectionId={currentSubsection}
        onSave={handleSaveResponses}
        metadata={metadata}
      />
    </div>
  </div>
  );
};

export default AuditoryPage;