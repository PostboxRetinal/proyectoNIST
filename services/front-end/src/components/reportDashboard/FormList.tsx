import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

// Definir la interfaz localmente en lugar de importarla de un archivo que no existe
interface FormListItem {
  id: string;
  name: string;
  date: string;
  status: string;
}

interface FormListProps {
  forms: FormListItem[];
}

const FormList: React.FC<FormListProps> = ({ forms }) => {
  if (forms.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 text-yellow-700 rounded-lg">
        <h2 className="text-lg font-medium">No hay formularios disponibles</h2>
        <p>No se encontraron formularios con respuestas registradas.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {forms.map(form => (
        <Link 
          key={form.id}
          to={`/report/${form.id}`}
          className="p-4 border rounded-lg hover:bg-blue-50 transition-colors flex flex-col"
        >
          <h3 className="text-xl font-semibold mb-2">{form.name}</h3>
          <p className="text-gray-600 mb-2">
            Fecha: {new Date(form.date).toLocaleDateString('es-ES')}
          </p>
          <p className="mb-3">
            <span className={`px-2 py-1 rounded text-sm ${
              form.status === 'Completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {form.status}
            </span>
          </p>
          <span className="text-blue-600 mt-auto flex items-center">
            Ver detalles <ExternalLink className="h-4 w-4 ml-2" />
          </span>
        </Link>
      ))}
    </div>
  );
};

export default FormList;