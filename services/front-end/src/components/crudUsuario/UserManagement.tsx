import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, Home, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAlerts } from "../alert/AlertContext";
import EditModal from "./EditModal";
import ConfirmModal from "./ConfirmModal";

// Definimos las interfaces para la respuesta de la API y el modelo de usuario
interface UserResponse {
  success: boolean;
  message: string;
  users: User[];
}

interface User {
  uid: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  newPassword?: string;
}

export default function UserManagement() {
  // Obtenemos la función para mostrar alertas
  const { addAlert } = useAlerts();
  
  // Estado para almacenar los usuarios desde la API
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el filtro de búsqueda
  const [filtro, setFiltro] = useState("");
  
  // Estado para el usuario que se está editando
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estado para el usuario que se está eliminando
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Cargar usuarios desde la API al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para obtener los usuarios desde la API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get<UserResponse>("http://localhost:3000/api/user/getUsers");
      
      if (response.data.success) {
        // Transformamos los datos recibidos para adaptarlos a nuestra interfaz
        const formattedUsers = response.data.users.map(user => ({
          ...user,
          nombre: user.email.split('@')[0] // Usamos parte del email como nombre si no hay campo de nombre
        }));
        
        setUsuarios(formattedUsers);
      } else {
        setError("Error al cargar usuarios: " + response.data.message);
        addAlert("error", "Error al cargar usuarios: " + response.data.message);
      }
    } catch (err: any) {
      console.error("Error al cargar usuarios:", err);
      setError(err.response?.data?.message || "Error al conectar con el servidor");
      addAlert("error", err.response?.data?.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };
  
  // Filtrar usuarios por nombre o email
  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.email.toLowerCase().includes(filtro.toLowerCase())
  );
  
  // Iniciar eliminación de un usuario
  const iniciarEliminacionUsuario = (usuario: User) => {
    setDeletingUser(usuario);
    setShowDeleteModal(true);
  };
  
  // Eliminar un usuario
  const confirmarEliminarUsuario = async () => {
    if (!deletingUser) return;
    
    try {
      const response = await axios.delete(`http://localhost:3000/api/user/deleteUser/${deletingUser.uid}`);
      
      if (response.data.success) {
        // Actualizar la lista de usuarios eliminando el usuario borrado
        setUsuarios(prevUsuarios => prevUsuarios.filter(usuario => usuario.uid !== deletingUser.uid));
        addAlert("success", "Usuario eliminado correctamente");
        setShowDeleteModal(false);
        setDeletingUser(null);
      } else {
        addAlert("error", "Error al eliminar usuario: " + response.data.message);
      }
    } catch (err: any) {
      console.error("Error al eliminar usuario:", err);
      addAlert("error", err.response?.data?.message || "Error al conectar con el servidor");
    }
  };

  // Iniciar edición de un usuario
  const iniciarEdicionUsuario = (usuario: User) => {
    setEditingUser({...usuario});
    setShowEditModal(true);
  };

  // Guardar cambios del usuario editado
  const guardarCambiosUsuario = async () => {
    if (!editingUser) return;

    const updateData = {
      email: editingUser.email,
      role: editingUser.role
    };

    if (editingUser.newPassword && editingUser.newPassword.trim() !== "") {
      Object.assign(updateData, { password: editingUser.newPassword });
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/user/updateUser/${editingUser.uid}`, {
        email: editingUser.email,
        role: editingUser.role
      });
 
      if (response.data.success) {
        // Actualizar la lista de usuarios con el usuario modificado
        setUsuarios(prevUsuarios => 
          prevUsuarios.map(usuario => 
            usuario.uid === editingUser.uid ? {
              ...editingUser,
              updatedAt: new Date().toISOString(),
              // Eliminamos el campo temporal de contraseña
              newPassword: undefined
            } : usuario
          )
        );
        
        setShowEditModal(false);
        setEditingUser(null);
        addAlert("success", "Usuario actualizado correctamente");
      } else {
        addAlert("error", "Error al actualizar usuario: " + response.data.message);
      }
    } catch (err: any) {
      console.error("Error al actualizar usuario:", err);
      addAlert("error", err.response?.data?.message || "Error al conectar con el servidor");
    }
  };

  // Manejar cambios en el formulario de edición
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        [name]: value
      });
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              to="/registerUser"
              className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-lg flex items-center transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Crear Usuario
            </Link>
            
            <button
              onClick={() => {
                fetchUsers();
                addAlert("info", "Actualizando lista de usuarios...");
              }}
              className="bg-green-600 text-white hover:bg-green-700 px-5 py-2 rounded-lg flex items-center transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Recargar
            </button>
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
        
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Estado de carga */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Cargando usuarios...</p>
          </div>
        ) : (
          /* Tabla de usuarios */
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full bg-white overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700">Email</th>
                  <th className="py-3 px-4 text-left text-gray-700">Rol</th>
                  <th className="py-3 px-4 text-left text-gray-700">Creado</th>
                  <th className="py-3 px-4 text-left text-gray-700">Actualizado</th>
                  <th className="py-3 px-4 text-left text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.uid} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{usuario.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs text-white ${
                        usuario.role === "admin" ? "bg-purple-500" : 
                        usuario.role === "auditor" ? "bg-green-500" : "bg-blue-500"
                      }`}>
                        {usuario.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{formatDate(usuario.createdAt)}</td>
                    <td className="py-3 px-4 text-sm">{formatDate(usuario.updatedAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-yellow-500 hover:text-yellow-700 transition-colors"
                          aria-label="Editar usuario"
                          onClick={() => iniciarEdicionUsuario(usuario)}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => iniciarEliminacionUsuario(usuario)}
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
        )}
        
        {!loading && usuariosFiltrados.length === 0 && (
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
      
      {/* Modal de edición usando componente reutilizable */}
      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={guardarCambiosUsuario}
        title="Editar Usuario"
      >
        {editingUser && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editingUser.email}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                name="role"
                value={editingUser.role}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="admin">Administrador</option>
                <option value="auditor">Auditor</option>
                <option value="gestor">Gestor</option>
              </select>
            </div>
            
            {/* Campo para cambiar contraseña */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                name="newPassword"
                value={editingUser.newPassword || ''}
                onChange={handleEditChange}
                placeholder="Dejar vacío para mantener la actual"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Sólo introduce una nueva contraseña si deseas cambiarla.
              </p>
            </div>
          </>
        )}
      </EditModal>
      
      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingUser(null);
        }}
        onConfirm={confirmarEliminarUsuario}
        title="Eliminar Usuario"
        message={`¿Está seguro que desea eliminar a ${deletingUser?.email}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}

export { UserManagement }