import { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";

export const UserInfo = () => {
  const [userName, setUserName] = useState("Usuario");
  
  useEffect(() => {
    // Obtener el nombre del usuario del localStorage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      // Asegurar que el nombre tenga la primera letra en mayúscula
      setUserName(storedUserName.charAt(0).toUpperCase() + storedUserName.slice(1));
    }
    
    // Para debug - mostrar en consola para verificar si se está cargando el nombre
    console.log("Nombre de usuario cargado:", storedUserName);
  }, []);
  
  const handleLogout = () => {
    // Eliminar datos de la sesión
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    // Recargar la página para reflejar el cambio
    window.location.reload();
  };

  return (
    <div className="flex items-center space-x-3 whitespace-nowrap">
      <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
        <User size={18} className="text-blue-600 mr-2 flex-shrink-0" />
        <span className="text-gray-800 font-medium">
          {userName ? `Hola, ${userName}` : "Usuario"}
        </span>
      </div>
      
      <button 
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors"
        title="Cerrar sesión"
      >
        <LogOut size={18} className="flex-shrink-0" />
        <span className="text-sm font-medium whitespace-nowrap">Cerrar sesión</span>
      </button>
    </div>
  );
};

export default UserInfo;