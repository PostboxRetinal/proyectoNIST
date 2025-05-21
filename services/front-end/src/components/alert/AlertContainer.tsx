import Alert, { AlertType } from './Alert';
import { useCallback } from 'react';

export interface AlertMessage {
  id: string;
  type: AlertType;
  message: string;
}

interface AlertContainerProps {
  alerts: AlertMessage[];
  removeAlert: (id: string) => void;
}

const AlertContainer = ({ alerts, removeAlert }: AlertContainerProps) => {
  // Crear un manejador seguro que no cause recargas
  const handleRemoveAlert = useCallback((id: string) => {
    // Envolver en un try-catch para capturar errores que pudieran causar recargas
    try {
      removeAlert(id);
    } catch (error) {
      console.error('Error al eliminar alerta:', error);
    }
  }, [removeAlert]);

  // Detener la propagación de clics en el contenedor completo
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed top-5 right-5 z-50 w-80 font-sans max-w-full space-y-3"
      onClick={handleContainerClick}
    >
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          onClose={() => handleRemoveAlert(alert.id)}
        />
      ))}
    </div>
  );
};

export default AlertContainer;