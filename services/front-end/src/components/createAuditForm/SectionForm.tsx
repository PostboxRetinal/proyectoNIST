// SectionForm.tsx
import React, { useState, ChangeEvent } from 'react';
import { Section, Subsection } from './types';
import SubsectionForm from './SubsectionForm';
import SubsectionList from './SubsectionList';
import { useAlerts } from '../alert/AlertContext';

interface SectionFormProps {
  initialSection?: Section;
  onSave: (section: Section) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const SectionForm: React.FC<SectionFormProps> = ({
  initialSection,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const { addAlert } = useAlerts();
  const [section, setSection] = useState<Section>(
    initialSection || {
      section: "",
      title: "",
      subsections: []
    }
  );
  
  const [isAddingSubsection, setIsAddingSubsection] = useState(false);
  const [editingSubsection, setEditingSubsection] = useState<{subsection: Subsection, index: number} | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSection({
      ...section,
      [name]: value
    });
  };

  const handleAddSubsection = (subsection: Subsection) => {
    // Verificar que el ID no exista ya en esta sección
    if (section.subsections.some((s: Subsection) => s.subsection === subsection.subsection)) {
      addAlert('warning', "Ya existe una subsección con este ID en esta sección");
      return;
    }
    
    setSection({
      ...section,
      subsections: [...section.subsections, subsection]
    });
    
    setIsAddingSubsection(false);
    addAlert('success', "Subsección agregada correctamente");
  };

  const handleEditSubsection = (subsection: Subsection, index: number) => {
    setEditingSubsection({ subsection, index });
  };

  const handleSaveEditedSubsection = (editedSubsection: Subsection) => {
    if (!editingSubsection) return;
    
    // Verificar que el ID no esté duplicado, pero ignorar la subsección actual
    const isDuplicate = section.subsections.some((s: Subsection, idx: number) => 
      s.subsection === editedSubsection.subsection && idx !== editingSubsection.index
    );
    
    if (isDuplicate) {
      addAlert('warning', "Ya existe otra subsección con este ID en esta sección");
      return;
    }
    
    const newSubsections = [...section.subsections];
    newSubsections[editingSubsection.index] = editedSubsection;
    
    setSection({
      ...section,
      subsections: newSubsections
    });
    
    setEditingSubsection(null);
    addAlert('success', "Cambios guardados en la subsección");
  };

  const handleDeleteSubsection = (index: number) => {
    const newSubsections = [...section.subsections];
    newSubsections.splice(index, 1);
    setSection({
      ...section,
      subsections: newSubsections
    });
    addAlert('info', "Subsección eliminada");
  };

  const handleSubmit = () => {
    if (section.title.trim() === "") {
      addAlert('error', "El título de la sección no puede estar vacío");
      return;
    }
    
    if (section.subsections.length === 0) {
      addAlert('error', "Debe agregar al menos una subsección a la sección");
      return;
    }
    
    if (section.section.trim() === "") {
      addAlert('error', "El ID de la sección no puede estar vacío");
      return;
    }
    
    onSave(section);
  };

  return (
    <div className="mb-8 p-4 border border-gray-200 rounded-md">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Editar sección" : "Agregar nueva sección"}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID de la sección*
          </label>
          <input
            type="text"
            name="section"
            value={section.section}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej: 1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título de la sección*
          </label>
          <input
            type="text"
            name="title"
            value={section.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej: PLANIFICAR (PLAN)"
            required
          />
        </div>
      </div>
      
      {/* Lista de subsecciones */}
      <SubsectionList 
        subsections={section.subsections} 
        onEdit={handleEditSubsection}
        onDelete={handleDeleteSubsection}
      />
      
      {/* Editar subsección */}
      {editingSubsection && (
        <SubsectionForm 
          initialSubsection={editingSubsection.subsection}
          onSave={handleSaveEditedSubsection}
          onCancel={() => setEditingSubsection(null)}
          isEditing={true}
        />
      )}
      
      {/* Añadir subsección */}
      {isAddingSubsection ? (
        <SubsectionForm 
          onSave={handleAddSubsection}
          onCancel={() => setIsAddingSubsection(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAddingSubsection(true)}
          className="mt-3 px-4 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
        >
          Añadir subsección
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
          disabled={section.title === "" || section.section === "" || section.subsections.length === 0}
        >
          {isEditing ? "Guardar Cambios" : "Guardar sección"}
        </button>
      </div>
    </div>
  );
};

export default SectionForm;