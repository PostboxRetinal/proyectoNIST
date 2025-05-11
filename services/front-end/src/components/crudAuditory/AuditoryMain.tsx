import { useState } from "react";
import { PlusCircle, MenuSquare, Eye, Edit, Trash2, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuditoryMain() {
  // Estado para simular datos de auditorías
  const [auditorias, setAuditorias] = useState([
    {
      id: 1,
      titulo: "Auditoría ISO 9001:2015",
      normativa: "ISO 9001:2015",
      fecha: "2025-05-15",
      estado: "Activa",
      responsable: "Carlos Méndez"
    },
    {
      id: 2,
      titulo: "Auditoría Procesos Financieros",
      normativa: "NIIF",
      fecha: "2025-05-20",
      estado: "Activa",
      responsable: "María González"
    },
    {
      id: 3, 
      titulo: "Auditoría Seguridad Informática",
      normativa: "ISO 27001",
      fecha: "2025-05-10",
      estado: "Activa",
      responsable: "Juan Pérez"
    },
    {
      id: 4,
      titulo: "Auditoría Recursos Humanos",
      normativa: "NOM-035-STPS-2018",
      fecha: "2025-05-25",
      estado: "Activa",
      responsable: "Ana Ramírez" 
    }
  ]);
  
  // Estado para el filtro de búsqueda
  const [filtro, setFiltro] = useState("");
  
  // Filtrar auditorías por título o normativa
  const auditoriasFiltradas = auditorias.filter(auditoria => 
    auditoria.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    auditoria.normativa.toLowerCase().includes(filtro.toLowerCase())
  );
  
  // Eliminar una auditoría
  const eliminarAuditoria = (id: number) => {
    if(window.confirm("¿Está seguro que desea eliminar esta auditoría?")) {
      setAuditorias(prevAuditorias => prevAuditorias.filter(auditoria => auditoria.id !== id));
    }
  };

  return (
    <div className="flex justify-center items-start w-full min-h-screen pt-24 font-sans">
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
            
            <Link 
              to="/manage-forms"
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-5 py-2 rounded-lg flex items-center transition-colors"
            >
              <MenuSquare className="h-5 w-5 mr-2" />
              Gestionar Formularios
            </Link>
          </div>
        </div>
        
        {/* Campo de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por título o normativa..."
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        
        {/* Tabla de auditorías */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-gray-700">Título</th>
                <th className="py-3 px-4 text-left text-gray-700">Normativa</th>
                <th className="py-3 px-4 text-left text-gray-700">Fecha</th>
                <th className="py-3 px-4 text-left text-gray-700">Estado</th>
                <th className="py-3 px-4 text-left text-gray-700">Responsable</th>
                <th className="py-3 px-4 text-left text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {auditoriasFiltradas.map((auditoria) => (
                <tr key={auditoria.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{auditoria.titulo}</td>
                  <td className="py-3 px-4">{auditoria.normativa}</td>
                  <td className="py-3 px-4">{auditoria.fecha}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs text-white bg-green-500">
                      {auditoria.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4">{auditoria.responsable}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        aria-label="Ver auditoría"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-yellow-500 hover:text-yellow-700 transition-colors"
                        aria-label="Editar auditoría"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700 transition-colors"
                        onClick={() => eliminarAuditoria(auditoria.id)}
                        aria-label="Eliminar auditoría"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {auditoriasFiltradas.length === 0 && (
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

export {AuditoryMain}