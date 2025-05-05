import { useState } from "react";

interface ProfileSelectorProps {
  onSelect: (id: string, name: string) => void;
  error?: string;
}

interface Profile {
  id: string;
  name: string;
  role: string;
  department: string;
}

const ProfileSelector = ({ onSelect, error }: ProfileSelectorProps) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  
  // Simulación de perfiles disponibles - esto normalmente vendría del backend
  const availableProfiles: Profile[] = [
    { id: '1', name: 'Juan Pérez', role: 'Auditor Senior', department: 'Calidad' },
    { id: '2', name: 'Ana Gómez', role: 'Analista de Seguridad', department: 'TI' },
    { id: '3', name: 'Carlos López', role: 'Gerente', department: 'Operaciones' }
  ];

  const handleSelectProfile = (profileId: string) => {
    setSelectedProfile(profileId);
    const profile = availableProfiles.find(p => p.id === profileId);
    if (profile) {
      onSelect(profile.id, profile.name);
    }
  };

  return (
    <div className="bg-white border border-gray-200 font-sans rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Perfil del Auditor</h3>
      
      <div className="space-y-3">
        {availableProfiles.map((profile) => (
          <div 
            key={profile.id}
            className={`border p-3 rounded-md cursor-pointer transition-colors ${
              selectedProfile === profile.id 
                ? 'bg-blue-50 border-blue-300' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleSelectProfile(profile.id)}
          >
            <div className="flex items-start">
              <div className="h-4 w-4 mt-1 mr-2">
                <div className={`h-full w-full rounded-full border ${
                  selectedProfile === profile.id 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`} />
              </div>
              <div>
                <p className="font-medium">{profile.name}</p>
                <p className="text-sm text-gray-600">{profile.role}</p>
                <p className="text-xs text-gray-500">{profile.department}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ProfileSelector;