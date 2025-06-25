// FormGeneralData.tsx
import React, { ChangeEvent } from 'react';
import { FormularioData } from './types';

interface FormGeneralDataProps {
  formData: FormularioData;
  onChange: (formData: FormularioData) => void;
}

const FormGeneralData: React.FC<FormGeneralDataProps> = ({ formData, onChange }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      audit: {
        ...formData.audit,
        [name]: value
      }
    });
  };

  return (
    <div className="mb-8 p-4 border border-gray-200 rounded-md">
      <h2 className="text-xl font-semibold mb-4">Datos Generales</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Normativa*
          </label>
          <input
            type="text"
            name="program"
            value={formData.audit.program || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej: ISO 9001"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default FormGeneralData;