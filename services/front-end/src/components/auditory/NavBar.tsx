import logo from '../../assets/C&C logo2.png';
import NavigationMenu from "./NavigationMenu";

export const NavBar = ({ onSelectControl }: { onSelectControl: (id: string) => void }) => {
  return (
    <header className="bg-white sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <img src={logo} alt="Logo" className="h-20" />
        
        {/* Menú de navegación sin fondo gris */}
        <NavigationMenu onSelect={onSelectControl} />
      </div>
    </header>
  );
};

export default NavBar;