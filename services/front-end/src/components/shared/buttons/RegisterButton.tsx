import { Link } from 'react-router-dom';

interface RegisterButtonProps {
  showText?: boolean;
  className?: string;
}

const RegisterButton = ({ 
  showText = true, 
  className = "px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition" 
}: RegisterButtonProps) => {
  return (
    <Link
      to="/api/registerUser"
      className={className}
    >
      {showText && "Registrarse"}
    </Link>
  );
};

export default RegisterButton;