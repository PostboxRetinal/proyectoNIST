import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface CompanySelectorProps {
  onSelect: (id: string, name: string) => void;
  // Elimino onManualEntry ya que no se usa
  error?: string;
  currentFormData?: Record<string, any>;
  showAlerts?: boolean;
}

interface Company {
  id?: string;
  nit: string;
  name?: string;
  companyName: string;
  industry?: string;
}

interface CompaniesResponse {
  success: boolean;
  message: string;
  companies: Array<{
    nit: string;
    companyName: string;
  }>;
}

// Almacenamiento en sessionStorage para preservar datos entre navegaciones
const FORM_STATE_KEY = "auditory-form-state";

const CompanySelector = ({ 
  onSelect, 
  error, 
  currentFormData,
  showAlerts = false 
}: CompanySelectorProps) => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Recuperar estado al cargar el componente
  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem(FORM_STATE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Restaurar compañía seleccionada si existe
        if (parsedState.selectedCompany) {
          setSelectedCompany(parsedState.selectedCompany);
          
          // También restaurar el onSelect para mantener consistencia en el formulario padre
          setTimeout(() => {
            const company = availableCompanies.find(c => c.id === parsedState.selectedCompany);
            if (company) {
              onSelect(company.id as string, company.name || company.companyName);
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error recuperando estado guardado:", error);
    }
  }, [availableCompanies]);

  // Guardar estado actual cuando cambia
  useEffect(() => {
    const stateToSave = {
      selectedCompany
    };
    
    sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(stateToSave));
  }, [selectedCompany]);

  // Efecto para detectar una nueva compañía creada después de regresar de registerCompany
  useEffect(() => {
    if (location.state?.newCompany) {
      const newCompany = location.state.newCompany;
      
      // Recargar la lista de empresas para asegurar que incluye la recién creada
      fetchCompanies().then(() => {
        // Seleccionar automáticamente la nueva compañía después de cargar datos
        setTimeout(() => {
          handleSelectCompany(newCompany.id);
          
          // Limpiar el estado para no seleccionar nuevamente en futuras renderizaciones
          const newState = { ...location.state };
          delete newState.newCompany;
          navigate(location.pathname, { 
            state: newState,
            replace: true
          });
        }, 500); // Pequeño retraso para asegurar que las empresas se han cargado
      });
    }
  }, [location.state, navigate]);
  
  // Cargar empresas desde la API cuando el componente se monta
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get<CompaniesResponse>(
        "http://localhost:3000/api/company/getCompanies"
      );
      
      if (response.data.success) {
        // Transformar los datos al formato que espera el componente
        const companies = response.data.companies.map(company => ({
          id: company.nit,
          nit: company.nit,
          name: company.companyName,
          companyName: company.companyName,
          industry: ""
        }));
        
        setAvailableCompanies(companies);
        setFetchError(null);
      } else {
        setFetchError("No se pudieron cargar las empresas");
      }
    } catch (err) {
      console.error("Error al obtener empresas:", err);
      setFetchError("Error de conexión al obtener las empresas");
    } finally {
      setLoading(false);
    }
    
    return true;
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompany(companyId);
    
    const company = availableCompanies.find(c => c.id === companyId);
    if (company) {
      onSelect(company.id as string, company.name || company.companyName);
    }
  };

  // Navegación al formulario de registro manteniendo el estado
const handleNavigateToRegister = () => {
  // Guardar explícitamente el estado actual antes de navegar
  const currentState = {
    selectedCompany
  };
  sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(currentState));
  
  // Importante: limpiar el estado de validación antes de navegar
  // para evitar que se muestren errores al regresar
  sessionStorage.removeItem("validation-attempted");
  
  navigate('/registerCompany', {
    state: {
      from: location.pathname,
      formData: currentFormData
    }
  });
};

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 font-sans shadow-sm">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Empresa a Evaluar</h3>
      
      <div className="space-y-3">
        {/* Estado de carga */}
        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-500">Cargando empresas...</p>
          </div>
        )}
        
        {/* Error al cargar */}
        {fetchError && !loading && (
          <div className="text-center py-4">
            <p className="text-red-500">{fetchError}</p>
            <button 
              onClick={fetchCompanies}
              className="mt-2 text-blue-600 hover:text-blue-800 underline"
            >
              Reintentar
            </button>
          </div>
        )}
        
        {/* Lista de empresas */}
        {!loading && !fetchError && availableCompanies.map((company) => (
          <div 
            key={company.id}
            className={`border p-3 rounded-md cursor-pointer transition-colors ${
              selectedCompany === company.id 
                ? 'bg-blue-50 border-blue-300' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleSelectCompany(company.id as string)}
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
                <p className="font-medium">{company.name || company.companyName}</p>
                <p className="text-xs text-gray-500">NIT: {company.nit}</p>
                {company.industry && (
                  <p className="text-xs text-gray-500">{company.industry}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Botón para registrar compañía */}
        {!loading && !fetchError && (
          <button
            type= "button"
            onClick={handleNavigateToRegister}
            className="w-full block text-center py-2 px-3 text-sm border rounded-md hover:bg-blue-50 border-blue-300 text-blue-700 transition-colors"
          >
            Registrar Compañía
          </button>
        )}
      </div>
      
      {/* Solo mostrar error si showAlerts es true */}
      {error && showAlerts && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default CompanySelector;