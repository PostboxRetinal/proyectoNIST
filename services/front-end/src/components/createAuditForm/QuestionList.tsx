// QuestionList.tsx
import React from 'react';
import { Question } from './types';

interface QuestionListProps {
  questions: Question[];
  onEdit: (question: Question, index: number) => void;
  onDelete: (index: number) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onEdit, onDelete }) => {
  return (
    <div className="mt-3">
      <h4 className="text-sm font-medium mb-2">Preguntas ({questions.length})</h4>
      
      {questions.length > 0 ? (
        <ul className="space-y-2">
          {questions.map((question, index: number) => (
            <li key={question.id} className="p-2 bg-gray-100 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{question.id}: {question.text}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    (Pregunta {question.esObligatoria ? "Obligatoria" : "Opcional"})
                  </span>
                  {question.esObligatoria && <span className="ml-2 text-red-500">*</span>}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => onEdit(question, index)}
                    className="p-1 mr-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-xs"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(index)}
                    className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-xs"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              
              {/* Opciones y descripciones */}
              {question.options.length > 0 && (
                <div className="mt-1 ml-4">
                  <span className="text-sm text-gray-500">Opciones: </span>
                  <div className="pl-2 text-xs text-gray-500">
                    {question.options.map((option, idx: number) => (
                      <div key={idx}>
                        <span className="font-medium">{option.label}</span>
                        {option.description && (
                          <span className="ml-1">- {option.description}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">No hay preguntas añadidas</p>
      )}
    </div>
  );
};

export default QuestionList;