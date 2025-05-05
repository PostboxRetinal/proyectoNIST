import { useState, useEffect } from 'react';
import { AlignJustify } from 'lucide-react';
import SideBar from './SideBar';

const NavigationMenu = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Función para cerrar el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // No cerrar si se hace clic en el botón de toggle o dentro del sidebar
      if (target.closest('.toggle-button') || target.closest('.sidebar')) {
        return;
      }
      
      // Si se hace clic fuera, cerrar el sidebar
      if (isSidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Efecto para aplicar clase al body cuando el sidebar está abierto
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('sidebar-open');
      document.documentElement.style.setProperty('--sidebar-width', '250px');
    } else {
      document.body.classList.remove('sidebar-open');
      document.documentElement.style.setProperty('--sidebar-width', '0px');
    }
  }, [isSidebarOpen]);

  return (
    <div className="relative">
      {/* Botón hamburguesa para abrir/cerrar el sidebar */}
      <button 
        className="toggle-button p-2 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <AlignJustify size={24} />
      </button>
      
      {/* Componente Sidebar separado */}
      <SideBar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
        onSelect={onSelect}
      />
      
    </div>
  );
};

export default NavigationMenu;