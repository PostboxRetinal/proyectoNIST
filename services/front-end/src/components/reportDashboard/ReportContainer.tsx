import { useState, useEffect } from "react";
import { BarChart3, Home, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAlerts } from "../alert/AlertContext";

// Interfaces para tipado
interface AuditoryResponse {
  success: boolean;
  forms: Auditory[];
}

interface Auditory {
  id: string;
  name: string;
}

export default function ReportContainer() {
  // Estados para gestionar las auditorías
  const [auditorias, setAuditorias] = useState<Auditory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el filtro de búsqueda
  const [filtro, setFiltro] = useState("");
  
  // Hook para navegación
  const navigate = useNavigate();
  
  // Hook para mostrar alertas
  const { addAlert } = useAlerts();

  // Cargar auditorías al inicio
  useEffect(() => {
    fetchAuditorias();
  }, []);

  // Función para obtener las auditorías desde la API
  const fetchAuditorias = async () => {
    setLoading(true);
    try {
      const response = await axios.get<AuditoryResponse>("http://localhost:3000/api/forms/getForms", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: false
      });
      
      if (response.data && response.data.success) {
        setAuditorias(response.data.forms);
        setError(null);
        // Usar addAlert para notificar éxito al actualizar la lista
        addAlert('success', 'Lista de auditorías actualizada correctamente');
      } else {
        console.warn('Formato de respuesta inesperado:', response.data);
        setError('El formato de respuesta no es el esperado');
        // Usar addAlert para notificar error
        addAlert('error', 'El formato de respuesta no es el esperado');
      }
    } catch (err) {
      console.error("Error al cargar auditorías:", err);
      setError("No se pudieron cargar las auditorías. Por favor, intenta de nuevo más tarde.");
      // Usar addAlert para notificar error
      addAlert('error', 'No se pudieron cargar las auditorías. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Filtrar auditorías por nombre
  const auditoriasFiltradas = auditorias.filter(auditoria => 
    auditoria.name.toLowerCase().includes(filtro.toLowerCase())
  );
  
  // Ver resultados/gráficas de una auditoría
  const verResultadosAuditoria = (auditoriaId: string) => {
    // Usar addAlert para informar al usuario que está siendo redirigido
    addAlert('info', 'Cargando resultados de la auditoría...');
    
    // Navegar a la página de reportes con el ID de la auditoría
    navigate(`/report-details/${auditoriaId}`);
  };

  return (
    <div className="flex justify-center items-start w-full min-h-screen pt-10 font-sans">
      <div className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-lg">
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            Reportes y Gráficas
          </h1>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={fetchAuditorias}
              className="bg-green-600 text-white hover:bg-green-700 px-5 py-2 rounded-lg flex items-center transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar lista
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
        
        {/* Estado de carga */}
        {loading ? (
          <div className="text-center py-10 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Tabla de auditorías */
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full bg-white overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700">Nombre de la Auditoría</th>
                  <th className="py-3 px-4 text-left text-gray-700">ID</th>
                  <th className="py-3 px-4 text-left text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {auditoriasFiltradas.map((auditoria) => (
                  <tr key={auditoria.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{auditoria.name}</td>
                    <td className="py-3 px-4 text-xs text-gray-500">{auditoria.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md flex items-center transition-colors"
                          onClick={() => verResultadosAuditoria(auditoria.id)}
                          aria-label="Ver resultados"
                        >
                          <BarChart3 className="h-5 w-5 mr-2" />
                          Ver Resultados
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && auditoriasFiltradas.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No se encontraron auditorías con ese filtro</p>
          </div>
        )}
        
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
    </div>
  );
}