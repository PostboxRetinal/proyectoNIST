import { Link } from "react-router-dom";

export const AuditoryViewModal = ({ 
  isOpen, 
  onClose, 
  auditory 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  auditory?: { id: string; name: string; }; 
}) => {
  if (!isOpen || !auditory) return null;
  
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">Detalles de la Auditoría</h2>
        
        <div className="mb-4">
          <p className="font-semibold text-gray-700">Nombre:</p>
          <p className="text-gray-800">{auditory.name}</p>
        </div>
        
        <div className="mb-4">
          <p className="font-semibold text-gray-700">ID:</p>
          <p className="text-gray-500 text-sm">{auditory.id}</p>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cerrar
          </button>
          <Link 
            to={`/reportdetails/${auditory.id}`}
            replace={true}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ver Reporte Completo
          </Link>
        </div>
      </div>
    </div>
  );
};