// SubsectionList.tsx
import React from 'react';
import { Subsection } from './types';

interface SubsectionListProps {
  subsections: Subsection[];
  onEdit: (subsection: Subsection, index: number) => void;
  onDelete: (index: number) => void;
}

const SubsectionList: React.FC<SubsectionListProps> = ({ subsections, onEdit, onDelete }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-2">Subsecciones ({subsections.length})</h3>
      
      {subsections.length > 0 ? (
        <div className="space-y-2">
          {subsections.map((subsection, index) => (
            <div key={subsection.subsection} className="mb-2 p-2 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{subsection.subsection}: {subsection.title}</span>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => onEdit(subsection, index)}
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
              
              <div className="mt-1 ml-4">
                <span className="text-sm text-gray-500">Preguntas: </span>
                {subsection.questions.length} preguntas
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No hay subsecciones añadidas</p>
      )}
    </div>
  );
};

export default SubsectionList;