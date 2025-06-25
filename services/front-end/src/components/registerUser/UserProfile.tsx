import { useState } from "react";
import logo from "../../assets/C&C logo2.png";
import { profileTexts } from "../../data/profileTexts";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { ChevronLeft } from 'lucide-react';
import { useAlerts } from "../alert/AlertContext";

interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
  role?: string;
}

interface ErrorResponse {
  message?: string;
}

export default function UserProfile() {
  const profile = profileTexts["userProfile"];
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { addAlert } = useAlerts();

  const handleChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    const missingFields = profile.inputs.filter(input => 
      input.type !== "subtitle" && input.required && !formData[input.label]
    );

    if (missingFields.length > 0) {
      addAlert('error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar formato de correo electrónico
    const emailField = formData["Email"];
    if (!emailField || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField)) {
      addAlert('error', 'Por favor ingresa un correo electrónico válido');
      return;
    } 
    
    // Validar que la contraseña existe
    if (!formData["Contraseña"]) {
      addAlert('error', 'La contraseña es obligatoria');
      return;
    }

    // Validar que el rol esté seleccionado
    if (!formData["Rol"]) {
      addAlert('error', 'Debes seleccionar un rol para el usuario');
      return;
    }

    setLoading(true);
    try {
      // Mapear el rol para el backend
      let mappedRole = "";
      if (formData["Rol"] === "Administrador") {
        mappedRole = "admin";
      } else if (formData["Rol"] === "Auditor") {
        mappedRole = "auditor";
      }
      
      // Preparamos los datos para el backend
      const userData = {
        email: formData["Email"].trim(),
        password: formData["Contraseña"],
        role: mappedRole,
      };
      
      // Debug para revisar los datos enviados
      console.log("Datos a enviar:", userData);
      
      // Realizamos la petición al backend
      const response = await axios.post<RegisterResponse>(
        'http://localhost:3000/api/user/newUser', 
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.data.success) {
        console.log('Registro exitoso:', response.data);
        
        // Guardar datos de autenticación en localStorage para auto-login
        localStorage.setItem('userId', response.data.userId || '');
        localStorage.setItem('role', response.data.role || '');
        localStorage.setItem('userName', formData["Email"].split('@')[0]);
        
        // Mostrar mensaje de éxito
        addAlert('success', 'Perfil de usuario creado exitosamente. Iniciando sesión...');
        
        // Redirigir al usuario a la página principal con sesión iniciada
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        addAlert('error', response.data.message || 'Error en el registro');
      }
    } catch (err: unknown) {
      console.error('Error de registro:', err);
      
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        const errorMessage = axiosError.response?.data?.message || 'Error en el registro';
        addAlert('error', typeof errorMessage === 'string' ? errorMessage : 'Error en el registro');
      } else {
        addAlert('error', 'Error en la conexión con el servidor. Intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <p className="text-gray-500">Cargando perfil...</p>;

  return (
    <div className="flex min-h-screen justify-center py-5 items-center font-sans">
      <div className="max-w-md bg-white p-8 rounded-lg shadow-md flex flex-col items-center font-sans relative">
        <div className="absolute top-4 left-4">
          <Link to="/" className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm">
            <ChevronLeft size={18} />
            <span className="ml-1">Volver</span>
          </Link>
        </div>
        
        {logo && <img src={logo} alt="Logo" className="h-35 mb-7" />}
        
        <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>
          <h2 className="text-2xl text-center">{profile.title}</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">{profile.description}</p>

          {profile.inputs.map((input, i) => {
            if (input.type === "subtitle") {
              return <h3 key={i} className="text-lg mt-6 mb-2">{input.label}</h3>;
            }
            
            if (input.type === "select" && input.options) {
              return (
                <div key={i} className="mb-4">
                  <label htmlFor={input.label} className="block text-sm mb-1">
                    {input.label}{input.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <select
                    id={input.label}
                    value={formData[input.label] || ""}
                    onChange={(e) => handleChange(input.label, e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required={input.required}
                  >
                    <option value="">Selecciona una opción</option>
                    {input.options.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div key={i} className="mb-4">
                <label htmlFor={input.label} className="block text-sm mb-1">
                  {input.label}{input.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  id={input.label}
                  type={input.type}
                  placeholder={input.placeholder}
                  value={formData[input.label] || ""}
                  onChange={(e) => handleChange(input.label, e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required={input.required}
                />
              </div>
            );
          })}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Procesando...' : 'Crear Perfil'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-4">
          ¿Tienes cuenta?{' '}
          <Link to="/loginUser" className="text-blue-500 hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}