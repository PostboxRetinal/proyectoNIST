import { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import translations from '../../../public/locales/es/translation.json';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
};

const SideBar = ({ isOpen, onClose, onSelect }: SidebarProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Obtener traducciones del archivo JSON
  const { nav, breadcrumb, sidebar } = translations;
  
  // Crear elementos del breadcrumb usando las traducciones
  const breadcrumbItems = [
    { 
      label: nav.Perfil, 
      submenu: [
        `${breadcrumb.options} 1`, 
        `${breadcrumb.options} 2`
      ] 
    },
    { 
      label: nav.Empresa, 
      submenu: [
        `${breadcrumb.options} 1`, 
        `${breadcrumb.options} 2`
      ] 
    },
    { 
      label: nav.Lineamiento, 
      submenu: [
        `${breadcrumb.options} 1`, 
        `${breadcrumb.options} 2`
      ] 
    }
  ];

  // Crear elementos del sidebar usando las traducciones
  const sidebarItems = [
    { id: "seccionA", label: sidebar.Profundizando },
    { id: "seccionB", label: sidebar.Contexto },
    { id: "seccionC", label: sidebar.Liderazgo },
    { id: "seccionD", label: sidebar.Planificación },
    { id: "seccionE", label: sidebar.Soporte },
    { id: "seccionF", label: sidebar.Operación },
    { id: "seccionG", label: sidebar.Evaluación },
    { id: "seccionH", label: sidebar.Mejora },
    { id: "seccionI", label: sidebar.Controles }
  ];

  const toggleMenu = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  const handleSectionSelect = (id: string, label: string) => {
    onSelect(id);
    setActiveSection(label);
    // En dispositivos móviles, puede ser conveniente cerrar el sidebar al seleccionar
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div 
      className={`sidebar fixed top-0 left-0 h-full font-sans bg-white text-gray-800 shadow-xl z-50 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-0 opacity-0'
      }`}
      style={{ top: '85px', paddingTop: '0.5rem' }} // Ajuste para el navbar
    >
      {isOpen && (
        <div className="flex flex-col h-full relative">
          {/* Contenedor del header con el botón X mejorado */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h2 className="font-semibold text-gray-800">Menú de navegación</h2>
            <button
              className="p-1 rounded-md hover:bg-gray-200 focus:outline-none"
              onClick={onClose}
              aria-label="Cerrar menú"
            >
              <X size={20} className="text-gray-700" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 150px)' }}>
            {/* Navegación principal */}
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="menu-item mb-4">
                <div
                  onClick={() => toggleMenu(index)}
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                    openIndex === index ? 'bg-blue-100 text-blue-600' : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-semibold">{item.label}</span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${
                    openIndex === index ? 'rotate-90' : ''
                  }`} />
                </div>
                
                {/* Submenú desplegable */}
                {openIndex === index && (
                  <div className="mt-2 pl-4 border-l-2 border-blue-100">
                    {item.submenu.map((option, i) => (
                      <div
                        key={i}
                        className="py-2 px-3 text-sm hover:bg-blue-50 rounded-md cursor-pointer"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Sección de evaluación */}
            <div className="mt-4 border-t pt-4">
              <div
                onClick={() => toggleMenu(99)} // Número único para esta sección especial
                className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                  openIndex === 99 ? 'bg-blue-100 text-blue-600' : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span className="font-semibold">Secciones de evaluación</span>
                <ChevronRight className={`h-4 w-4 transition-transform ${
                  openIndex === 99 ? 'rotate-90' : ''
                }`} />
              </div>
              
              {/* Submenú con los items del sidebar original */}
              {openIndex === 99 && (
                <div className="mt-2 pl-4 border-l-2 border-blue-100">
                  {sidebarItems.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSectionSelect(item.id, item.label)}
                      className={`flex items-center py-2 px-2 text-sm rounded-md cursor-pointer ${
                        activeSection === item.label 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <ChevronRight className={`h-3 w-3 mr-1 ${activeSection === item.label ? 'text-blue-500' : 'text-gray-400'}`} />
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Botón para crear evaluación */}
            <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md w-full transition-colors">
              {sidebar.Crear}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;