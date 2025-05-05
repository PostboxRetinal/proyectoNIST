import React, { createContext, useContext, useState, ReactNode } from 'react';
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

  const addAlert = (type: AlertType, message: string) => {
    const id = uuidv4();
    const newAlert = { id, type, message };
    setAlerts(prev => [...prev, newAlert]);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ addAlert, removeAlert }}>
      <AlertContainer alerts={alerts} removeAlert={removeAlert} />
      {children}
    </AlertContext.Provider>
  );
};