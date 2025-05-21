// QuestionForm.tsx
import React, { useState, ChangeEvent } from 'react';
import { Question } from './types';
import { useAlerts } from '../alert/AlertContext';

interface QuestionFormProps {
  initialQuestion?: Question;
  onSave: (question: Question) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

// Interface for internal state to match our component's expected structure
interface QuestionState {
  id: string;
  text: string;         // Changed from texto to text
  tipo: "si_no";
  options: string[];    // Changed from opciones to options
  descripciones: string[];
  esObligatoria: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ 
  initialQuestion, 
  onSave, 
  onCancel,
  isEditing = false 
}) => {
  const { addAlert } = useAlerts();
  
  // Initialize state with a format conversion from Question to QuestionState if needed
  const [question, setQuestion] = useState<QuestionState>(
    initialQuestion ? 
    {
      id: initialQuestion.id,
      text: initialQuestion.text,
      tipo: "si_no", // Default
      options: initialQuestion.options.map(opt => opt.label),
      descripciones: initialQuestion.options.map(opt => opt.description || ""),
      esObligatoria: initialQuestion.esObligatoria || true
    } :
    {
      id: "",
      text: "",
      tipo: "si_no",
      options: ["Sí", "No", "Parcialmente", "No aplica"],
      descripciones: [
        "Cumplimiento completo", 
        "Sin cumplimiento", 
        "Cumplimiento parcial", 
        ""
      ],
      esObligatoria: true,
    }
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === "tipo") {
      // Si cambia el tipo, actualizamos las opciones automáticamente
      const options = ["Sí", "No", "Parcialmente", "No aplica"];
      const descripciones = [
        "Cumplimiento completo", 
        "Sin cumplimiento", 
        "Cumplimiento parcial", 
        ""
      ];
      
      setQuestion({
        ...question,
        tipo: value as "si_no", 
        options,
        descripciones
      });
    } else if (name.startsWith("descripcion_")) {
      // Manejo de cambios en descripciones individuales
      const index = parseInt(name.split("_")[1]);
      const nuevasDescripciones = [...question.descripciones];
      nuevasDescripciones[index] = value;
      
      setQuestion({
        ...question,
        descripciones: nuevasDescripciones
      });
    } else {
      // Para otros cambios
      setQuestion({
        ...question,
        [name]: type === "checkbox" ? checked : value
      });
    }
  };

  const handleSubmit = () => {
    if (question.text.trim() === "") {
      addAlert('error', "El texto de la pregunta no puede estar vacío");
      return;
    }
    
    if (question.id.trim() === "") {
      addAlert('error', "El ID de la pregunta no puede estar vacío");
      return;
    }
    
    // Convert our internal state format to the Question format expected by the parent component
    const formattedQuestion: Question = {
      id: question.id,
      text: question.text,
      options: question.options.map((label: string, index: number) => ({
        value: label === "Sí" ? "yes" : 
               label === "No" ? "no" : 
               label === "Parcialmente" ? "partial" : 
               label === "No aplica" ? "na" : label.toLowerCase(),
        label,
        description: question.descripciones[index] || ""
      })),
      response: null,
      observations: "",
      evidence_url: "",
      esObligatoria: question.esObligatoria
    };
    
    onSave(formattedQuestion);
  };

  return (
    <div className="p-3 bg-gray-100 rounded-md mb-4">
      <h4 className="text-md font-medium mb-2">
        {isEditing ? "Editar pregunta" : "Agregar nueva pregunta"}
      </h4>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID de la pregunta*
        </label>
        <input
          type="text"
          name="id"
          value={question.id}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Ej: 1.1.1"
          required
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Texto de la pregunta*
        </label>
        <input
          type="text"
          name="text"
          value={question.text}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de pregunta
          </label>
          <select
            name="tipo"
            value={question.tipo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="si_no">Sí/No</option>
          </select>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripciones de las opciones
        </label>
        <div className="space-y-2">
          {question.options.map((opcion: string, index: number) => (
            <div key={index} className="flex items-center">
              <span className="w-24 text-sm font-medium text-gray-700">{opcion}:</span>
              <input
                type="text"
                name={`descripcion_${index}`}
                value={question.descripciones[index] || ''}
                onChange={handleChange}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder={`Descripción para "${opcion}"`}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="esObligatoria"
            checked={question.esObligatoria}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            Es pregunta obligatoria
          </span>
        </label>
      </div>
      
      <div className="flex justify-end mt-3 space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          {isEditing ? "Guardar Cambios" : "Agregar pregunta"}
        </button>
      </div>
    </div>
  );
};

export default QuestionForm;