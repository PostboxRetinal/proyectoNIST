import { useState } from 'react';
import NavBar from '../components/shared/NavBar';
import Controlrenderer from '../components/auditory/ControlRenderer';

export default function Iso27001() {
  const [selectedControl, setSelectedControl] = useState<string>("");
  
  return (
    <div className="flex flex-col h-screen">
      {/* NavBar unificado con el controlador de selección */}
      <NavBar 
        onSelectControl={setSelectedControl} 
        pageTitle="ISO 27001 - Nist 800-30" 
      />

      {/* Contenido Principal */}
      <div className="flex-1 overflow-y-auto content-container p-4">
        <Controlrenderer controlId={selectedControl} />
      </div>
    </div>
  );
}

export { Iso27001 };