// SectionList.tsx
import React from 'react';
import { Section } from './types';

interface SectionListProps {
  sections: Section[];
  onEdit: (section: Section, index: number) => void;
  onDelete: (index: number) => void;
}

const SectionList: React.FC<SectionListProps> = ({ sections, onEdit, onDelete }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Secciones del formulario ({sections.length})</h2>
      
      {sections.length > 0 ? (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={section.section} className="p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">
                  <span className="text-gray-600 mr-2">{section.section}:</span>
                  {section.title}
                </h3>
                <div>
                  <button
                    type="button"
                    onClick={() => onEdit(section, index)}
                    className="p-1 mr-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(index)}
                    className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              
              <div className="ml-4">
                <div className="text-sm text-gray-700">Subsecciones: {section.subsections.length}</div>
                <div className="text-sm text-gray-700">
                  Preguntas: {section.subsections.reduce((total: number, sub) => total + sub.questions.length, 0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic p-4 border border-gray-200 rounded-md">
          No hay secciones añadidas. Comience creando una nueva sección.
        </p>
      )}
    </div>
  );
};

export default SectionList;