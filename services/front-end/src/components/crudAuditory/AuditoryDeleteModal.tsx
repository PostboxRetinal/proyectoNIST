export const AuditoryDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  auditoryName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  auditoryName?: string;
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">Eliminar Auditoría</h2>
        
        <p className="text-gray-700 mb-6">
          ¿Está seguro que desea eliminar la auditoría "{auditoryName}"? Esta acción no se puede deshacer.
        </p>
        
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};