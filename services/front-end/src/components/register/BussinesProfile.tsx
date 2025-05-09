// ProfileBusiness.tsx
import { useState } from "react";
import logo from "../../assets/C&C logo2.png";
import { profileTexts } from "../../data/profileTexts";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export default function ProfileBusiness() {
  const profile = profileTexts["businessProfile"];
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields = profile.inputs.filter(input => 
      input.type !== "subtitle" && !formData[input.label]
    );

    if (missingFields.length > 0) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (formData["Contraseña"] !== formData["Confirmar Contraseña"]) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      // Preparamos los datos para el backend según su estructura esperada
      const businessData = {
          companyName: formData["Nombre de la Empresa"],
          nit: formData["Número de Identificación Fiscal"],
          businessType: formData["Industria"],
          employeeRange: formData["Tamaño de la Empresa"],
          address: formData["Dirección"],
          phone: formData["Teléfono"],
          userId: "123456",
          email: formData["Correo Electrónico"],
          
        
      };
      
      // Realizamos la petición al backend
      const response = await axios.post<RegisterResponse>(
        'http://localhost:4002/api/company/newCompany', 
        businessData
      );
      
      if (response.data.success) {
        console.log('Registro exitoso:', response.data);
        // Opcional: guardar datos en localStorage o context si es necesario
        
        // Redirigir al usuario a la página de login o dashboard
        navigate('/');
      } else {
        setError(response.data.message || 'Error en el registro');
      }
    } catch (err: any) {
      console.error('Error de registro:', err);
      
      if (err.response) {
        const errorMessage = err.response.data.message || 'Error en el registro';
        setError(errorMessage);
      } else {
        setError('Error en la conexión con el servidor. Intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };


  if (!profile) return <p className="text-gray-500">Cargando perfil...</p>;

  return (
    <div className="flex min-h-screen justify-center py-5 items-center font-sans">
      <div className=" max-w-md bg-white p-8 rounded-lg shadow-md flex flex-col items-center font-sans">
        {logo && (
          <img src={logo} alt="Logo" className="h-35 mb-7" />
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <h2 className="text-2xl text-center">{profile.title}</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">{profile.description}</p>

          {profile.inputs.map((input, i) => {
            if (input.type === "subtitle") {
              return (
                <h3 key={i} className="text-lg mt-6 mb-2">{input.label}</h3>
              );
            }

            if (input.type === "radio" && input.options) {
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
          })}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Procesando...' : 'Crear Perfil'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
              ¿Tienes cuenta?{' '}
              <Link to="/api/loginUser" className="text-blue-500 hover:underline">
                Iniciar Sesion
              </Link>
        </p>
      </div>
    </div>
  );
}

export { ProfileBusiness };
