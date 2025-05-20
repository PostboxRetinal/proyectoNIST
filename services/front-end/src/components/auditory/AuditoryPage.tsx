import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAlerts } from '../alert/AlertContext';
import SideBar from './SideBar';
import ControlRenderer from './ControlRenderer';
import NavBar from '../shared/NavBar';

interface AuditoryPageProps {
  // Puedes definir props si son necesarias
}

const AuditoryPage: React.FC<AuditoryPageProps> = () => {
  const { formId } = useParams<{ formId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { addAlert } = useAlerts();
  
  // Estados para manejar la auditoría
  const [auditData, setAuditData] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para la sección actual seleccionada en la barra lateral
  const [currentSection, setCurrentSection] = useState<string>('');
  
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
  
  // Manejar el cambio de sección
  const handleSectionChange = (sectionId: string) => {
    setCurrentSection(sectionId);
  };
  
  // Manejar guardar respuestas
  const handleSaveResponses = async (responses: any) => {
    // Implementar la lógica para guardar las respuestas
    try {
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
    <>        
        <NavBar/>
    <div className="flex h-screen bg-gray-100">
        
      {/* Barra lateral con las secciones */}
      <SideBar 
        sections={auditData.audit.sections} 
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        metadata={metadata}
      />
      
      {/* Contenido principal con las preguntas */}
      <div className="flex-1 overflow-y-auto p-6">
        <ControlRenderer 
          section={auditData.audit.sections[currentSection]}
          sectionId={currentSection}
          onSave={handleSaveResponses}
          metadata={metadata}
        />
      </div>
    </div>
    </>
  );
};

export default AuditoryPage;