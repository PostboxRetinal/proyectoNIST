import logo from "../../assets/C&C logo2.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const Items = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Verificar si el usuario está logueado al cargar el componente
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  }, []);

  return (
    <div className="flex items-center justify-between w-full px-4">
    {/* Logo alineado a la izquierda */}
    <Link to="/" className="flex items-center gap-2">
      <img src={logo} alt="Logo" className="h-16 w-auto" />
    </Link>

    {/* Botones alineados a la derecha si no está logueado */}
    {!isLoggedIn && (
      <div className="flex gap-2">
        <Link
          to="/api/loginUser"
          className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/api/registerUser"
          className="px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Registrarse
        </Link>
      </div>
    )}
  </div>
);
};

export default Items;