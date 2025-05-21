import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModalAuditory from "../watchAuditory/ModalAuditory";
import { useAlerts } from "../alert/AlertContext";
import { X } from "lucide-react"; // Importamos el icono X de lucide-react

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
    <div className="flex justify-center items-start w-full min-h-screen pt-10 font-sans">
      <div className="max-w-3xl bg-white p-6 rounded-xl shadow-lg flex flex-col items-center font-sans">
        
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          BIENVENIDO DE NUEVO A LA PLATAFORMA DE AUDITORÍA       
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full pt-4 mb-10">
          <div className="bg-blue-50 p-8 rounded-2xl shadow-lg text-center min-h-[180px]">
            <p className="text-9xl font-bold text-blue-600">4</p>
            <p className="text-3xl text-gray-600">Auditorías Activas</p>
          </div>
          <div className="bg-blue-50 p-8 rounded-2xl shadow-lg text-center min-h-[180px]">
            <p className="text-9xl font-bold text-yellow-600">2</p>
            <p className="text-3xl text-gray-600">Pendientes por Aprobar</p>
          </div>
          <div className="bg-blue-50 p-8 rounded-2xl shadow-lg text-center min-h-[180px]">
            <p className="text-9xl font-bold text-green-600">1</p>
            <p className="text-3xl text-gray-600">Programadas este Mes</p>
          </div>
        </div>
        
        <p className="text-xl text-gray-600 text-center mb-8">
          Gestiona, revisa y controla auditorías internas de manera eficiente para el constante 
          mejoramiento de la empresa y la optimización de sus procesos.
        </p>

        {/* Botones de acción rápida */}
        <div className="flex gap-8 mb-8">
          <Link to="/newAuditory" className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg text-xl">
            Nueva Auditoría
          </Link>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-xl hover:bg-gray-300"
          >
            Ver Auditorías
          </button>
        </div>

        {/* Modal para seleccionar auditorías */}
        {showModal && (
        <div 
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4"
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
            
            <h2 className="text-xl font-bold text-blue-700 mb-4">Seleccionar Auditoría</h2>
            
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