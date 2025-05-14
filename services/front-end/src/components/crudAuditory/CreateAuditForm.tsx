import React, { useState, ChangeEvent } from "react";

// Definición de interfaces

interface Pregunta {
  id: string;  // Cambiado de number a string para permitir IDs como "1.1.1"
  texto: string;
  tipo: "si_no" | "opcion_multiple" | "texto" | "numerica";
  opciones: string[];
  esObligatoria: boolean;
}

interface SubSeccion {
  id: string;  // Cambiado de number a string para permitir IDs como "1.1"
  titulo: string;
  preguntas: Pregunta[];
}

interface Seccion {
  id: string;  // Cambiado de number a string para permitir IDs como "1"
  titulo: string;
  subSecciones: SubSeccion[];
}

interface FormularioData {
  fechaCreacion: string;
  normativa: string;
}


const CreateAuditForm: React.FC = () => {
  // Estado para los datos generales del formulario
  const [formData, setFormData] = useState<FormularioData>({
    fechaCreacion: new Date().toISOString().split('T')[0],
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
    tipo: "si_no", // si_no, opcion_multiple, texto, numerica
    opciones: ["Sí", "No", "Parcialmente", "No aplica"],
    esObligatoria: true,
  });
  
  // Estado para la opción actual (para preguntas de opción múltiple)
  const [currentOpcion, setCurrentOpcion] = useState<string>("");
  
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
    
    setCurrentPregunta({
      ...currentPregunta,
      [name]: type === "checkbox" ? checked : value
    });
  };
  
  // Agregar una opción a la pregunta actual
  const agregarOpcion = (): void => {
    if (currentOpcion.trim() !== "") {
      setCurrentPregunta({
        ...currentPregunta,
        opciones: [...currentPregunta.opciones, currentOpcion.trim()]
      });
      setCurrentOpcion("");
    }
  };
  
  // Eliminar una opción de la pregunta actual
  const eliminarOpcion = (index: number): void => {
    const nuevasOpciones = [...currentPregunta.opciones];
    nuevasOpciones.splice(index, 1);
    setCurrentPregunta({
      ...currentPregunta,
      opciones: nuevasOpciones
    });
  };
  
  // Agregar la pregunta actual a la SubSección actual
  const agregarPregunta = (): void => {
    if (currentPregunta.texto.trim() === "") {
      alert("El texto de la pregunta no puede estar vacío");
      return;
    }
    
    if (currentPregunta.tipo === "opcion_multiple" && currentPregunta.opciones.length < 2) {
      alert("Debe agregar al menos dos opciones para una pregunta de opción múltiple");
      return;
    }
    
    if (currentPregunta.id.trim() === "") {
      alert("El ID de la pregunta no puede estar vacío");
      return;
    }
    
    // Verificar que el ID no exista ya en esta subsección
    if (currentSubSeccion.preguntas.some(p => p.id === currentPregunta.id)) {
      alert("Ya existe una pregunta con este ID en esta subsección");
      return;
    }
    
    setCurrentSubSeccion({
      ...currentSubSeccion,
      preguntas: [...currentSubSeccion.preguntas, { ...currentPregunta }]
    });

    // Resetear la pregunta actual pero mantener las opciones si ya tenía "No aplica"
    setCurrentPregunta({
      id: "",
      texto: "",
      tipo: "si_no",
      opciones: ["Sí", "No", "Parcialmente", "No aplica"],
      esObligatoria: true,
    });
  };
  
  // Eliminar una pregunta de la subsección actual
  const eliminarPreguntaSubSeccion = (index: number): void => {
    const nuevasPreguntas = [...currentSubSeccion.preguntas];
    nuevasPreguntas.splice(index, 1);
    setCurrentSubSeccion({
      ...currentSubSeccion,
      preguntas: nuevasPreguntas
    });
  };
  
  // Agregar la sección actual al formulario
  const agregarSeccion = (): void => {
    if (currentSeccion.titulo.trim() === "") {
      alert("El título de la sección no puede estar vacío");
      return;
    }
    
    if (currentSeccion.subSecciones.length === 0) {
      alert("Debe agregar al menos una subsección a la sección");
      return;
    }
    
    if (currentSeccion.id.trim() === "") {
      alert("El ID de la sección no puede estar vacío");
      return;
    }
    
    // Verificar que el ID no exista ya
    if (secciones.some(s => s.id === currentSeccion.id)) {
      alert("Ya existe una sección con este ID");
      return;
    }
    
    setSecciones([...secciones, { ...currentSeccion }]);
    
    // Resetear la sección actual
    setCurrentSeccion({
      id: "",
      titulo: "",
      subSecciones: []
    });
  };
  
  // Eliminar una sección del formulario
  const eliminarSeccion = (index: number): void => {
    const nuevasSecciones = [...secciones];
    nuevasSecciones.splice(index, 1);
    setSecciones(nuevasSecciones);
  };

  // Agregar la subsección actual a la sección actual
  const agregarSubSeccion = (): void => {
    if (currentSubSeccion.titulo.trim() === "") {
      alert("El título de la subsección no puede estar vacío");
      return;
    }
    
    if (currentSubSeccion.preguntas.length === 0) {
      alert("Debe agregar al menos una pregunta a la subsección");
      return;
    }
    
    if (currentSubSeccion.id.trim() === "") {
      alert("El ID de la subsección no puede estar vacío");
      return;
    }
    
    // Verificar que el ID no exista ya en esta sección
    if (currentSeccion.subSecciones.some(s => s.id === currentSubSeccion.id)) {
      alert("Ya existe una subsección con este ID en esta sección");
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
  };

  // Eliminar una subsección de la sección actual
  const eliminarSubSeccion = (index: number): void => {
    const nuevasSubSecciones = [...currentSeccion.subSecciones];
    nuevasSubSecciones.splice(index, 1);
    setCurrentSeccion({
      ...currentSeccion,
      subSecciones: nuevasSubSecciones
    });
  };

  // Función para crear un JSON del formulario
  const crearJSON = (): string | null => {

    
    if (secciones.length === 0) {
      alert("Debe agregar al menos una sección al formulario");
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
                let value = "";
                let description = "";
                
                if (opcion === "Sí") value = "yes";
                else if (opcion === "No") value = "no";
                else if (opcion === "Parcialmente") value = "partial";
                else if (opcion === "No aplica") value = "na";
                else value = opcion.toLowerCase().replace(/\s/g, "_");
                
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
    
    // Aquí podrías enviar el jsonFormulario al backend o hacer lo que necesites con él
    console.log("Formulario guardado:", JSON.parse(jsonFormulario));
    alert("Formulario guardado exitosamente");
    
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
              Nombre de la normativa
            </label>
            <input
              type="text"
              name="normativa"
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
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">
                  <span className="text-gray-600 mr-2">{seccion.id}:</span>
                  {seccion.titulo}
                </h3>
                <button
                  type="button"
                  onClick={() => eliminarSeccion(sIndex)}
                  className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                >
                  Eliminar
                </button>
              </div>
              
              {/* Subsecciones de la sección */}
              {seccion.subSecciones.length > 0 && (
                <div className="ml-4 mt-4">
                  <h4 className="text-md font-medium mb-2">Subsecciones:</h4>
                  {seccion.subSecciones.map((subSeccion) => (
                    <div key={subSeccion.id} className="mb-3 p-3 bg-gray-50 rounded-md">
                      <h5 className="text-md font-medium mb-2">
                        <span className="text-gray-600 mr-2">{subSeccion.id}:</span>
                        {subSeccion.titulo}
                      </h5>
                      
                      {/* Preguntas de la subsección */}
                      {subSeccion.preguntas.length > 0 && (
                        <div className="ml-4">
                          <h6 className="text-sm font-medium mb-1">Preguntas:</h6>
                          <ul className="list-disc ml-5">
                            {subSeccion.preguntas.map((pregunta) => (
                              <li key={pregunta.id} className="mb-1">
                                <span className="text-gray-600 mr-2">{pregunta.id}:</span>
                                {pregunta.texto} 
                                <span className="ml-2 text-sm text-gray-500">
                                  ({pregunta.tipo === "si_no" ? "Sí/No" : 
                                    pregunta.tipo === "opcion_multiple" ? "Opción múltiple" : 
                                    pregunta.tipo === "texto" ? "Texto" : "Numérica"})
                                </span>
                                {pregunta.esObligatoria && <span className="ml-2 text-red-500">*</span>}
                                
                                {pregunta.tipo === "opcion_multiple" && pregunta.opciones.length > 0 && (
                                  <div className="mt-1 ml-4 text-xs text-gray-500">
                                    Opciones: {pregunta.opciones.join(", ")}
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
                        ({pregunta.tipo === "si_no" ? "Sí/No" : 
                          pregunta.tipo === "opcion_multiple" ? "Opción múltiple" : 
                          pregunta.tipo === "texto" ? "Texto" : "Numérica"})
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
                  
                  {pregunta.tipo === "opcion_multiple" && pregunta.opciones.length > 0 && (
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
                  <option value="opcion_multiple">Opción múltiple</option>
                  <option value="texto">Texto</option>
                  <option value="numerica">Numérica</option>
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
            
            {/* Opciones para preguntas de opción múltiple */}
            {currentPregunta.tipo === "opcion_multiple" && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opciones
                </label>
                
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={currentOpcion}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentOpcion(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-l-md"
                    placeholder="Nueva opción"
                  />
                  <button
                    type="button"
                    onClick={agregarOpcion}
                    className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                  >
                    Agregar
                  </button>
                </div>
                
                {currentPregunta.opciones.length > 0 && (
                  <div className="ml-2">
                    <p className="text-sm mb-1">Opciones actuales:</p>
                    <ul className="list-disc ml-5">
                      {currentPregunta.opciones.map((opcion, index) => (
                        <li key={index} className="flex items-center mb-1">
                          <span>{opcion}</span>
                          <button
                            type="button"
                            onClick={() => eliminarOpcion(index)}
                            className="ml-2 text-red-500 text-sm hover:text-red-700"
                          >
                            [eliminar]
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
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