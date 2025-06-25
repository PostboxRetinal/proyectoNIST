import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModalAuditory from "../watchAuditory/ModalAuditory";
import { useAlerts } from "../alert/AlertContext";
import { X } from "lucide-react"; 

export const Content = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { addAlert } = useAlerts();

  // Función para manejar la selección de auditoría
  const handleAuditorySelect = (id: string, name: string) => {
    // Añadir logs para depuración
    console.log("ID seleccionado:", id);
    console.log("Nombre seleccionado:", name);
    
    // Cerrar el modal
    setShowModal(false);
    
    // Navegar a la página de auditoría seleccionada
    navigate(`/auditory/${id}?mode=view`, {
      state: { 
        auditoryId: id,
        auditoryName: name,
        viewMode: 'readonly'
      }
    });
    
    addAlert('success', `Auditoría "${name}" seleccionada correctamente`);
  };

  return (
    <div className="flex justify-center items-start w-full pt-10 font-sans">
      <div className="max-w-3xl bg-white p-6 rounded-xl shadow-lg flex flex-col items-center font-sans">
        
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          PANEL DE CONTROL DE AUDITORÍAS       
        </h1>
        
        <p className="text-xl text-gray-600 text-center mb-8">
          Impulsa la seguridad y conformidad de tu organización a través de evaluaciones 
          estructuradas según estándares internacionales.
        </p>

        {/* Botones de acción rápida */}
        <div className="flex gap-8 mb-8">
          <Link to="/newAuditory" className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg text-xl transition-colors">
            Iniciar Evaluación
          </Link>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-xl hover:bg-gray-300 transition-colors"
          >
            Consultar Evaluaciones
          </button>
        </div>

        {/* Modal para seleccionar auditorías */}
        {showModal && (
        <div 
          className="fixed inset-0 bg-opacity-30  flex items-center justify-center z-50 overflow-y-auto p-4"
          onClick={() => setShowModal(false)} // Cierra al hacer clic en el fondo
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Evita que los clics dentro del modal lo cierren
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Cerrar"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h2 className="text-xl font-bold text-blue-700 mb-4">Seleccionar Evaluación</h2>
            
            <ModalAuditory
              onSelect={handleAuditorySelect}
              showAlerts={true}
            />
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Content;