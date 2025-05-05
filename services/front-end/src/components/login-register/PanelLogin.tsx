import { useState } from "react";
import logo from '../../assets/C&C logo2.png';
import { Link } from 'react-router-dom';


export default function PanelLogin() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    console.log('Email:', email, 'Password:', password);
    setError('');
  };


  return (
    <div className="flex min-h-screen justify-center font-sans items-center">
      <div className="w-full max-w-md bg-white p-9 rounded-lg shadow-md flex flex-col items-center font-sans">
        {/* Logo centrado arriba */}
        {logo && (
          <img src={logo} alt="Logo" className="h-35 mb-7" />
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <h2 className="text-2xl font-bold text-center">Login</h2>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">
              Email de la compañía
            </label>
            <input
              id="email"
              type="email"
              placeholder="Ej: acmeSA@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
          >
            Iniciar sesión
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/api/registerUser" className="text-blue-500 hover:underline">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export { PanelLogin };
