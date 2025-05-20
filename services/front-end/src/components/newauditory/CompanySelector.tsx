import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface CompanySelectorProps {
  onSelect: (id: string, name: string) => void;
  error?: string;
  currentFormData?: Record<string, any>;
  showAlerts?: boolean;
  userRole?: string; // Prop para el rol del usuario
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
  const [deletingCompany, setDeletingCompany] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  // Estado para el modal de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [companyToDeleteName, setCompanyToDeleteName] = useState<string>("");
  
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener el rol del usuario desde localStorage
  const [isAdmin, setIsAdmin] = useState(false);

  // Efecto para obtener el rol del localStorage al montar el componente
  useEffect(() => {
    const userRoleFromStorage = localStorage.getItem('role');
    setIsAdmin(userRoleFromStorage === 'admin');
  }, []);

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

  // Iniciar proceso de eliminación con el modal
  const initiateDeleteCompany = (companyNit: string, companyName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent selecting the company when clicking delete
    setCompanyToDelete(companyNit);
    setCompanyToDeleteName(companyName);
    setShowDeleteModal(true);
  };
  
  // Cancelar eliminación
  const cancelDeleteCompany = () => {
    setShowDeleteModal(false);
    setCompanyToDelete(null);
    setCompanyToDeleteName("");
  };

  // Confirmar y ejecutar eliminación
  const confirmDeleteCompany = async () => {
    if (!companyToDelete) return;
    
    try {
      setDeletingCompany(companyToDelete);
      setDeleteError(null);
      setShowDeleteModal(false);
      
      // Make API call to delete company
      const response = await axios.delete(`http://localhost:3000/api/company/delete/${companyToDelete}`);
      
      if (response.data.success) {
        // If the deleted company was selected, clear selection
        if (selectedCompany === companyToDelete) {
          setSelectedCompany(null);
        }
        
        // Refresh company list
        await fetchCompanies();
      } else {
        setDeleteError(`Error al eliminar la empresa: ${response.data.message}`);
      }
    } catch (err) {
      console.error("Error al eliminar la empresa:", err);
      setDeleteError("Error de conexión al eliminar la empresa");
    } finally {
      setDeletingCompany(null);
      setCompanyToDelete(null);
      setCompanyToDeleteName("");
    }
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
        
        {/* Error al eliminar */}
        {deleteError && (
          <div className="p-2 mb-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {deleteError}
            <button 
              onClick={() => setDeleteError(null)}
              className="ml-2 text-red-800 hover:underline"
            >
              Cerrar
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
            <div className="flex items-center justify-between">
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
              {isAdmin && (
                <button
                  type="button"
                  onClick={(e) => initiateDeleteCompany(company.nit, company.name || company.companyName, e)}
                  className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded border border-red-200 transition-colors"
                  disabled={deletingCompany === company.nit}
                >
                  {deletingCompany === company.nit ? (
                    <span className="inline-block">...</span>
                  ) : (
                    "Eliminar"
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        
        {/* Botón para registrar compañía */}
        {!loading && !fetchError && (
          <button
            type="button"
            onClick={handleNavigateToRegister}
            className="w-full block text-center py-2 px-3 text-sm border rounded-md hover:bg-blue-50 border-blue-300 text-blue-700 transition-colors"
          >
            Registrar Compañía
          </button>
        )}
      </div>
      
      {/* Solo mostrar error si showAlerts es true */}
      {error && showAlerts && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar la empresa <span className="font-semibold">{companyToDeleteName}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDeleteCompany}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteCompany}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySelector;