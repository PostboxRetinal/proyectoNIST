import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAlerts } from '../components/alert/AlertContext';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { addAlert } = useAlerts();
  
  useEffect(() => {
    // Verificar si hay un usuario logueado y su rol
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role'); // La clave debe coincidir con la usada en el login

    
    if (!userId || !role) {
      setIsAdmin(false);
      // Solo mostramos una alerta, no varias
      addAlert('warning', 'Debes iniciar sesión para acceder a esta sección');
    } else if (role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      // Solo mostramos una alerta, no varias
      addAlert('warning', 'No tienes permisos para acceder a esta sección');
    }
    
    setLoading(false);
  }, [addAlert]); // Sin dependencias para evitar múltiples ejecuciones

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-lg text-gray-700">Verificando permisos...</p>
      </div>
    );
  }

  return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;