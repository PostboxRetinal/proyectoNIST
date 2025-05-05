import logo from "../../assets/C&C logo2.png";
import { Link } from "react-router-dom";

export const Items = () => {

  return (
    <nav className=" h-20 items-center justify-between flex gap-2 text-sm font-semibold font-sans relative z-10">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-20 w-auto" />
      </div>
      <div className="flex-1 flex justify-center">
        <div className="flex gap-2">
          <Link to= "/api/loginUser" className="px-3 py-3 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Iniciar Sesión
          </Link>
          <Link to= "/api/registerUser"className="px-3 py-3 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
            Registrarse
          </Link>
          <Link to= "/" className="px-3 py-3 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
            Inicio
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Items;
