import { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Alert = ({ type, message, onClose, autoClose = true, duration = 5000 }: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // Definir colores y estilos según el tipo
  const styles = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800'
  };

  const iconColor = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };

  // Cierre automático después de "duration" milisegundos
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`flex items-center justify-between p-4 font-sans mb-4 border-l-4 rounded ${styles[type]}`} role="alert">
      <div className="flex items-center">
        <span className={`mr-2 ${iconColor[type]}`}>
          {type === 'success' && <CheckCircle size={20} />}
          {type === 'error' && <XCircle size={20} />}
          {type === 'warning' && <AlertTriangle size={20} />}
          {type === 'info' && <Info size={20} />}
        </span>
        <div className="text-sm font-medium">{message}</div>
      </div>
      <button 
        type="button" 
        className="ml-4 focus:outline-none" 
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
      >
        <X size={20} className="text-gray-600 hover:text-gray-800" />
      </button>
    </div>
  );
};

export default Alert;