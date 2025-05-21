// CreateAuditForm.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from 'axios';
import { useAlerts } from '../alert/AlertContext';

// Importar componentes
import FormGeneralData from './FormGeneralData';
import SectionList from './SectionList';
import SectionForm from './SectionForm';

// Importar tipos
import { FormularioData, Section } from './types';

const CreateAuditForm: React.FC = () => {
  const { addAlert } = useAlerts();
  
  // Estado para los datos generales del formulario
  const [formData, setFormData] = useState<FormularioData>({
    audit: {
      sections: {},
      program: "",
      auditDate: new Date().toISOString(),
    }
  });

  // Estado para las secciones del formulario
  const [secciones, setSecciones] = useState<Section[]>([]);
  
  // Estado para edición de secciones
  const [editingSection, setEditingSection] = useState<{section: Section, index: number} | null>(null);
  
  // Estado para controlar si se está agregando una nueva sección
  const [isAddingSection, setIsAddingSection] = useState(false);
  

  // Función para crear un JSON del formulario
const crearJSON = (): string | null => {
  if (!formData.audit.program || formData.audit.program.trim() === "") {
    addAlert('error', "El nombre de la normativa no puede estar vacío");
    return null;
  }
  
  if (secciones.length === 0) {
    addAlert('error', "Debe agregar al menos una sección al formulario");
    return null;
  }
  
  // Crear el nuevo formato de JSON
  const sectionsArray = secciones.map((seccion: Section) => {
    return {
      section: seccion.section,
      title: seccion.title,
      subsections: seccion.subsections.map(subSeccion => {
        return {
          subsection: subSeccion.subsection,
          title: subSeccion.title,
          questions: subSeccion.questions.map(pregunta => {
            const formattedOptions = pregunta.options.map((opcion) => {
              let value: string;
              const description = opcion.description || "";
              
              if (opcion.value === "Sí") value = "yes";
              else if (opcion.value === "No") value = "no";
              else if (opcion.value === "Parcialmente") value = "partial";
              else if (opcion.value === "No aplica") value = "na";
              else value = opcion.value.toLowerCase();
              
              return {
                value: value,
                label: opcion.label,
                description: description
              };
            });
            
            return {
              id: pregunta.id,
              text: pregunta.text,
              options: formattedOptions,
              response: "na", // Valor por defecto, siempre como string
              observations: "",
              evidence_url: ""
            };
          })
        };
      })
    };
  });
  
  // Cambiado: enviamos directamente el formato esperado por el backend
  const formularioCompleto = {
    program: formData.audit.program,
    date: formData.audit.auditDate,
    sections: sectionsArray
  };
  
  // Convertir a string JSON con formato
  const jsonString = JSON.stringify(formularioCompleto, null, 2);
  
  return jsonString;
};

// Guardar el formulario completo

const guardarFormulario = async (): Promise<void> => {
  const jsonFormulario = crearJSON();
  
  if (!jsonFormulario) return;
  
  try {
    // Parse the JSON string to get the object
    const formularioObj = JSON.parse(jsonFormulario);
    
    // Añadir la propiedad success con valor false explícitamente
    formularioObj.success = false;
    
    console.log("Enviando formulario:", formularioObj);
    
    // Make the API call to save the form
    const response = await axios.post(
      'http://localhost:3000/api/forms/newForm', 
      formularioObj
    );
    
    if (response.status === 200 || response.status === 201) {
      console.log("Formulario guardado exitosamente:", response.data);
      
      // Verificar si la respuesta tiene success=true y mostrar una advertencia
      if (response.data && response.data.success === true) {
        addAlert('warning', "El formulario se guardó, pero el servidor devolvió success:true. Esto podría causar problemas en el flujo del formulario.");
      }
      
      // Opcional: guardar en localStorage para respaldo
      localStorage.setItem('formularioAuditoria', jsonFormulario);
      
      // Mostrar mensaje de éxito
      addAlert('success', "Formulario guardado exitosamente en el servidor");
      
      // Reiniciar el formulario
      setFormData({
        audit: {
          sections: {},
          program: "",
          auditDate: new Date().toISOString()
        }
      });
      setSecciones([]);
    } else {
      console.error("Error al guardar el formulario:", response);
      addAlert('error', `Error al guardar el formulario: ${response.data.message || 'Error en el servidor'}`);
    }
  } catch (error: unknown) {
    console.error("Error al guardar el formulario:", error);
    
    if (error instanceof Error) {
      addAlert('error', `Error: ${error.message}`);
    } else if (typeof error === 'object' && error !== null) {
      const errorObj = error as { 
        response?: { data?: { message?: string }, statusText?: string },
        request?: unknown,
        message?: string
      };
      
      if (errorObj.response) {
        addAlert('error', `Error al guardar el formulario: ${
          errorObj.response.data?.message || errorObj.response.statusText || 'Error en el servidor'
        }`);
      } else if (errorObj.request) {
        addAlert('error', 'Error de conexión con el servidor. Verifique que el servidor esté en ejecución.');
      } else if (errorObj.message) {
        addAlert('error', `Error: ${errorObj.message}`);
      } else {
        addAlert('error', 'Error desconocido al guardar el formulario');
      }
    } else {
      addAlert('error', 'Error desconocido al guardar el formulario');
    }
  }
};
  const handleAddSection = (section: Section) => {
    // Verificar que el ID no exista ya
    if (secciones.some(s => s.section === section.section)) {
      addAlert('warning', "Ya existe una sección con este ID");
      return;
    }
    
    setSecciones([...secciones, section]);
    setIsAddingSection(false);
    addAlert('success', "Sección agregada correctamente");
  };

  const handleEditSection = (section: Section, index: number) => {
    setEditingSection({ section, index });
  };

  const handleSaveEditedSection = (editedSection: Section) => {
    if (!editingSection) return;
    
    // Verificar que el ID no esté duplicado, pero ignorar la sección actual
    const isDuplicate = secciones.some((s, idx) => 
      s.section === editedSection.section && idx !== editingSection.index
    );
    
    if (isDuplicate) {
      addAlert('warning', "Ya existe otra sección con este ID");
      return;
    }
    
    const newSections = [...secciones];
    newSections[editingSection.index] = editedSection;
    
    setSecciones(newSections);
    setEditingSection(null);
    addAlert('success', "Cambios guardados en la sección");
  };

  const handleDeleteSection = (index: number) => {
    const newSections = [...secciones];
    newSections.splice(index, 1);
    setSecciones(newSections);
    addAlert('info', "Sección eliminada");
  };

  // Renderizar el formulario
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Crear Formulario de Auditoría</h1>
      
      {/* Sección de datos generales */}
      <FormGeneralData formData={formData} onChange={setFormData} />
      
      {/* Lista de secciones existentes */}
      <SectionList 
        sections={secciones} 
        onEdit={handleEditSection} 
        onDelete={handleDeleteSection} 
      />
      
      {/* Editar sección existente */}
      {editingSection && (
        <SectionForm 
          initialSection={editingSection.section}
          onSave={handleSaveEditedSection}
          onCancel={() => setEditingSection(null)}
          isEditing={true}
        />
      )}
      
      {/* Añadir nueva sección */}
      {isAddingSection ? (
        <SectionForm 
          onSave={handleAddSection}
          onCancel={() => setIsAddingSection(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAddingSection(true)}
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Agregar nueva sección
        </button>
      )}
      
      {/* Botones de acción */}
      <div className="flex justify-end mt-6 relative">
        <div className="absolute left-2">
          <Link to="/auditoryManagement" className="flex items-center px-2 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 hover:text-blue-600 transition-colors text-sm">
            <ChevronLeft size={18} />
            <span className="ml-1">Volver</span>
          </Link>
        </div>
        <button
          type="button"
          className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          onClick={() => {
            // Reiniciar todos los estados a sus valores iniciales
            setFormData({
              audit: {
                sections: {},
                program: "",
                auditDate: new Date().toISOString(),
              }
            });
            setSecciones([]);
            addAlert('info', "Formulario Limpio");
          }}
        >
          Limpiar Formulario
        </button>
        <button
          type="button"
          onClick={guardarFormulario}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={secciones.length === 0 || !formData.audit.program || formData.audit.program.trim() === ""} 
        >
          Guardar formulario
        </button>
      </div>
    </div>
  );
};

export default CreateAuditForm;