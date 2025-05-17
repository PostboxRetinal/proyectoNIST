// ProfileBusiness.tsx
import { useState } from "react";
import logo from "../../assets/C&C logo2.png";
import { profileTexts } from "../../data/profileTexts";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft } from 'lucide-react';
import { useAlerts } from "../alert/AlertContext";


interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export default function ProfileBusiness() {
  const profile = profileTexts["businessProfile"];
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { addAlert } = useAlerts(); // Usamos el hook de alertas

  const handleChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();    const missingFields = profile.inputs.filter(input => 
      input.type !== "subtitle" && input.required && !formData[input.label]
    );

    if (missingFields.length > 0) {
      addAlert('error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar formato de correo electrónico
    const emailField = formData["Email de la Compañía"];
    if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField)) {
      addAlert('error', 'Por favor ingresa un correo electrónico válido');
      return;
    }    // Validar formato del NIT
    const nitField = formData["NIT"];
    if (nitField && !/^\d{9}-\d{1}$/.test(nitField)) {
      addAlert('warning', 'El NIT debe tener el formato: 9 dígitos, guion, 1 dígito (Ej: 900123456-7)');
      return;
    }

    setLoading(true);
      try {
      // Preparamos los datos para el backend según su estructura esperada
      const businessData = {
          companyName: formData["Nombre de la Empresa"],
          nit: formData["NIT"],
          businessType: formData["Área empresarial"],
          employeeRange: formData["Número de Empleados"],
          address: formData["Dirección"],
          phone: formData["Teléfono"],
          email: formData["Email de la Compañía"],
                  
      };
      
      // Realizamos la petición al backend
      const response = await axios.post<RegisterResponse>(
        'http://localhost:3000/api/company/newCompany', 
        businessData
      );
      
      if (response.data.success) {
        console.log('Registro exitoso:', response.data);
        
        // Mostrar mensaje de éxito
        addAlert('success', 'Perfil de empresa creado exitosamente');
        
        // Redirigir al usuario a la página de login o dashboard después de un breve delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        addAlert('error', response.data.message || 'Error en el registro');
      }
    } catch (err: any) {
      console.error('Error de registro:', err);
      
      if (err.response) {
        const errorMessage = err.response.data.message || 'Error en el registro';
        addAlert('error', errorMessage);
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
      <div className=" max-w-md bg-white p-8 rounded-lg shadow-md flex flex-col items-center font-sans relative">
        <div className="absolute top-4 left-4">
          <Link to="/" className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm">
            <ChevronLeft size={18} />
            <span className="ml-1">Volver</span>
          </Link>
        </div>
        {logo && (
          <img src={logo} alt="Logo" className="h-35 mb-7" />
        )}        <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>
          <h2 className="text-2xl text-center">{profile.title}</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">{profile.description}</p>

          {profile.inputs.map((input, i) => {
            if (input.type === "subtitle") {
              return (
                <h3 key={i} className="text-lg mt-6 mb-2">{input.label}</h3>
              );
            }            if (input.type === "radio" && input.options) {
              return (
                <div key={i} className="mb-4">
                  <label className="block text-sm mb-2">{input.label}</label>
                  <div className="space-y-2">
                    {input.options.map((option, idx) => (
                      <label key={idx} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={input.label}
                          value={option}
                          checked={formData[input.label] === option}
                          onChange={(e) => handleChange(input.label, e.target.value)}
                          className="accent-blue-500"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            }

            if (input.type === "select" && input.options) {
              return (
                <div key={i} className="mb-4">
                  <label htmlFor={input.label} className="block text-sm mb-1">
                    {input.label}
                  </label>
                  <select
                    id={input.label}
                    value={formData[input.label] || ""}
                    onChange={(e) => handleChange(input.label, e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              <div key={i}>
                <label htmlFor={input.label} className="block text-sm mb-1">
                  {input.label}
                </label>
                <input
                  id={input.label}
                  type={input.type}
                  placeholder={input.placeholder}
                  value={formData[input.label] || ""}
                  onChange={(e) => handleChange(input.label, e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            );
          })}          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Procesando...' : 'Crear Perfil'}
          </button>
        </form>
      </div>
    </div>
  );
}

export { ProfileBusiness };
