import React from 'react';
import { Question } from '../createAuditForm/types';

interface QuestionItemProps {
  question: Question;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => {
  // Encontrar la opción seleccionada
  const selectedOption = question.options?.find(
    (opt) => opt.value === question.response
  );
  
  // Determinar color según la respuesta
  let valueColor = 'text-gray-800';
  if (question.response === 'yes') valueColor = 'text-green-600';
  else if (question.response === 'no') valueColor = 'text-red-600';
  else if (question.response === 'partial') valueColor = 'text-yellow-600';
  
  return (
    <li className="p-3 bg-gray-50 rounded-md">
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
          {selectedOption?.description && (
            <span className="text-gray-500 ml-2">
              ({selectedOption.description})
            </span>
          )}
        </div>
        {question.observations && (
          <div className="text-gray-600">
            <span>Observaciones: </span>
            <span>{question.observations}</span>
          </div>
        )}
      </div>
      {question.evidence_url && (
        <div className="mt-2">
          <a 
            href={question.evidence_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Ver evidencia adjunta
          </a>
        </div>
      )}
    </li>
  );
};

export default QuestionItem;