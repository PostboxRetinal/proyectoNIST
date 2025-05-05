import { useState } from "react";

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
      setAuditorias(auditorias.filter(auditoria => auditoria.id !== id));
    }
  };

  return (
    <div className="flex justify-center items-start w-full min-h-screen pt-24 font-sans">
      <div className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-lg">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            Gestión de Auditorías
          </h1>
          
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.href = '/createauditory'}
              className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-lg flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Formulario
            </button>
            
            <button 
              onClick={() => window.location.href = '/manage-forms'}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-5 py-2 rounded-lg flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Gestionar Formularios
            </button>
          </div>
        </div>
        
        
        {/* Tabla de auditorías */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
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
                      <button className="text-blue-500 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-yellow-500 hover:text-yellow-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => eliminarAuditoria(auditoria.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-2 rounded-lg text-lg"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export {AuditoryMain}