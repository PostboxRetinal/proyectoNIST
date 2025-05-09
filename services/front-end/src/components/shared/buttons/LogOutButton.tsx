import { useState } from 'react';
import { LogOut } from 'lucide-react';

interface LogOutButtonProps {
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
  redirectPath?: string;
  buttonText?: string;
  modalZIndex?: number;
}

const LogOutButton = ({
  className = "",
  showIcon = true,
  showText = true,
  redirectPath = '/',
  buttonText = "Cerrar sesión",
  modalZIndex = 50
}: LogOutButtonProps) => {

  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    // Eliminar datos de la sesión
    localStorage.clear(); // Limpia todo el localStorage
   
    // Cerrar el modal
    setShowLogoutModal(false);
    
    window.location.href = redirectPath;
  };

  return (
    <div className="flex justify-end w-full">
      <button 
        onClick={handleLogoutClick}
        className={`flex items-center justify-center min-w-[40px] h-10 gap-1.5 px-3 py-2 
          text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer transition-colors ${className}`}
        title="Cerrar sesión"
      >
        {showIcon && <LogOut size={18} />}
        {showText && <span className="text-sm font-medium">{buttonText}</span>}
      </button>

      {showLogoutModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center" 
          style={{ zIndex: modalZIndex }} 
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-300 pointer-events-auto"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar cierre de sesión</h3>
            <p className="text-gray-600 mb-6 whitespace-normal">
              ¿Estás seguro de que deseas cerrar sesión? Asegúrate de haber guardado todos los cambios antes de continuar.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogOutButton;