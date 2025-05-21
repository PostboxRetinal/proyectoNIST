// SubsectionForm.tsx
import React, { useState, ChangeEvent } from 'react';
import { Subsection, Question } from './types';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';
import { useAlerts } from '../alert/AlertContext';

interface SubsectionFormProps {
  initialSubsection?: Subsection;
  onSave: (subsection: Subsection) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const SubsectionForm: React.FC<SubsectionFormProps> = ({
  initialSubsection,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const { addAlert } = useAlerts();
  const [subsection, setSubsection] = useState<Subsection>(
    initialSubsection || {
      subsection: "",
      title: "",
      questions: []
    }
  );
  
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{question: Question, index: number} | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubsection({
      ...subsection,
      [name]: value
    });
  };

  const handleAddQuestion = (question: Question) => {
    // Verificar que el ID no exista ya en esta subsección
    if (subsection.questions.some((p: Question) => p.id === question.id)) {
      addAlert('warning', "Ya existe una pregunta con este ID en esta subsección");
      return;
    }
    
    setSubsection({
      ...subsection,
      questions: [...subsection.questions, question]
    });
    
    setIsAddingQuestion(false);
    addAlert('success', "Pregunta añadida correctamente");
  };

  const handleEditQuestion = (question: Question, index: number) => {
    setEditingQuestion({ question, index });
  };

  const handleSaveEditedQuestion = (editedQuestion: Question) => {
    if (!editingQuestion) return;
    
    // Verificar que el ID no esté duplicado, pero ignorar la pregunta actual
    const isDuplicate = subsection.questions.some((p: Question, idx: number) => 
      p.id === editedQuestion.id && idx !== editingQuestion.index
    );
    
    if (isDuplicate) {
      addAlert('warning', "Ya existe otra pregunta con este ID en esta subsección");
      return;
    }
    
    const newQuestions = [...subsection.questions];
    newQuestions[editingQuestion.index] = editedQuestion;
    
    setSubsection({
      ...subsection,
      questions: newQuestions
    });
    
    setEditingQuestion(null);
    addAlert('success', "Cambios guardados en la pregunta");
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...subsection.questions];
    newQuestions.splice(index, 1);
    setSubsection({
      ...subsection,
      questions: newQuestions
    });
    addAlert('info', "Pregunta eliminada");
  };

  const handleSubmit = () => {
    if (subsection.title.trim() === "") {
      addAlert('error', "El título de la subsección no puede estar vacío");
      return;
    }
    
    if (subsection.questions.length === 0) {
      addAlert('error', "Debe agregar al menos una pregunta a la subsección");
      return;
    }
    
    if (subsection.subsection.trim() === "") {
      addAlert('error', "El ID de la subsección no puede estar vacío");
      return;
    }
    
    onSave(subsection);
  };

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-md">
      <h3 className="text-lg font-medium mb-2">
        {isEditing ? "Editar subsección" : "Agregar nueva subsección"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID de la subsección*
          </label>
          <input
            type="text"
            name="subsection"
            value={subsection.subsection}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej: 1.1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título de la subsección*
          </label>
          <input
            type="text"
            name="title"
            value={subsection.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej: Risk Framing"
            required
          />
        </div>
      </div>
      
      {/* Lista de preguntas */}
      <QuestionList 
        questions={subsection.questions} 
        onEdit={handleEditQuestion}
        onDelete={handleDeleteQuestion}
      />
      
      {/* Editar pregunta */}
      {editingQuestion && (
        <QuestionForm 
          initialQuestion={editingQuestion.question}
          onSave={handleSaveEditedQuestion}
          onCancel={() => setEditingQuestion(null)}
          isEditing={true}
        />
      )}
      
      {/* Añadir pregunta */}
      {isAddingQuestion ? (
        <QuestionForm 
          onSave={handleAddQuestion}
          onCancel={() => setIsAddingQuestion(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAddingQuestion(true)}
          className="mt-3 px-4 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
        >
          Añadir pregunta
        </button>
      )}
      
      {/* Botones de acción */}
      <div className="flex justify-end mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          disabled={subsection.title === "" || subsection.subsection === "" || subsection.questions.length === 0}
        >
          {isEditing ? "Guardar Cambios" : "Guardar subsección"}
        </button>
      </div>
    </div>
  );
};

export default SubsectionForm;