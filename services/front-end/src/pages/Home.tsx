import { useEffect, useState } from "react";
import Content from "../components/home/Panel_home_log";
import GuestHome from "../components/home/Panel_home_guest";
import Navbar from "../components/home/Navbar_home";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Verificar si hay un userId en localStorage
    const userId = localStorage.getItem('userId');
    setIsAuthenticated(!!userId);
  }, []);
  return (
    <div>
      <Navbar />
      {isAuthenticated ? <Content /> : <GuestHome />}
    </div>
  );
}

export { Home };
