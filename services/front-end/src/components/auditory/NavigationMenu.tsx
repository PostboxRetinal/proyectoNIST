import { useState, useEffect } from 'react';
import { AlignJustify } from 'lucide-react';
import SideBar from './SideBar';

interface Metadata {
  standardName?: string;
  title?: string;
  companyName?: string;
  auditName?: string;
  startDate?: string;
  endDate?: string;
  auditor?: string;
}

interface Option {
  value: string;
  label: string;
  description: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  response: string | null;
  observations: string;
  evidence_url: string;
}

interface Subsection {
  subsection: string;
  title: string;
  questions: Question[];
}

interface Section {
  section: string;
  title: string;
  subsections: Subsection[];
}

interface NavigationMenuProps {
  onSelect: (id: string, subsectionId?: string) => void;
  sections?: Record<string, Section>;
  currentSection?: string;
  currentSubsection?: string;
  metadata?: Metadata;
}

const NavigationMenu = ({ 
  onSelect, 
  sections = {}, 
  currentSection = '', 
  currentSubsection,
  metadata 
}: NavigationMenuProps) => {
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
        className="toggle-button p-2 text-gray-800 border cursor-pointer border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <AlignJustify size={24} />
      </button>
      
      {/* Componente Sidebar separado */}
      <SideBar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
        onSectionChange={onSelect}
        sections={sections}
        currentSection={currentSection}
        currentSubsection={currentSubsection}
        metadata={metadata}
      />
    </div>
  );
};

export default NavigationMenu;