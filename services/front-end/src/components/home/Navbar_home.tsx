import { useEffect, useState } from "react";
import { Items } from "./Nav_home";
import { UserInfo } from "./User_info";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Verificar si el usuario está logueado
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto py-2 px-4 flex justify-between items-center">
        <Items />
        {isLoggedIn && <UserInfo />}
      </div>
    </header>
  );
};

export default Navbar;