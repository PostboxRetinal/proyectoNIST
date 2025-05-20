import React from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/shared/NavBar';
import AuditoryPage from '@/components/auditory/AuditoryPage';

const Auditory: React.FC = () => {
  const { auditId } = useParams<{ auditId?: string }>();
  
  return (
    <>
    <NavBar/>
    <AuditoryPage/>
    </>
  );
};

export default Auditory;