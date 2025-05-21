import React from "react";
import { Eye, Trash2 } from "lucide-react";
import { Auditory } from "./auditoryTypes";

interface AuditoryTableProps {
  auditorias: Auditory[];
  loading: boolean;
  onView: (auditoria: Auditory) => void;
  onDelete: (auditoria: Auditory) => void;
}

export const AuditoryTable: React.FC<AuditoryTableProps> = ({
  auditorias,
  loading,
  onView,
  onDelete
}) => {
  if (loading) {
    return (
      <div className="text-center py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (auditorias.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No se encontraron auditorías</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full bg-white overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-gray-700">Nombre</th>
            <th className="py-3 px-4 text-left text-gray-700">ID</th>
            <th className="py-3 px-4 text-left text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {auditorias.map((auditoria) => (
            <tr key={auditoria.id} className="hover:bg-gray-50">
              <td className="py-3 px-4">{auditoria.name}</td>
              <td className="py-3 px-4 text-xs text-gray-500">{auditoria.id}</td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <button 
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    onClick={() => onView(auditoria)}
                    aria-label="Ver detalles"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700 transition-colors"
                    onClick={() => onDelete(auditoria)}
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
  );
};