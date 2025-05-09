import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../../assets/C&C logo2.png';
import NavigationMenu from "../auditory/NavigationMenu";
import UserName from './UserName';
import LogOutButton from './buttons/LogOutButton';
import LoginButton from './buttons/LogInButton';
import RegisterButton from './buttons/RegisterButton';

interface NavBarProps {
  onSelectControl?: (id: string) => void;
  pageTitle?: string;
}

const NavBar = ({ 
  onSelectControl = () => {}, 
  pageTitle = "ISO 27001 - Nist 800-30" 
}: NavBarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  
  // Verificar si estamos en la página de auditoría o en el inicio
  const isAuditoryPage = location.pathname.includes('/iso27001');
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  
  useEffect(() => {
    // Verificar si el usuario está logueado
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  }, []);

  return (
    <header className="bg-white sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Sección izquierda con menú de navegación y logo */}
        <div className="flex items-center gap-3">
          {/* Menú de navegación en la página de auditoría */}
          {isAuditoryPage && <NavigationMenu onSelect={onSelectControl} />}
          
          {/* Logo siempre a la izquierda, en todas las páginas */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </Link>
        </div>
        
        {/* Sección central - vacía o con título según la página */}
        <div className="flex-grow flex justify-center items-center">
          {/* Título solo cuando no es la página de inicio ni de auditoría */}
          {(isLoggedIn || isAuditoryPage) && !isHomePage && !isAuditoryPage && (
            <h1 className="text-xl font-bold text-blue-800 hidden md:block">
              {pageTitle}
            </h1>
          )}
        </div>
        
        {/* Sección derecha: Información del usuario o botones de inicio de sesión */}
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <UserName />
            <LogOutButton showText={true} /> 
          </div>
        ) : (
          <div className="flex gap-2">
            <LoginButton />
            <RegisterButton />
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;