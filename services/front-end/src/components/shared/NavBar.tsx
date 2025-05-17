import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import logo from '../../assets/C&C logo2.png';
import NavigationMenu from "../auditory/NavigationMenu";
import UserName from './UserName';
import LogOutButton from './buttons/LogOutButton';
import LoginButton from './buttons/LogInButton';
import RegisterUserButton from './buttons/RegisterUserButton';
import { ChevronDown, Settings, ClipboardCheck, Users } from 'lucide-react';

interface NavBarProps {
  onSelectControl?: (id: string) => void;
}

const NavBar = ({ onSelectControl = () => {} }: NavBarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isAuditoryPage = location.pathname === '/auditory';
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');

    setIsLoggedIn(!!userId);
    setIsAdmin(userRole === 'admin');
  }, []);

  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Sección izquierda con logo y menú de navegación */}
        <div className="flex items-center gap-3">
          {isAuditoryPage && <NavigationMenu onSelect={onSelectControl} />}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </Link>
        </div>
        
        {/* Sección derecha con información de usuario o botones de inicio de sesión */}
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            {/* Nombre de usuario */}
            <UserName />
            
            {/* Menú desplegable para gestión (solo para administradores) */}
            {isAdmin && (
              <div className="relative" ref={menuRef}>
                <button 
                  className="bg-blue-600 text-white px-2.5 py-1.5 rounded-md flex items-center hover:bg-blue-700 transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Settings size={16} className="mr-1.5" />
                  <span className="hidden sm:inline">Gestión</span>
                  <ChevronDown size={14} className="ml-1" />
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button 
                      onClick={() => handleMenuItemClick('/userManagement')}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Users size={14} className="mr-2" />
                      Gestión de Usuarios
                    </button>
                    <button 
                      onClick={() => handleMenuItemClick('/auditoryManagement')}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ClipboardCheck size={14} className="mr-2" />
                      Gestión de Auditorías
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Botón de cerrar sesión */}
            <LogOutButton showText={true} />
          </div>
        ) : (
          <div className="flex gap-2">
            <LoginButton />
            <RegisterUserButton />
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;