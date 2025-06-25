import { Link } from 'react-router-dom';

interface LoginButtonProps {
  showText?: boolean;
  className?: string;
}

const LoginButton = ({ 
  showText = true, 
  className = "px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition" 
}: LoginButtonProps) => {
  return (
    <Link
      to="/loginUser"
      className={className}
    >
      {showText && "Iniciar Sesión"}
    </Link>
  );
};

export default LoginButton;