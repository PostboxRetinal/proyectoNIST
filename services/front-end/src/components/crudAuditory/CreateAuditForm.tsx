import React, { useState, ChangeEvent } from "react";

// Definición de interfaces

interface Pregunta {
  id: number;
  texto: string;
  tipo: "si_no" | "opcion_multiple" | "texto" | "numerica";
  opciones: string[];
  esObligatoria: boolean;
  valoracion: number;
}

interface Seccion {
  id: number;
  titulo: string;
  descripcion: string;
  preguntas: Pregunta[];
}

interface FormularioData {
  titulo: string;
  descripcion: string;
  normativa: string;
  alcance: string;
  fechaCreacion: string;
}

interface FormularioCompleto extends FormularioData {
  secciones: Seccion[];
}

const CreateAuditForm: React.FC = () => {
  // Estado para los datos generales del formulario
  const [formData, setFormData] = useState<FormularioData>({
    titulo: "",
    descripcion: "",
    normativa: "",
    alcance: "",
    fechaCreacion: new Date().toISOString().split('T')[0]
  });

  // Estado para las secciones del formulario
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  
  // Estado para la sección actualmente en edición
  const [currentSeccion, setCurrentSeccion] = useState<Seccion>({
    id: 0,
    titulo: "",
    descripcion: "",
    preguntas: []
  });
  
  // Estado para la pregunta actualmente en edición
  const [currentPregunta, setCurrentPregunta] = useState<Pregunta>({
    id: 0,
    texto: "",
    tipo: "si_no", // si_no, opcion_multiple, texto, numerica
    opciones: [],
    esObligatoria: true,
    valoracion: 1 // Peso o puntuación de la pregunta
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
  
  // Agregar la pregunta actual a la sección actual
  const agregarPregunta = (): void => {
    if (currentPregunta.texto.trim() === "") {
      alert("El texto de la pregunta no puede estar vacío");
      return;
    }
    
    if (currentPregunta.tipo === "opcion_multiple" && currentPregunta.opciones.length < 2) {
      alert("Debe agregar al menos dos opciones para una pregunta de opción múltiple");
      return;
    }
    
    setCurrentSeccion({
      ...currentSeccion,
      preguntas: [...currentSeccion.preguntas, { ...currentPregunta, id: Date.now() }]
    });
    
    // Resetear la pregunta actual
    setCurrentPregunta({
      id: 0,
      texto: "",
      tipo: "si_no",
      opciones: [],
      esObligatoria: true,
      valoracion: 1
    });
  };
  
  // Eliminar una pregunta de la sección actual
  const eliminarPregunta = (index: number): void => {
    const nuevasPreguntas = [...currentSeccion.preguntas];
    nuevasPreguntas.splice(index, 1);
    setCurrentSeccion({
      ...currentSeccion,
      preguntas: nuevasPreguntas
    });
  };
  
  // Agregar la sección actual al formulario
  const agregarSeccion = (): void => {
    if (currentSeccion.titulo.trim() === "") {
      alert("El título de la sección no puede estar vacío");
      return;
    }
    
    if (currentSeccion.preguntas.length === 0) {
      alert("Debe agregar al menos una pregunta a la sección");
      return;
    }
    
    setSecciones([...secciones, { ...currentSeccion, id: Date.now() }]);
    
    // Resetear la sección actual
    setCurrentSeccion({
      id: 0,
      titulo: "",
      descripcion: "",
      preguntas: []
    });
  };
  
  // Eliminar una sección del formulario
  const eliminarSeccion = (index: number): void => {
    const nuevasSecciones = [...secciones];
    nuevasSecciones.splice(index, 1);
    setSecciones(nuevasSecciones);
  };
  
  // Guardar el formulario completo
  const guardarFormulario = (): void => {
    if (formData.titulo.trim() === "") {
      alert("El título del formulario no puede estar vacío");
      return;
    }
    
    if (formData.normativa.trim() === "") {
      alert("La normativa del formulario no puede estar vacía");
      return;
    }
    
    if (secciones.length === 0) {
      alert("Debe agregar al menos una sección al formulario");
      return;
    }
    
    // Aquí se enviaría el formulario al backend
    const formularioCompleto: FormularioCompleto = {
      ...formData,
      secciones: secciones
    };
    
    console.log("Formulario guardado:", formularioCompleto);
    alert("Formulario guardado exitosamente");
    
    // Redirigir a la página de gestión de formularios
    window.location.href = "/manage-forms";
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
              value={formData.normativa}
              onChange={handleFormDataChange}
              className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: ISO 9001"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleFormDataChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            ></textarea>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alcance
            </label>
            <textarea
              name="alcance"
              value={formData.alcance}
              onChange={handleFormDataChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            ></textarea>
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
                <h3 className="text-lg font-medium">{seccion.titulo}</h3>
                <button
                  type="button"
                  onClick={() => eliminarSeccion(sIndex)}
                  className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                >
                  Eliminar
                </button>
              </div>
              
              {seccion.descripcion && <p className="text-gray-600 mb-3">{seccion.descripcion}</p>}
              
              <div className="ml-4">
                <h4 className="text-md font-medium mb-2">Preguntas:</h4>
                <ul className="list-disc ml-5">
                  {seccion.preguntas.map((pregunta) => (
                    <li key={pregunta.id} className="mb-1">
                      {pregunta.texto} 
                      <span className="text-sm text-gray-500">
                        ({pregunta.tipo === "si_no" ? "Sí/No" : 
                          pregunta.tipo === "opcion_multiple" ? "Opción múltiple" : 
                          pregunta.tipo === "texto" ? "Texto" : "Numérica"})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Agregar nueva sección */}
      <div className="mb-8 p-4 border border-gray-200 rounded-md">
        <h2 className="text-xl font-semibold mb-4">Agregar nueva sección</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título de la sección*
          </label>
          <input
            type="text"
            name="titulo"
            value={currentSeccion.titulo}
            onChange={handleSeccionChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción de la sección
          </label>
          <textarea
            name="descripcion"
            value={currentSeccion.descripcion}
            onChange={handleSeccionChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={2}
          ></textarea>
        </div>
        
        {/* Preguntas existentes en la sección actual */}
        {currentSeccion.preguntas.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Preguntas de la sección</h3>
            
            {currentSeccion.preguntas.map((pregunta, pIndex) => (
              <div key={pregunta.id} className="mb-2 p-2 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{pregunta.texto}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({pregunta.tipo === "si_no" ? "Sí/No" : 
                        pregunta.tipo === "opcion_multiple" ? "Opción múltiple" : 
                        pregunta.tipo === "texto" ? "Texto" : "Numérica"})
                    </span>
                    {pregunta.esObligatoria && <span className="ml-2 text-red-500">*</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminarPregunta(pIndex)}
                    className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    Eliminar
                  </button>
                </div>
                
                {pregunta.tipo === "opcion_multiple" && (
                  <div className="mt-1 ml-4">
                    <span className="text-sm text-gray-500">Opciones: </span>
                    {pregunta.opciones.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Agregar nueva pregunta */}
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium mb-2">Agregar nueva pregunta</h3>
          
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valoración/Peso
              </label>
              <input
                type="number"
                name="valoracion"
                value={currentPregunta.valoracion}
                onChange={handlePreguntaChange}
                min="1"
                max="10"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
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
              Agregar pregunta a la sección
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            type="button"
            onClick={agregarSeccion}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={currentSeccion.preguntas.length === 0}
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
          onClick={() => window.location.href = "/"}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={guardarFormulario}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={secciones.length === 0 || formData.titulo.trim() === "" || formData.normativa.trim() === ""}
        >
          Guardar formulario
        </button>
      </div>
    </div>
  );
};

export default CreateAuditForm;