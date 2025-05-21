import React, { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import AlertContainer, { AlertMessage } from './AlertContainer';
import { AlertType } from './Alert';

interface AlertContextType {
  addAlert: (type: AlertType, message: string) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts debe ser usado dentro de un AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  // Keep track of all active timers
  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Clean up all timers when component unmounts
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  // Usar useCallback para evitar recreaciones innecesarias de la función
  const addAlert = useCallback((type: AlertType, message: string) => {
    const id = uuidv4();
    const newAlert = { id, type, message };
    
    // Usar un callback functional update para evitar dependencia en el estado anterior
    setAlerts(prev => [...prev, newAlert]);
    
    // Auto-eliminar después de 5 segundos
    timersRef.current[id] = setTimeout(() => {
      // Usar la versión funcional para evitar closures desactualizados
      setAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== id));
      // Clean up the reference after timer completes
      delete timersRef.current[id];
    }, 5000);
    
    // Devolver el ID para que pueda ser usado para eliminar manualmente
    return id;
  }, []);

  // Usar useCallback para evitar recreaciones innecesarias de la función
  const removeAlert = useCallback((id: string) => {
    // Clear the timeout if it exists
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    
    // Usar un functional update para acceder al estado más reciente
    setAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ addAlert, removeAlert }}>
      <AlertContainer alerts={alerts} removeAlert={removeAlert} />
      {children}
    </AlertContext.Provider>
  );
};