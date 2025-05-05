import { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface CompanySelectorProps {
  onSelect: (id: string, name: string) => void;
  onManualEntry: (name: string) => void;
  error?: string;
}

interface Company {
  id: string;
  name: string;
  industry: string;
}

const CompanySelector = ({ onSelect, onManualEntry, error }: CompanySelectorProps) => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCompanyName, setManualCompanyName] = useState("");
  
  // Simulación de compañías disponibles
  const availableCompanies: Company[] = [
    { id: '1', name: 'Empresa ABC', industry: 'Tecnología' },
    { id: '2', name: 'Corporación XYZ', industry: 'Finanzas' },
    { id: '3', name: 'Industrias 123', industry: 'Manufactura' }
  ];

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompany(companyId);
    setManualCompanyName("");
    setShowManualInput(false);
    
    const company = availableCompanies.find(c => c.id === companyId);
    if (company) {
      onSelect(company.id, company.name);
    }
  };

  const handleManualEntry = () => {
    setSelectedCompany(null);
    setShowManualInput(true);
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualCompanyName(value);
    onManualEntry(value);
  };

  const handleBackToList = () => {
    setShowManualInput(false);
    setManualCompanyName("");
    // Si había una compañía seleccionada antes, la restauramos
    if (selectedCompany) {
      const company = availableCompanies.find(c => c.id === selectedCompany);
      if (company) {
        onSelect(company.id, company.name);
      }
    } else {
      // Si no había selección previa, limpiamos el valor
      onManualEntry("");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 font-sans shadow-sm">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Empresa a Evaluar</h3>
      
      <div className="space-y-3">
        {/* Lista de empresas */}
        {!showManualInput && availableCompanies.map((company) => (
          <div 
            key={company.id}
            className={`border p-3 rounded-md cursor-pointer transition-colors ${
              selectedCompany === company.id 
                ? 'bg-blue-50 border-blue-300' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleSelectCompany(company.id)}
          >
            <div className="flex items-center">
              <div className="h-4 w-4 mr-2">
                <div className={`h-full w-full rounded-full border ${
                  selectedCompany === company.id 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`} />
              </div>
              <div>
                <p className="font-medium">{company.name}</p>
                <p className="text-xs text-gray-500">{company.industry}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Entrada manual */}
        {showManualInput && (
          <div className="space-y-3">
            <div className="border p-3 rounded-md bg-blue-50 border-blue-300">
              <input
                type="text"
                value={manualCompanyName}
                onChange={handleManualInputChange}
                placeholder="Nombre de la empresa"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Botón para volver a la lista */}
            <button
              type="button"
              onClick={handleBackToList}
              className="w-full py-2 px-3 text-sm border rounded-md bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Volver a la lista de empresas
            </button>
          </div>
        )}
        
        {/* Botón para entrada manual - solo se muestra cuando no está en modo manual */}
        {!showManualInput && (
          <button
            type="button"
            onClick={handleManualEntry}
            className="w-full py-2 px-3 text-sm border rounded-md hover:bg-gray-50 border-gray-300 text-gray-700"
          >
            Ingresar empresa manualmente
          </button>
        )}
      </div>
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default CompanySelector;