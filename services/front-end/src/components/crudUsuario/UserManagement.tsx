import { useState } from "react";
import { PlusCircle, Users, Eye, Edit, Trash2, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserManagement() {
  // Estado para simular datos de usuarios
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Carlos Méndez",
      email: "carlos.mendez@ejemplo.com",
      rol: "Administrador"
    },
    {
      id: 2,
      nombre: "María González",
      email: "maria.gonzalez@ejemplo.com",
      rol: "Auditor"
    },
    {
      id: 3, 
      nombre: "Juan Pérez",
      email: "juan.perez@ejemplo.com",
      rol: "Gestor"
    },
    {
      id: 4,
      nombre: "Ana Ramírez",
      email: "ana.ramirez@ejemplo.com",
      rol: "Auditor"        
    }
  ]);
  
  // Estado para el filtro de búsqueda
  const [filtro, setFiltro] = useState("");
  
  // Filtrar usuarios por nombre o email
  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    usuario.email.toLowerCase().includes(filtro.toLowerCase())
  );
  
  // Eliminar un usuario
  const eliminarUsuario = (id: number) => {
    if(window.confirm("¿Está seguro que desea eliminar este usuario?")) {
      setUsuarios(prevUsuarios => prevUsuarios.filter(usuario => usuario.id !== id));
    }
  };

  return (
    <div className="flex justify-center items-start w-full min-h-screen pt-24 font-sans">
      <div className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-lg">
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            Gestión de Usuarios
          </h1>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/create-user"
              className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-lg flex items-center transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Crear Usuario
            </Link>
            
            <Link 
              to="/manage-roles"
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-5 py-2 rounded-lg flex items-center transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              Gestionar Roles
            </Link>
          </div>
        </div>
        
        {/* Campo de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        
        {/* Tabla de usuarios */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-gray-700">Nombre</th>
                <th className="py-3 px-4 text-left text-gray-700">Email</th>
                <th className="py-3 px-4 text-left text-gray-700">Rol</th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{usuario.nombre}</td>
                  <td className="py-3 px-4">{usuario.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${
                      usuario.rol === "Administrador" ? "bg-purple-500" : 
                      usuario.rol === "Auditor" ? "bg-green-500" : "bg-blue-500"
                    }`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        aria-label="Ver usuario"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-yellow-500 hover:text-yellow-700 transition-colors"
                        aria-label="Editar usuario"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700 transition-colors"
                        onClick={() => eliminarUsuario(usuario.id)}
                        aria-label="Eliminar usuario"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {usuariosFiltrados.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No se encontraron usuarios con ese filtro</p>
          </div>
        )}
        
        {/* Botones de navegación */}
        <div className="mt-8 flex justify-center">
          <Link 
            to="/"
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-2 rounded-lg text-lg flex items-center transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export { UserManagement }