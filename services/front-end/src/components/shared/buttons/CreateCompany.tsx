import { Link } from 'react-router-dom';

interface RegisterButtonProps {
  showText?: boolean;
  className?: string;
}

const CreateCompany = ({ 
  showText = true, 
  className = "px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition" 
}: RegisterButtonProps) => {
  return (
    <Link
      to="/registerCompany"
      className={className}
    >
      {showText && "Crear Empresa"}
    </Link>
  );
};

export default CreateCompany;