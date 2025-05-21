import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { FormDataNew } from './adapters';
import FormHeader from './FormHeader';
import FormEvaluation from '../formEvaluation/FormEvaluation';
import SectionDetail from './SectionDetail';

interface FormDetailProps {
  formData: FormDataNew;
  date: string;
  onRefresh: () => void;
  onExportPDF: () => void;
  onShare: () => void;
}

// Componente FormDetail como función nombrada
const FormDetail: React.FC<FormDetailProps> = ({ 
  formData, 
  date, 
  onRefresh, 
  onExportPDF, 
  onShare 
}) => {
  return (
    <div className="container mx-auto p-4">
      {/* Cabecera del reporte */}
      <FormHeader 
        title={formData.program}
        date={date}
        onRefresh={onRefresh}
        onExportPDF={onExportPDF}
        onShare={onShare}
      />

      {/* Componente de evaluación que muestra gráficas */}
      <FormEvaluation formData={formData} />

      {/* Secciones detalladas del formulario */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Detalles del Formulario</h2>
        
        {formData.sections.map((section) => (
          <SectionDetail key={section.section} section={section} />
        ))}
      </div>
      
      {/* Botones de navegación */}
      <div className="mt-8 flex justify-center">
        <Link 
          to="/report"
          className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-2 rounded-lg text-lg flex items-center transition-colors mr-4"
        >
          <Home className="h-5 w-5 mr-2" />
          Ver todos los formularios
        </Link>
        <Link 
          to="/"
          className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg text-lg flex items-center transition-colors"
        >
          <Home className="h-5 w-5 mr-2" />
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
};

// Estas dos líneas permiten importar el componente de ambas formas
export { FormDetail };
export default FormDetail;