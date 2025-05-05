import { useState } from 'react';
import NavBar from '../components/auditory/NavBar';
import Controlrenderer from '../components/auditory/Controlrenderer';

export default function Auditory() {
  const [selectedControl, setSelectedControl] = useState<string>("");
  
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar con NavigationMenu integrado */}
      <NavBar onSelectControl={setSelectedControl} />

      {/* Contenido Principal con la clase content-container para el desplazamiento */}
      <div className="flex-1 overflow-y-auto content-container p-4">
        <Controlrenderer controlId={selectedControl} />
      </div>
    </div>
  );
}

export { Auditory };