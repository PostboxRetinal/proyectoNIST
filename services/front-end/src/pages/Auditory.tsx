import React from 'react';
import { useParams } from 'react-router-dom';
import AuditManager from '../components/auditory/AuditManager';
import { AlertProvider } from '../components/alert/AlertContext';

const Auditory: React.FC = () => {
  const { auditId } = useParams<{ auditId?: string }>();
  
  return (
    <AlertProvider>
      <AuditManager 
        auditId={auditId}
        companyName="Empresa de Ejemplo"
        auditName="Auditoría NIST 800-30"
      />
    </AlertProvider>
  );
};

export default Auditory;;