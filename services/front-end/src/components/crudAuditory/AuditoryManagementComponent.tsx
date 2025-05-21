import { useState, useEffect } from "react";
import { PlusCircle, Home, RefreshCw, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { AuditoryDeleteModal } from "./AuditoryDeleteModal";
import { AuditoryViewModal } from "./AuditoryViewModal";
import { AuditoryTable } from "./AuditoryTable";
import { UploadJsonModal } from "./UploadJsonModal";
import { useAlerts } from "../alert/AlertContext";
import { auditoryService } from "../../services/auditoryService";
import { Auditory, AxiosError, AuditFormData } from "./auditoryTypes";

export default function AuditoryManagement() {
  // Estados para gestionar las auditorías
  const [auditorias, setAuditorias] = useState<Auditory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el filtro de búsqueda
  const [filtro, setFiltro] = useState("");
  
  // Estados para modales
  const [selectedAuditory, setSelectedAuditory] = useState<Auditory | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Hook para mostrar alertas
  const { addAlert } = useAlerts();

  // Cargar auditorías al inicio
  useEffect(() => {
    fetchAuditorias();
  }, []);

  // Función para obtener las auditorías desde la API
  const fetchAuditorias = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const auditoriasData = await auditoryService.getAllAudits();
      setAuditorias(auditoriasData);
    } catch (err) {
      console.error("Error al cargar auditorías:", err);
      setError("No se pudieron cargar las auditorías. Por favor, intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };
  
  // Filtrar auditorías por nombre
  const auditoriasFiltradas = auditorias.filter(auditoria => 
    auditoria.name.toLowerCase().includes(filtro.toLowerCase())
  );
  
  // Iniciar eliminación de una auditoría
  const iniciarEliminacionAuditoria = (auditoria: Auditory) => {
    setSelectedAuditory(auditoria);
    setShowDeleteModal(true);
  };
  
  // Ver detalles de una auditoría
  const verDetallesAuditoria = (auditoria: Auditory) => {
    setSelectedAuditory(auditoria);
    setShowViewModal(true);
  };
  
  // Confirmar eliminación de una auditoría
  const confirmarEliminarAuditoria = async () => {
    if (!selectedAuditory) return;
    
    try {
      setLoading(true);
      await auditoryService.deleteAudit(selectedAuditory.id);
      
      // Actualizamos el estado local eliminando la auditoría
      setAuditorias(prevAuditorias => 
        prevAuditorias.filter(a => a.id !== selectedAuditory.id)
      );
      
      // Mostramos la alerta de éxito
      addAlert('success', `La auditoría "${selectedAuditory.name}" ha sido eliminada correctamente`);
      
      // Cerramos el modal y limpiamos la selección
      setShowDeleteModal(false);
      setSelectedAuditory(null);
    } catch (err: unknown) {
      console.error("Error al eliminar auditoría:", err);
  
      const error = err as AxiosError;
      const errorMessage = error.message || 'Error desconocido';
  
      setError(`Error al eliminar la auditoría: ${errorMessage}`);
      addAlert('error', `Error al eliminar la auditoría: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la subida de una auditoría
  const handleUploadAuditory = async (jsonData: AuditFormData) => {
    try {
      await auditoryService.uploadAudit(jsonData);
      addAlert('success', `Auditoría "${jsonData.program}" subida correctamente`);
      setShowUploadModal(false);
      fetchAuditorias(); // Refresh the list
      return Promise.resolve();
    } catch (err) {
      console.error("Error al subir auditoría:", err);
      const error = err as AxiosError;
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error desconocido';
      addAlert('error', `Error al subir la auditoría: ${errorMessage}`);
      return Promise.reject(error);
    }
  };

  return (
    <div className="flex justify-center items-start w-full min-h-screen pt-10 font-sans">
      <div className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-lg">
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            Gestión de Auditorías
          </h1>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/createauditory"
              className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-lg flex items-center transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Crear Formulario
            </Link>
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-purple-600 text-white hover:bg-purple-700 px-5 py-2 rounded-lg flex items-center transition-colors"
            >
              <Upload className="h-5 w-5 mr-2" />
              Subir JSON
            </button>
            
            <button
              onClick={fetchAuditorias}
              className="bg-green-600 text-white hover:bg-green-700 px-5 py-2 rounded-lg flex items-center transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Recargar
            </button>
          </div>
        </div>
        
        {/* Campo de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Tabla de auditorías */}
        <AuditoryTable 
          auditorias={auditoriasFiltradas}
          loading={loading}
          onView={verDetallesAuditoria}
          onDelete={iniciarEliminacionAuditoria}
        />
        
        {/* Botones de navegación */}
        <div className="mt-8 flex justify-center">
          <Link 
            to="/"
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-2 rounded-lg text-lg flex items-center transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Volver al Dashboard
          </Link>
        </div>
      </div>
      
      {/* Modales */}
      <AuditoryDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAuditory(null);
        }}
        onConfirm={confirmarEliminarAuditoria}
        auditoryName={selectedAuditory?.name}
      />

      <AuditoryViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedAuditory(null);
        }}
        auditory={selectedAuditory || undefined}
      />
      
      <UploadJsonModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadAuditory}
      />
    </div>
  );
}

export { AuditoryManagement }