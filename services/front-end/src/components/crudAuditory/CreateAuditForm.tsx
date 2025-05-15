import React, { useState, ChangeEvent } from "react";
import { useAlerts } from '../alert/AlertContext';

// Definición de interfaces

interface Pregunta {
  id: string;
  texto: string;
  tipo: "si_no" | "numerica";
  opciones: string[];
  esObligatoria: boolean;
  editando?: boolean;
}

interface SubSeccion {
  id: string;
  titulo: string;
  preguntas: Pregunta[];
  editando?: boolean;
}

interface Seccion {
  id: string;
  titulo: string;
  subSecciones: SubSeccion[];
  editando?: boolean;
}

interface FormularioData {
  fechaCreacion: string;
  normativa: string;
}

const CreateAuditForm: React.FC = () => {
  const { addAlert } = useAlerts();
  
  // Estado para los datos generales del formulario
  const [formData, setFormData] = useState<FormularioData>({
    fechaCreacion: new Date().toISOString(),
    normativa: ""
  });

  // Estado para las secciones del formulario
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  
  // Estado para la sección actualmente en edición
  const [currentSeccion, setCurrentSeccion] = useState<Seccion>({
    id: "",
    titulo: "",
    subSecciones: []
  });

  // Estado para la sección actualmente en edición
  const [currentSubSeccion, setCurrentSubSeccion] = useState<SubSeccion>({
    id: "",
    titulo: "",
    preguntas: []
  });
  
  // Estado para la pregunta actualmente en edición
  const [currentPregunta, setCurrentPregunta] = useState<Pregunta>({
    id: "",
    texto: "",
    tipo: "si_no",
    opciones: ["Sí", "No", "Parcialmente", "No aplica"],
    esObligatoria: true,
  });
  
  
  // Estado para indicar qué elemento se está editando
  const [editandoSeccion, setEditandoSeccion] = useState<string | null>(null);
  const [editandoSubSeccion, setEditandoSubSeccion] = useState<string | null>(null);
  const [editandoPregunta, setEditandoPregunta] = useState<string | null>(null);
  
  // Manejador para cambios en datos generales
  const handleFormDataChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Manejador para cambios en sección actual
  const handleSeccionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setCurrentSeccion({
      ...currentSeccion,
      [name]: value
    });
  };

  // Manejador para cambios en subSección actual
  const handleSubSeccionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setCurrentSubSeccion({
      ...currentSubSeccion,
      [name]: value
    });
  };
  
  // Manejador para cambios en pregunta actual
  const handlePreguntaChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === "tipo" && value === "numerica") {
      // Si cambia a tipo numérica, actualizamos las opciones automáticamente
      setCurrentPregunta({
        ...currentPregunta,
        tipo: value as "si_no" | "numerica", 
        opciones: ["1", "2", "3", "4", "5"]
      });
    } else if (name === "tipo" && value === "si_no") {
      // Si cambia a tipo si/no, actualizamos las opciones automáticamente
      setCurrentPregunta({
        ...currentPregunta,
        tipo: value as "si_no" | "numerica", 
        opciones: ["Sí", "No", "Parcialmente", "No aplica"]
      });
    } else {
      // Para otros cambios, manejamos checkbox vs. otros tipos
      setCurrentPregunta({
        ...currentPregunta,
        [name]: type === "checkbox" ? checked : 
                (name === "tipo" ? value as "si_no" | "numerica" : value)
      });
    }
  };
  
  
  // Agregar la pregunta actual a la SubSección actual
  const agregarPregunta = (): void => {
    if (currentPregunta.texto.trim() === "") {
      addAlert('error', "El texto de la pregunta no puede estar vacío");
      return;
    }
    
    if (currentPregunta.id.trim() === "") {
      addAlert('error', "El ID de la pregunta no puede estar vacío");
      return;
    }
    
    // Verificar que el ID no exista ya en esta subsección
    if (currentSubSeccion.preguntas.some(p => p.id === currentPregunta.id)) {
      addAlert('warning', "Ya existe una pregunta con este ID en esta subsección");
      return;
    }
    
    setCurrentSubSeccion({
      ...currentSubSeccion,
      preguntas: [...currentSubSeccion.preguntas, { ...currentPregunta }]
    });

    // Resetear la pregunta actual
    setCurrentPregunta({
      id: "",
      texto: "",
      tipo: "si_no",
      opciones: ["Sí", "No", "Parcialmente", "No aplica"],
      esObligatoria: true,
    });
    
    addAlert('success', "Pregunta añadida correctamente");
  };
  
  // Eliminar una pregunta de la subsección actual
  const eliminarPreguntaSubSeccion = (index: number): void => {
    const nuevasPreguntas = [...currentSubSeccion.preguntas];
    nuevasPreguntas.splice(index, 1);
    setCurrentSubSeccion({
      ...currentSubSeccion,
      preguntas: nuevasPreguntas
    });
    addAlert('info', "Pregunta eliminada");
  };
  
  // Agregar la sección actual al formulario
  const agregarSeccion = (): void => {
    if (currentSeccion.titulo.trim() === "") {
      addAlert('error', "El título de la sección no puede estar vacío");
      return;
    }
    
    if (currentSeccion.subSecciones.length === 0) {
      addAlert('error', "Debe agregar al menos una subsección a la sección");
      return;
    }
    
    if (currentSeccion.id.trim() === "") {
      addAlert('error', "El ID de la sección no puede estar vacío");
      return;
    }
    
    // Verificar que el ID no exista ya
    if (secciones.some(s => s.id === currentSeccion.id)) {
      addAlert('warning', "Ya existe una sección con este ID");
      return;
    }
    
    setSecciones([...secciones, { ...currentSeccion }]);
    
    // Resetear la sección actual
    setCurrentSeccion({
      id: "",
      titulo: "",
      subSecciones: []
    });
    
    addAlert('success', "Sección agregada correctamente");
  };
  
  // Eliminar una sección del formulario
  const eliminarSeccion = (index: number): void => {
    const nuevasSecciones = [...secciones];
    nuevasSecciones.splice(index, 1);
    setSecciones(nuevasSecciones);
    addAlert('info', "Sección eliminada");
  };

  // Agregar la subsección actual a la sección actual
  const agregarSubSeccion = (): void => {
    if (currentSubSeccion.titulo.trim() === "") {
      addAlert('error', "El título de la subsección no puede estar vacío");
      return;
    }
    
    if (currentSubSeccion.preguntas.length === 0) {
      addAlert('error', "Debe agregar al menos una pregunta a la subsección");
      return;
    }
    
    if (currentSubSeccion.id.trim() === "") {
      addAlert('error', "El ID de la subsección no puede estar vacío");
      return;
    }
    
    // Verificar que el ID no exista ya en esta sección
    if (currentSeccion.subSecciones.some(s => s.id === currentSubSeccion.id)) {
      addAlert('warning', "Ya existe una subsección con este ID en esta sección");
      return;
    }
    
    setCurrentSeccion({
      ...currentSeccion,
      subSecciones: [...currentSeccion.subSecciones, { ...currentSubSeccion }]
    });
    
    // Resetear la subsección actual
    setCurrentSubSeccion({
      id: "",
      titulo: "",
      preguntas: []
    });
    
    addAlert('success', "Subsección agregada correctamente");
  };

  // Eliminar una subsección de la sección actual
  const eliminarSubSeccion = (index: number): void => {
    const nuevasSubSecciones = [...currentSeccion.subSecciones];
    nuevasSubSecciones.splice(index, 1);
    setCurrentSeccion({
      ...currentSeccion,
      subSecciones: nuevasSubSecciones
    });
    addAlert('info', "Subsección eliminada");
  };

  // Comenzar a editar una sección existente
  const editarSeccion = (seccion: Seccion, index: number): void => {
    setEditandoSeccion(seccion.id);
    
    // Crear una copia temporal de la sección para editar
    const seccionEditada = { ...seccion, editando: true };
    const nuevasSecciones = [...secciones];
    nuevasSecciones[index] = seccionEditada;
    setSecciones(nuevasSecciones);
  };
  
  // Guardar cambios de una sección editada
  const guardarEdicionSeccion = (index: number, nuevosDatos: Partial<Seccion>): void => {
    const nuevasSecciones = [...secciones];
    nuevasSecciones[index] = { 
      ...nuevasSecciones[index], 
      ...nuevosDatos,
      editando: false 
    };
    setSecciones(nuevasSecciones);
    setEditandoSeccion(null);
    
    addAlert('success', "Cambios guardados en la sección");
  };
  
  // Comenzar a editar una subsección existente
  const editarSubSeccion = (seccionIndex: number, subSeccion: SubSeccion, subIndex: number): void => {
    setEditandoSubSeccion(subSeccion.id);
    
    // Crear una copia temporal de la subsección para editar
    const nuevasSecciones = [...secciones];
    const subSeccionEditada = { ...subSeccion, editando: true };
    nuevasSecciones[seccionIndex].subSecciones[subIndex] = subSeccionEditada;
    setSecciones(nuevasSecciones);
  };
  
  // Guardar cambios de una subsección editada
  const guardarEdicionSubSeccion = (seccionIndex: number, subIndex: number, nuevosDatos: Partial<SubSeccion>): void => {
    const nuevasSecciones = [...secciones];
    nuevasSecciones[seccionIndex].subSecciones[subIndex] = {
      ...nuevasSecciones[seccionIndex].subSecciones[subIndex],
      ...nuevosDatos,
      editando: false
    };
    setSecciones(nuevasSecciones);
    setEditandoSubSeccion(null);
    
    addAlert('success', "Cambios guardados en la subsección");
  };
  
  // Comenzar a editar una pregunta existente
  const editarPregunta = (seccionIndex: number, subIndex: number, pregunta: Pregunta, pregIndex: number): void => {
    setEditandoPregunta(pregunta.id);
    
    // Crear una copia temporal de la pregunta para editar
    const nuevasSecciones = [...secciones];
    const preguntaEditada = { ...pregunta, editando: true };
    nuevasSecciones[seccionIndex].subSecciones[subIndex].preguntas[pregIndex] = preguntaEditada;
    setSecciones(nuevasSecciones);
  };
  
  // Guardar cambios de una pregunta editada
  const guardarEdicionPregunta = (seccionIndex: number, subIndex: number, pregIndex: number, nuevosDatos: Partial<Pregunta>): void => {
    const nuevasSecciones = [...secciones];
    nuevasSecciones[seccionIndex].subSecciones[subIndex].preguntas[pregIndex] = {
      ...nuevasSecciones[seccionIndex].subSecciones[subIndex].preguntas[pregIndex],
      ...nuevosDatos,
      editando: false
    };
    setSecciones(nuevasSecciones);
    setEditandoPregunta(null);
    
    addAlert('success', "Cambios guardados en la pregunta");
  };

  // Función para crear un JSON del formulario
  const crearJSON = (): string | null => {
    if (formData.normativa.trim() === "") {
      addAlert('error', "El nombre de la normativa no puede estar vacío");
      return null;
    }
    
    if (secciones.length === 0) {
      addAlert('error', "Debe agregar al menos una sección al formulario");
      return null;
    }
    
    // Crear el nuevo formato de JSON
    const sectionFormat = secciones.map(seccion => {
      return {
        section: seccion.id,
        title: seccion.titulo,
        subsections: seccion.subSecciones.map(subSeccion => {
          return {
            subsection: subSeccion.id,
            title: subSeccion.titulo,
            questions: subSeccion.preguntas.map(pregunta => {
              // Transformar las opciones al formato deseado
              const formattedOptions = pregunta.opciones.map(opcion => {
                let value: string | number = "";
                let description = "";
                
                if (opcion === "Sí") value = "yes";
                else if (opcion === "No") value = "no";
                else if (opcion === "Parcialmente") value = "partial";
                else if (opcion === "No aplica") value = "na";
                else if (pregunta.tipo === "numerica") {
                  // Mapear valores numéricos a los valores solicitados
                  switch (opcion) {
                    case "1": value = 0.2; break;
                    case "2": value = 0.4; break;
                    case "3": value = 0.6; break;
                    case "4": value = 0.8; break;
                    case "5": value = 1; break;
                    default: value = parseFloat(opcion) || 0;
                  }
                }
                
                return {
                  value: value,
                  label: opcion,
                  description: description
                };
              });
              
              return {
                id: pregunta.id,
                text: pregunta.texto,
                options: formattedOptions,
                response: "na", // Valor por defecto
                observations: "",
                evidence_url: ""
              };
            })
          };
        })
      };
    });
    
    const formularioCompleto = {
      ...formData,
      sections: sectionFormat
    };
    
    // Convertir a string JSON con formato
    const jsonString = JSON.stringify(formularioCompleto, null, 2);
    
    return jsonString;
  };


  // Guardar el formulario completo
  const guardarFormulario = (): void => {
    const jsonFormulario = crearJSON();
    
    if (!jsonFormulario) return;
    
    try {
      // Simplemente mostrar el resultado en la consola y guardar en localStorage
      console.log("JSON del formulario:", JSON.parse(jsonFormulario));
      
      // Guardar en localStorage 
      localStorage.setItem('formularioAuditoria', jsonFormulario);
      
      // También guardar en sessionStorage (persistirá solo durante la sesión actual)
      sessionStorage.setItem('formularioAuditoria_reciente', jsonFormulario);
      
      // Mostrar mensaje de éxito
      addAlert('success', "Formulario guardado exitosamente en el almacenamiento local");
    } catch (error) {
      console.error("Error al guardar el formulario:", error);
      addAlert('error', "Error al guardar el formulario");
    }
  };

  // Renderizar el formulario
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Crear Formulario de Auditoría</h1>
      
      {/* Sección de datos generales */}
      <div className="mb-8 p-4 border border-gray-200 rounded-md">
        <h2 className="text-xl font-semibold mb-4">Datos Generales</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la normativa*
            </label>
            <input
              type="text"
              name="normativa"
              value={formData.normativa}
              onChange={handleFormDataChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ej: ISO 9001"
              required
            />
          </div>
        </div>
      </div>
      
      {/* Secciones existentes */}
      {secciones.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Secciones del formulario</h2>
          
          {secciones.map((seccion, sIndex) => (
            <div key={seccion.id} className="mb-4 p-4 border border-gray-200 rounded-md">
              {seccion.editando ? (
                <div className="mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                      <input
                        type="text"
                        value={seccion.id}
                        onChange={(e) => {
                          const nuevasSecciones = [...secciones];
                          nuevasSecciones[sIndex].id = e.target.value;
                          setSecciones(nuevasSecciones);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                      <input
                        type="text"
                        value={seccion.titulo}
                        onChange={(e) => {
                          const nuevasSecciones = [...secciones];
                          nuevasSecciones[sIndex].titulo = e.target.value;
                          setSecciones(nuevasSecciones);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => guardarEdicionSeccion(sIndex, { id: seccion.id, titulo: seccion.titulo })}
                      className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">
                    <span className="text-gray-600 mr-2">{seccion.id}:</span>
                    {seccion.titulo}
                  </h3>
                  <div>
                    <button
                      type="button"
                      onClick={() => editarSeccion(seccion, sIndex)}
                      className="p-1 mr-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminarSeccion(sIndex)}
                      className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
              
              {/* Subsecciones de la sección */}
              {seccion.subSecciones.length > 0 && (
                <div className="ml-4 mt-4">
                  <h4 className="text-md font-medium mb-2">Subsecciones:</h4>
                  {seccion.subSecciones.map((subSeccion, subIndex) => (
                    <div key={subSeccion.id} className="mb-3 p-3 bg-gray-50 rounded-md">
                      {subSeccion.editando ? (
                        <div className="mb-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                              <input
                                type="text"
                                value={subSeccion.id}
                                onChange={(e) => {
                                  const nuevasSecciones = [...secciones];
                                  nuevasSecciones[sIndex].subSecciones[subIndex].id = e.target.value;
                                  setSecciones(nuevasSecciones);
                                }}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                              <input
                                type="text"
                                value={subSeccion.titulo}
                                onChange={(e) => {
                                  const nuevasSecciones = [...secciones];
                                  nuevasSecciones[sIndex].subSecciones[subIndex].titulo = e.target.value;
                                  setSecciones(nuevasSecciones);
                                }}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end mt-2">
                            <button
                              type="button"
                              onClick={() => guardarEdicionSubSeccion(sIndex, subIndex, { id: subSeccion.id, titulo: subSeccion.titulo })}
                              className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                              Guardar Cambios
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-md font-medium">
                            <span className="text-gray-600 mr-2">{subSeccion.id}:</span>
                            {subSeccion.titulo}
                          </h5>
                          <div>
                            <button
                              type="button"
                              onClick={() => editarSubSeccion(sIndex, subSeccion, subIndex)}
                              className="p-1 mr-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                            >
                              Editar
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Preguntas de la subsección */}
                      {subSeccion.preguntas.length > 0 && (
                        <div className="ml-4">
                          <h6 className="text-sm font-medium mb-1">Preguntas:</h6>
                          <ul className="list-disc ml-5">
                            {subSeccion.preguntas.map((pregunta, pregIndex) => (
                              <li key={pregunta.id} className="mb-1">
                                {pregunta.editando ? (
                                  <div className="mb-3 bg-white p-2 rounded border">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                                        <input
                                          type="text"
                                          value={pregunta.id}
                                          onChange={(e) => {
                                            const nuevasSecciones = [...secciones];
                                            nuevasSecciones[sIndex].subSecciones[subIndex].preguntas[pregIndex].id = e.target.value;
                                            setSecciones(nuevasSecciones);
                                          }}
                                          className="w-full p-2 border border-gray-300 rounded-md"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
                                        <input
                                          type="text"
                                          value={pregunta.texto}
                                          onChange={(e) => {
                                            const nuevasSecciones = [...secciones];
                                            nuevasSecciones[sIndex].subSecciones[subIndex].preguntas[pregIndex].texto = e.target.value;
                                            setSecciones(nuevasSecciones);
                                          }}
                                          className="w-full p-2 border border-gray-300 rounded-md"
                                        />
                                      </div>
                                    </div>
                                    <div className="mb-2">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                      <select
                                        value={pregunta.tipo}
                                        onChange={(e) => {
                                          const nuevasSecciones = [...secciones];
                                          const nuevoPregunta = {...nuevasSecciones[sIndex].subSecciones[subIndex].preguntas[pregIndex]};
                                          nuevoPregunta.tipo = e.target.value as "si_no" | "numerica";
                                          
                                          if (e.target.value === "numerica") {
                                            nuevoPregunta.opciones = ["1", "2", "3", "4", "5"];
                                          } else {
                                            nuevoPregunta.opciones = ["Sí", "No", "Parcialmente", "No aplica"];
                                          }
                                          
                                          nuevasSecciones[sIndex].subSecciones[subIndex].preguntas[pregIndex] = nuevoPregunta;
                                          setSecciones(nuevasSecciones);
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                      >
                                        <option value="si_no">Sí/No</option>
                                        <option value="numerica">Numérica (1-5)</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center mb-2">
                                      <input
                                        type="checkbox"
                                        checked={pregunta.esObligatoria}
                                        onChange={(e) => {
                                          const nuevasSecciones = [...secciones];
                                          nuevasSecciones[sIndex].subSecciones[subIndex].preguntas[pregIndex].esObligatoria = e.target.checked;
                                          setSecciones(nuevasSecciones);
                                        }}
                                        className="mr-2"
                                      />
                                      <label className="text-sm font-medium text-gray-700">Es obligatoria</label>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                      <button
                                        type="button"
                                        onClick={() => guardarEdicionPregunta(sIndex, subIndex, pregIndex, {
                                          id: pregunta.id,
                                          texto: pregunta.texto,
                                          tipo: pregunta.tipo,
                                          esObligatoria: pregunta.esObligatoria,
                                          opciones: pregunta.opciones
                                        })}
                                        className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                      >
                                        Guardar Cambios
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <span className="text-gray-600 mr-2">{pregunta.id}:</span>
                                      {pregunta.texto} 
                                      <span className="ml-2 text-sm text-gray-500">
                                        ({pregunta.tipo === "si_no" ? "Sí/No" : "Numérica (1-5)"})
                                      </span>
                                      {pregunta.esObligatoria && <span className="ml-2 text-red-500">*</span>}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => editarPregunta(sIndex, subIndex, pregunta, pregIndex)}
                                      className="p-1 text-xs bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                                    >
                                      Editar
                                    </button>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Agregar nueva sección */}
      <div className="mb-8 p-4 border border-gray-200 rounded-md">
        <h2 className="text-xl font-semibold mb-4">Agregar nueva sección</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID de la sección*
            </label>
            <input
              type="text"
              name="id"
              value={currentSeccion.id}
              onChange={handleSeccionChange}
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
              name="titulo"
              value={currentSeccion.titulo}
              onChange={handleSeccionChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ej: PLANIFICAR (PLAN)"
              required
            />
          </div>
        </div>
        
        {/* Subsecciones existentes en la sección actual */}
        {currentSeccion.subSecciones.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Subsecciones de la sección</h3>
            
            {currentSeccion.subSecciones.map((subSeccion, subIndex) => (
              <div key={subSeccion.id} className="mb-2 p-2 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{subSeccion.id}: {subSeccion.titulo}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminarSubSeccion(subIndex)}
                    className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    Eliminar
                  </button>
                </div>
                
                <div className="mt-1 ml-4">
                  <span className="text-sm text-gray-500">Preguntas: </span>
                  {subSeccion.preguntas.length} preguntas
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Agregar nueva subsección */}
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium mb-2">Agregar nueva subsección</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID de la subsección*
              </label>
              <input
                type="text"
                name="id"
                value={currentSubSeccion.id}
                onChange={handleSubSeccionChange}
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
                name="titulo"
                value={currentSubSeccion.titulo}
                onChange={handleSubSeccionChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: Risk Framing"
                required
              />
            </div>
          </div>
          
          {/* Preguntas existentes en la subsección actual */}
          {currentSubSeccion.preguntas.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">Preguntas de la subsección</h4>
              
              {currentSubSeccion.preguntas.map((pregunta, pIndex) => (
                <div key={pregunta.id} className="mb-2 p-2 bg-gray-100 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{pregunta.id}: {pregunta.texto}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({pregunta.tipo === "si_no" ? "Sí/No" : "Numérica (1-5)"})
                      </span>
                      {pregunta.esObligatoria && <span className="ml-2 text-red-500">*</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarPreguntaSubSeccion(pIndex)}
                      className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      Eliminar
                    </button>
                  </div>
                  
                  {pregunta.opciones.length > 0 && (
                    <div className="mt-1 ml-4">
                      <span className="text-sm text-gray-500">Opciones: </span>
                      {pregunta.opciones.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Agregar nueva pregunta a la subsección */}
          <div className="mb-4 p-3 bg-gray-100 rounded-md">
            <h4 className="text-md font-medium mb-2">Agregar nueva pregunta a la subsección</h4>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID de la pregunta*
              </label>
              <input
                type="text"
                name="id"
                value={currentPregunta.id}
                onChange={handlePreguntaChange}
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
                name="texto"
                value={currentPregunta.texto}
                onChange={handlePreguntaChange}
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
                  value={currentPregunta.tipo}
                  onChange={handlePreguntaChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="si_no">Sí/No</option>
                  <option value="numerica">Numérica (1-5)</option>
                </select>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="esObligatoria"
                  checked={currentPregunta.esObligatoria}
                  onChange={handlePreguntaChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Es pregunta obligatoria
                </span>
              </label>
            </div>
            
            <div className="mt-3">
              <button
                type="button"
                onClick={agregarPregunta}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Agregar pregunta
              </button>
            </div>
          </div>
          
          <div className="mt-3">
            <button
              type="button"
              onClick={agregarSubSeccion}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              disabled={currentSubSeccion.titulo === "" || currentSubSeccion.id === "" || currentSubSeccion.preguntas.length === 0}
            >
              Guardar subsección
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            type="button"
            onClick={agregarSeccion}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={currentSeccion.titulo === "" || currentSeccion.id === "" || currentSeccion.subSecciones.length === 0}
          >
            Guardar sección
          </button>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          onClick={() => {
            // Reiniciar todos los estados a sus valores iniciales
            setFormData({
              fechaCreacion: new Date().toISOString().split('T')[0],
              normativa: ""
            });
            setSecciones([]);
            setCurrentSeccion({
              id: "",
              titulo: "",
              subSecciones: []
            });
            setCurrentSubSeccion({
              id: "",
              titulo: "",
              preguntas: []
            });
            setCurrentPregunta({
              id: "",
              texto: "",
              tipo: "si_no",
              opciones: ["Sí", "No", "Parcialmente", "No aplica"],
              esObligatoria: true
            });
            addAlert('info', "Formulario reiniciado");
          }}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={guardarFormulario}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={secciones.length === 0}
        >
          Guardar formulario
        </button>
      </div>
    </div>
  );
};

export default CreateAuditForm;