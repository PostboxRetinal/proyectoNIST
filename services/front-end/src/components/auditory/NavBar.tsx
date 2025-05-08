import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/C&C logo2.png';
import NavigationMenu from "./NavigationMenu";
import { User, LogOut } from "lucide-react";

export const NavBar = ({ onSelectControl, pageTitle = "ISO 27001 - Nist 800-30" }: 
  { onSelectControl: (id: string) => void, pageTitle?: string }) => {
  const [userName, setUserName] = useState<string>("Usuario");
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el nombre del usuario del localStorage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      // Asegurar que el nombre tenga la primera letra en mayúscula
      setUserName(storedUserName.charAt(0).toUpperCase() + storedUserName.slice(1));
    }
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };
  
  const handleConfirmLogout = () => {
    // Eliminar datos de la sesión
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    
    // Cerrar el modal
    setShowLogoutModal(false);
    
    // Redirigir al usuario a la página de inicio
    navigate('/');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <header className="bg-white sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Sección izquierda con botón de hamburguesa */}
        <div className="flex items-center">
          <NavigationMenu onSelect={onSelectControl} />
        </div>
        
        {/* Sección central con logo y título */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </Link>
          <h1 className="text-xl font-bold text-blue-800">
            {pageTitle}
          </h1>
        </div>
        
        {/* Información del usuario y botón de cerrar sesión - derecha */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
            <User size={18} className="text-blue-600 mr-2" />
            <span className="text-gray-800 font-medium">
              {`Hola, ${userName}`}
            </span>
          </div>
          
          <button 
            onClick={handleLogoutClick}
            className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Modal de confirmación de cierre de sesión sin fondo oscuro */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl pointer-events-auto border border-gray-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar cierre de sesión</h3>
            <p className="text-gray-600 mb-6">
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
    </header>
  );
};

export default NavBar;