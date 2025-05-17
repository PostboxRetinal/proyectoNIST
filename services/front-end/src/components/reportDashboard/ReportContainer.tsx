import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import FormEvaluation from '../formEvaluation/FormEvaluation';
import { useAlerts } from '../alert/AlertContext';

const ReportCotainer: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addAlert } = useAlerts();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/forms/${formId}`);
        setFormData(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error('Error al cargar el formulario:', error);
        addAlert('error', `Error al cargar el formulario: ${error.message}`);
        setLoading(false);
      }
    };

    if (formId) {
      fetchFormData();
    }
  }, [formId, addAlert]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <h2 className="text-lg font-medium">No se pudo cargar el formulario</h2>
        <p>Verifique que el ID del formulario es correcto e intente nuevamente.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{formData.program}</h1>
        <p className="text-gray-600">
          Fecha de creación: {new Date(formData.fechaCreacion).toLocaleDateString()}
        </p>
      </div>

      <FormEvaluation formData={formData} />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Detalles del Formulario</h2>
        
        {formData.sections.map((section: any) => (
          <div key={section.section} className="mb-6 p-4 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              {section.section}: {section.title}
            </h3>
            
            {section.subsections.map((subsection: any) => (
              <div key={subsection.subsection} className="mb-4 pl-4 border-l-2 border-gray-200">
                <h4 className="text-lg font-medium mb-2">
                  {subsection.subsection}: {subsection.title}
                </h4>
                
                <ul className="space-y-3">
                  {subsection.questions.map((question: any) => {
                    // Encontrar la opción seleccionada
                    const selectedOption = question.options.find((opt: any) => opt.value === question.response);
                    
                    // Determinar color según el tipo y valor de la respuesta
                    let valueColor = 'text-gray-800';
                    if (typeof selectedOption?.value === 'number') {
                      if (selectedOption.value >= 0.8) valueColor = 'text-green-600';
                      else if (selectedOption.value >= 0.5) valueColor = 'text-yellow-600';
                      else valueColor = 'text-red-600';
                    } else if (selectedOption?.value === 'yes') {
                      valueColor = 'text-green-600';
                    } else if (selectedOption?.value === 'no') {
                      valueColor = 'text-red-600';
                    } else if (selectedOption?.value === 'partial') {
                      valueColor = 'text-yellow-600';
                    }
                    
                    return (
                      <li key={question.id} className="p-3 bg-gray-50 rounded-md">
                        <div className="mb-1">
                          <span className="font-medium">{question.id}: </span>
                          {question.text}
                        </div>
                        <div className="flex justify-between text-sm">
                          <div>
                            <span className="text-gray-600">Respuesta: </span>
                            <span className={`font-medium ${valueColor}`}>
                              {selectedOption?.label || 'No respondido'}
                            </span>
                          </div>
                          {question.observations && (
                            <div className="text-gray-600">
                              <span>Observaciones: </span>
                              <span>{question.observations}</span>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportCotainer;