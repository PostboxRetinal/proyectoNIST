import { useEffect, useState } from "react";
import Content from "../components/home/PanelHomeLog";
import GuestHome from "../components/home/PanelHomeGuest";
import NavBar from "../components/shared/NavBar";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Verificar si hay un userId en localStorage
    const userId = localStorage.getItem('userId');
    setIsAuthenticated(!!userId);
  }, []);

  return (
    <div>
      <NavBar pageTitle="Inicio" />
      {isAuthenticated ? <Content /> : <GuestHome />}
    </div>
  );
}

export { Home };