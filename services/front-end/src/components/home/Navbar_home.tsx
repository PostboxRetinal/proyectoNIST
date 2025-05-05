import { Items } from "./Nav_home";

export const Navbar = () => {
  return (
    <header className="bg-opacity-75">
      {/* Navbar Principal */}
      <nav className="bg-white text-black p-2">
        <Items />
      </nav>
    </header>
  );
};

export default Navbar;