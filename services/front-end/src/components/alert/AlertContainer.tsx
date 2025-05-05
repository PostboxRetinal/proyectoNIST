import Alert, { AlertType } from './Alert';

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
  return (
    <div className="fixed top-5 right-5 z-50 w-80 font-sans max-w-full space-y-3">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
};

export default AlertContainer;