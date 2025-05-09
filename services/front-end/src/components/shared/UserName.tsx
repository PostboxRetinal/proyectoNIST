import { User } from "lucide-react";
import { useEffect, useState } from "react";

interface UserNameProps {
  className?: string;
  showIcon?: boolean;
}

const UserName = ({ className = "", showIcon = true }: UserNameProps) => {
  const [userName, setUserName] = useState("Usuario");
  
  useEffect(() => {
    // Obtener el nombre del usuario del localStorage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      // Asegurar que el nombre tenga la primera letra en mayúscula
      setUserName(storedUserName.charAt(0).toUpperCase() + storedUserName.slice(1));
    }
  }, []);

  return (
    <div className={`flex items-center px-4 py-2 rounded-lg ${className}`}>
      {showIcon && <User size={18} className="text-blue-600 mr-2 flex-shrink-0" />}
      <span className="text-gray-800 font-medium truncate max-w-[180px]">
        {userName ? `Hola, ${userName}` : "Usuario"}
      </span>
    </div>
  );
};

export default UserName;