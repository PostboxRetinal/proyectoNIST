import React, { useState, ChangeEvent } from "react";
import { useAlerts } from '../alert/AlertContext';
import { ChevronLeft} from "lucide-react";
import { Link } from "react-router-dom";
import axios from 'axios';

// Definición de interfaces
// Primero, actualiza la interfaz Pregunta para incluir descripciones para cada opción

interface Pregunta {
  id: string;
  texto: string;
  tipo: "si_no" | "numerica";
  opciones: string[];
  descripciones: string[]; // Nueva propiedad para almacenar descripciones
  esObligatoria: boolean;
}
interface SubSeccion {
  id: string;
  titulo: string;
  preguntas: Pregunta[];
}

interface Seccion {
  id: string;
  titulo: string;
  subSecciones: SubSeccion[];
}

interface FormularioData {
   fechaCreacion: string;
  program: string;
  config: {
    nistThresholds: {
      lowRisk: number;
      mediumRisk: number;
    }
  };
  
}

const CreateAuditForm: React.FC = () => {
  const { addAlert } = useAlerts();
  
  // Estado para los datos generales del formulario
  const [formData, setFormData] = useState<FormularioData>({
    fechaCreacion: new Date().toISOString(),
    program: "",
    config: {
      nistThresholds: {
        lowRisk: 80,
        mediumRisk: 50
      }
    }
  });

  // Estado para las secciones del formulario
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  
  // Estado para la sección actualmente en creación
  const [currentSeccion, setCurrentSeccion] = useState<Seccion>({
    id: "",
    titulo: "",
    subSecciones: []
  });

  // Estado para la subsección actualmente en creación
  const [currentSubSeccion, setCurrentSubSeccion] = useState<SubSeccion>({
    id: "",
    titulo: "",
    preguntas: []
  });
  
  // Estado para la pregunta actualmente en creación
    // Actualiza la inicialización del estado currentPregunta para incluir descripciones
  const [currentPregunta, setCurrentPregunta] = useState<Pregunta>({
    id: "",
    texto: "",
    tipo: "si_no",
    opciones: ["Sí", "No", "Parcialmente", "No aplica"],
    descripciones: [
      "Cumplimiento completo", 
      "Sin cumplimiento", 
      "Cumplimiento parcial", 
      "No aplicable a este contexto"
    ],
    esObligatoria: true,
  });
  
  // Estados para edición (separados de los de creación)
  const [seccionEnEdicion, setSeccionEnEdicion] = useState<Seccion | null>(null);
  const [subSeccionEnEdicion, setSubSeccionEnEdicion] = useState<SubSeccion | null>(null);
  const [preguntaEnEdicion, setPreguntaEnEdicion] = useState<Pregunta | null>(null);
  
  // Estados para indicar qué se está editando (IDs)
  const [editandoSeccionId, setEditandoSeccionId] = useState<string | null>(null);
  const [editandoSubSeccionId, setEditandoSubSeccionId] = useState<string | null>(null);
  const [editandoPreguntaId, setEditandoPreguntaId] = useState<string | null>(null);

  // Manejador para cambios en datos generales
  const handleFormDataChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Manejador para cambios en sección actual (creación)
  const handleSeccionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setCurrentSeccion({
      ...currentSeccion,
      [name]: value
    });
  };

  // Manejador para cambios en subsección actual (creación)
  const handleSubSeccionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setCurrentSubSeccion({
      ...currentSubSeccion,
      [name]: value
    });
  };
  
  // Manejador para cambios en pregunta actual (creación)
  const handlePreguntaChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
        // Modifica la parte donde se manejan los cambios en el tipo de pregunta (línea 78 aproximadamente)
    
        // Actualización del handlePreguntaChange
    if (name === "tipo") {
      // Si cambia el tipo, actualizamos las opciones y descripciones automáticamente
      let opciones = [];
      let descripciones = [];
      
      if (value === "numerica") {
        opciones = ["Sí", "Parcialmente", "No", "No aplica"];
        descripciones = [
          "Cumplimiento completo", 
          "Cumplimiento parcial", 
          "Sin cumplimiento", 
          "No aplicable a este contexto"
        ];
      } else {
        opciones = ["Sí", "No", "Parcialmente", "No aplica"];
        descripciones = [
          "Cumplimiento completo", 
          "Sin cumplimiento", 
          "Cumplimiento parcial", 
          "No aplicable a este contexto"
        ];
      }
      
      setCurrentPregunta({
        ...currentPregunta,
        tipo: value as "si_no" | "numerica", 
        opciones,
        descripciones
      });
    } else {
      // Para otros cambios
      setCurrentPregunta({
        ...currentPregunta,
        [name]: type === "checkbox" ? checked : value
      });
    }
  };
  
  // Manejadores para cambios en elementos en edición
  const handleSeccionEnEdicionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    if (seccionEnEdicion) {
      setSeccionEnEdicion({
        ...seccionEnEdicion,
        [name]: value
      });
    }
  };

  const handleSubSeccionEnEdicionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    if (subSeccionEnEdicion) {
      setSubSeccionEnEdicion({
        ...subSeccionEnEdicion,
        [name]: value
      });
    }
  };

  const handlePreguntaEnEdicionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (!preguntaEnEdicion) return;
    
        if (name === "tipo") {
      let opciones = [];
      let descripciones = [];
      
      if (value === "numerica") {
        opciones = ["Sí", "Parcialmente", "No", "No aplica"];
        descripciones = [
          "Cumplimiento completo", 
          "Cumplimiento parcial", 
          "Sin cumplimiento", 
          "No aplicable a este contexto"
        ];
      } else {
        opciones = ["Sí", "No", "Parcialmente", "No aplica"];
        descripciones = [
          "Cumplimiento completo", 
          "Sin cumplimiento", 
          "Cumplimiento parcial", 
          "No aplicable a este contexto"
        ];
      }
      
      setPreguntaEnEdicion({
        ...preguntaEnEdicion,
        tipo: value as "si_no" | "numerica",
        opciones,
        descripciones
      });
    } else {
      setPreguntaEnEdicion({
        ...preguntaEnEdicion,
        [name]: type === "checkbox" ? checked : value
      });
    }
  };
  
  // Agregar la pregunta actual a la subsección actual (creación)
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
        // En el botón "Limpiar Formulario"
    setCurrentPregunta({
      id: "",
      texto: "",
      tipo: "si_no",
      opciones: ["Sí", "No", "Parcialmente", "No aplica"],
      descripciones: [
        "Cumplimiento completo", 
        "Sin cumplimiento", 
        "Cumplimiento parcial", 
        "No aplicable a este contexto"
      ],
      esObligatoria: true
    });
    
    addAlert('success', "Pregunta añadida correctamente");
  };
  
  // Eliminar una pregunta de la subsección actual (creación)
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

  // Agregar la subsección actual a la sección actual (creación)
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

  // Eliminar una subsección de la sección actual (creación)
  const eliminarSubSeccion = (index: number): void => {
    const nuevasSubSecciones = [...currentSeccion.subSecciones];
    nuevasSubSecciones.splice(index, 1);
    setCurrentSeccion({
      ...currentSeccion,
      subSecciones: nuevasSubSecciones
    });
    addAlert('info', "Subsección eliminada");
  };

  // Comenzar a editar una sección guardada
  const editarSeccion = (seccion: Seccion, index: number): void => {
    setEditandoSeccionId(seccion.id);
    setSeccionEnEdicion({...seccion});
  };
  
  // Guardar cambios de una sección editada
  const guardarEdicionSeccion = (index: number): void => {
    if (!seccionEnEdicion) return;
    
    const nuevasSecciones = [...secciones];
    nuevasSecciones[index] = { ...seccionEnEdicion };
    setSecciones(nuevasSecciones);
    
    setEditandoSeccionId(null);
    setSeccionEnEdicion(null);
    
    addAlert('success', "Cambios guardados en la sección");
  };
  
  // Comenzar a editar una subsección guardada
  const editarSubSeccion = (seccionIndex: number, subSeccion: SubSeccion, subIndex: number): void => {
    setEditandoSubSeccionId(subSeccion.id);
    setSubSeccionEnEdicion({...subSeccion});
  };
  
  // Guardar cambios de una subsección editada (de una sección guardada)
  const guardarEdicionSubSeccion = (seccionIndex: number, subIndex: number): void => {
    if (!subSeccionEnEdicion) return;
    
    const nuevasSecciones = [...secciones];
    nuevasSecciones[seccionIndex].subSecciones[subIndex] = { ...subSeccionEnEdicion };
    setSecciones(nuevasSecciones);
    
    setEditandoSubSeccionId(null);
    setSubSeccionEnEdicion(null);
    
    addAlert('success', "Cambios guardados en la subsección");
  };
  
  // Comenzar a editar una pregunta guardada (de una sección guardada)
  const editarPregunta = (seccionIndex: number, subIndex: number, pregunta: Pregunta, pregIndex: number): void => {
    setEditandoPreguntaId(pregunta.id);
    setPreguntaEnEdicion({...pregunta});
  };
  
  // Guardar cambios de una pregunta editada (de una sección guardada)
  const guardarEdicionPregunta = (seccionIndex: number, subIndex: number, pregIndex: number): void => {
    if (!preguntaEnEdicion) return;
    
    const nuevasSecciones = [...secciones];
    nuevasSecciones[seccionIndex].subSecciones[subIndex].preguntas[pregIndex] = { ...preguntaEnEdicion };
    setSecciones(nuevasSecciones);
    
    setEditandoPreguntaId(null);
    setPreguntaEnEdicion(null);
    
    addAlert('success', "Cambios guardados en la pregunta");
  };

  // Editar una pregunta de una subsección en creación
  const editarPreguntaCreacion = (pregunta: Pregunta, index: number): void => {
    setEditandoPreguntaId(pregunta.id);
    setPreguntaEnEdicion({...pregunta});
  };
  
  // Guardar cambios de una pregunta editada (de una subsección en creación)
  const guardarEdicionPreguntaCreacion = (index: number): void => {
    if (!preguntaEnEdicion) return;
    
    const nuevasPreguntas = [...currentSubSeccion.preguntas];
    nuevasPreguntas[index] = { ...preguntaEnEdicion };
    setCurrentSubSeccion({
      ...currentSubSeccion,
      preguntas: nuevasPreguntas
    });
    
    setEditandoPreguntaId(null);
    setPreguntaEnEdicion(null);
    
    addAlert('success', "Cambios guardados en la pregunta");
  };

  // Editar una subsección de la sección en creación
  const editarSubSeccionCreacion = (subSeccion: SubSeccion, index: number): void => {
    setEditandoSubSeccionId(subSeccion.id);
    setSubSeccionEnEdicion({...subSeccion});
  };
  
  // Guardar cambios de una subsección editada (de la sección en creación)
  const guardarEdicionSubSeccionCreacion = (index: number): void => {
    if (!subSeccionEnEdicion) return;
    
    const nuevasSubSecciones = [...currentSeccion.subSecciones];
    nuevasSubSecciones[index] = { ...subSeccionEnEdicion };
    setCurrentSeccion({
      ...currentSeccion,
      subSecciones: nuevasSubSecciones
    });
    
    setEditandoSubSeccionId(null);
    setSubSeccionEnEdicion(null);
    
    addAlert('success', "Cambios guardados en la subsección");
  };

  // Función para crear un JSON del formulario
  const crearJSON = (): string | null => {
    if (formData.program.trim() === "") {
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
                            // Reemplaza la sección de transformación de opciones en la función crearJSON (aproximadamente línea 453)
              
              // Transformar las opciones al formato deseado
              const formattedOptions = pregunta.opciones.map(opcion => {
                let value: string | number = "";
                let description = "";
                
                if (pregunta.tipo === "numerica") {
                  // Nuevo mapeo para preguntas numéricas según lo solicitado
                  switch (opcion) {
                    case "Sí": 
                      value = 1;
                      description = "Cumplimiento completo"; 
                      break;
                    case "Parcialmente": 
                      value = 0.5;
                      description = "Cumplimiento parcial"; 
                      break;
                    case "No": 
                      value = 0;
                      description = "Sin cumplimiento"; 
                      break;
                    case "No aplica": 
                      value = "na";
                      description = "No aplicable a este contexto"; 
                      break;
                    default: 
                      value = parseFloat(opcion) || 0;
                  }
                } else {
                  // Para preguntas si/no tradicionales mantenemos el comportamiento actual
                  if (opcion === "Sí") {
                    value = "yes";
                    description = "Cumplimiento completo";
                  } else if (opcion === "No") {
                    value = "no";
                    description = "Sin cumplimiento";
                  } else if (opcion === "Parcialmente") {
                    value = "partial";
                    description = "Cumplimiento parcial";
                  } else if (opcion === "No aplica") {
                    value = "na";
                    description = "No aplicable a este contexto";
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
  const guardarFormulario = async (): Promise<void> => {
    const jsonFormulario = crearJSON();
    
    if (!jsonFormulario) return;
    
    try {
      // Parse the JSON string to get the object
      const formularioObj = JSON.parse(jsonFormulario);
      
      // Make the API call to save the form
      const response = await axios.post(
        'http://localhost:3000/api/forms/newForm', 
        formularioObj
      );
      
      if (response.status === 200 || response.status === 201) {
        console.log("Formulario guardado exitosamente:", response.data);
        
        // Opcional: guardar en localStorage para respaldo
        localStorage.setItem('formularioAuditoria', jsonFormulario);
        
        // Mostrar mensaje de éxito
        addAlert('success', "Formulario guardado exitosamente en el servidor");
      setFormData({
        fechaCreacion: new Date().toISOString(),
        program: "",
        config: {
          nistThresholds: {
            lowRisk: 80,
            mediumRisk: 50
          }
        }
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
            // En la función agregarPregunta, actualizar el reseteo
      setCurrentPregunta({
        id: "",
        texto: "",
        tipo: "si_no",
        opciones: ["Sí", "No", "Parcialmente", "No aplica"],
        descripciones: [
          "Cumplimiento completo", 
          "Sin cumplimiento", 
          "Cumplimiento parcial", 
          "No aplicable a este contexto"
        ],
        esObligatoria: true,
      });
      
      // Limpiar también los estados de edición por si acaso
      setSeccionEnEdicion(null);
      setSubSeccionEnEdicion(null);
      setPreguntaEnEdicion(null);
      setEditandoSeccionId(null);
      setEditandoSubSeccionId(null);
      setEditandoPreguntaId(null);
      } else {
        console.error("Error al guardar el formulario:", response);
        addAlert('error', `Error al guardar el formulario: ${response.data.message || 'Error en el servidor'}`);
      }
    } catch (error: any) {
      console.error("Error al guardar el formulario:", error);
      
      if (error.response) {
        // El servidor respondió con un código de error
        addAlert('error', `Error al guardar el formulario: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        addAlert('error', 'Error de conexión con el servidor. Verifique que el servidor esté en ejecución.');
      } else {
        // Otros errores
        addAlert('error', `Error: ${error.message}`);
      }
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
                Nombre de la Normativa*
              </label>
              <input
                type="text"
                name="program"
                value={formData.program}
                onChange={handleFormDataChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: ISO 9001"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t pt-4 border-gray-200">
          <h3 className="text-md font-semibold mb-2">Umbrales de Riesgo</h3>
          <div className="text-sm text-gray-600 mb-3">
            Los umbrales determinan cómo se clasifican los resultados de la evaluación:
          </div>
          <ul className="list-disc ml-5 mb-3 text-sm text-gray-600">
            <li>Por encima del umbral de <strong>Riesgo Bajo</strong>: Se considera bajo riesgo (color verde)</li>
            <li>Entre ambos umbrales: Se considera riesgo medio (color amarillo)</li>
            <li>Por debajo del umbral de <strong>Riesgo Medio</strong>: Se considera alto riesgo (color rojo)</li>
          </ul>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Umbral de Riesgo Bajo (%)
              </label>
              <input
                type="number"
                value={formData.config.nistThresholds.lowRisk}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    nistThresholds: {
                      ...formData.config.nistThresholds,
                      lowRisk: parseInt(e.target.value) || 80
                    }
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Umbral de Riesgo Medio (%)
              </label>
              <input
                type="number"
                value={formData.config.nistThresholds.mediumRisk}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    nistThresholds: {
                      ...formData.config.nistThresholds,
                      mediumRisk: parseInt(e.target.value) || 50
                    }
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="0"
                max="100"
              />
            </div>
          </div>
          
          <div className="mt-2 flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600 mr-3">≥ {formData.config.nistThresholds.lowRisk}%</span>
            
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600 mr-3">{formData.config.nistThresholds.mediumRisk}% - {formData.config.nistThresholds.lowRisk - 1}%</span>
            
            <div className="w-4 h-4 bg-red-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600"> {formData.config.nistThresholds.mediumRisk}%</span>
          </div>
        </div>
  
        {/* Secciones existentes */}
        {secciones.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Secciones del formulario</h2>
            
            {secciones.map((seccion, sIndex) => (
              <div key={seccion.id} className="mb-4 p-4 border border-gray-200 rounded-md">
                {editandoSeccionId === seccion.id && seccionEnEdicion ? (
                  <div className="mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                        <input
                          type="text"
                          name="id"
                          value={seccionEnEdicion.id}
                          onChange={handleSeccionEnEdicionChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                          type="text"
                          name="titulo"
                          value={seccionEnEdicion.titulo}
                          onChange={handleSeccionEnEdicionChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => guardarEdicionSeccion(sIndex)}
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
                        {editandoSubSeccionId === subSeccion.id && subSeccionEnEdicion ? (
                          <div className="mb-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                                <input
                                  type="text"
                                  name="id"
                                  value={subSeccionEnEdicion.id}
                                  onChange={handleSubSeccionEnEdicionChange}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                  type="text"
                                  name="titulo"
                                  value={subSeccionEnEdicion.titulo}
                                  onChange={handleSubSeccionEnEdicionChange}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end mt-2">
                              <button
                                type="button"
                                onClick={() => guardarEdicionSubSeccion(sIndex, subIndex)}
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
                                  {editandoPreguntaId === pregunta.id && preguntaEnEdicion ? (
                                    <div className="mb-3 bg-white p-2 rounded border">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                                          <input
                                            type="text"
                                            name="id"
                                            value={preguntaEnEdicion.id}
                                            onChange={handlePreguntaEnEdicionChange}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
                                          <input
                                            type="text"
                                            name="texto"
                                            value={preguntaEnEdicion.texto}
                                            onChange={handlePreguntaEnEdicionChange}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                          />
                                        </div>
                                      </div>
                                      <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                        <select
                                          name="tipo"
                                          value={preguntaEnEdicion.tipo}
                                          onChange={handlePreguntaEnEdicionChange}
                                          className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                          <option value="si_no">Sí/No</option>
                                          <option value="numerica">Numérica (1-5)</option>
                                        </select>
                                      </div>
                                      
                                      {/* Agregar descripciones para cada opción */}
                                      <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción para cada opción</label>
                                        <div className="space-y-2">
                                          {preguntaEnEdicion.opciones.map((opcion, index) => (
                                            <div key={index} className="flex items-center">
                                              <span className="inline-block w-24 font-medium">{opcion}:</span>
                                              <input
                                                type="text"
                                                value={preguntaEnEdicion.descripciones?.[index] || ""}
                                                onChange={(e) => {
                                                  const newDescripciones = [...(preguntaEnEdicion.descripciones || [])];
                                                  while (newDescripciones.length < preguntaEnEdicion.opciones.length) {
                                                    newDescripciones.push("");
                                                  }
                                                  newDescripciones[index] = e.target.value;
                                                  setPreguntaEnEdicion({
                                                    ...preguntaEnEdicion,
                                                    descripciones: newDescripciones
                                                  });
                                                }}
                                                className="flex-1 p-2 border border-gray-300 rounded-md"
                                                placeholder={`Descripción para "${opcion}"`}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center mb-2">
                                        <input
                                          type="checkbox"
                                          name="esObligatoria"
                                          checked={preguntaEnEdicion.esObligatoria}
                                          onChange={handlePreguntaEnEdicionChange}
                                          className="mr-2"
                                        />
                                        <label className="text-sm font-medium text-gray-700">Es obligatoria</label>
                                      </div>
                                      <div className="flex justify-end mt-2">
                                        <button
                                          type="button"
                                          onClick={() => guardarEdicionPregunta(sIndex, subIndex, pregIndex)}
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
                    <div>
                      <button
                        type="button"
                        onClick={() => editarSubSeccionCreacion(subSeccion, subIndex)}
                        className="p-1 mr-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminarSubSeccion(subIndex)}
                        className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  
                  {/* Mostrar editor de subsección si está en modo edición */}
                  {editandoSubSeccionId === subSeccion.id && subSeccionEnEdicion && (
                    <div className="mt-3 p-3 bg-gray-100 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                          <input
                            type="text"
                            name="id"
                            value={subSeccionEnEdicion.id}
                            onChange={handleSubSeccionEnEdicionChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                          <input
                            type="text"
                            name="titulo"
                            value={subSeccionEnEdicion.titulo}
                            onChange={handleSubSeccionEnEdicionChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => guardarEdicionSubSeccionCreacion(subIndex)}
                          className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Guardar Cambios
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-1 ml-4">
                    <span className="text-sm text-gray-500">Preguntas: </span>
                    {subSeccion.preguntas.length} preguntas
                    
                    {/* Mostrar lista de preguntas con botón de editar */}
                    {subSeccion.preguntas.length > 0 && (
                      <ul className="mt-2 ml-2">
                        {subSeccion.preguntas.map((pregunta, pregIndex) => (
                          <li key={pregunta.id} className="mb-2 p-2 bg-gray-100 rounded-md">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">{pregunta.id}: {pregunta.texto}</span>
                                <span className="ml-2 text-sm text-gray-500">
                                  ({pregunta.tipo === "si_no" ? "Sí/No" : "Numérica (1-5)"})
                                </span>
                                {pregunta.esObligatoria && <span className="ml-2 text-red-500">*</span>}
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => editarPreguntaCreacion(pregunta, pregIndex)}
                                  className="p-1 mr-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-xs"
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => eliminarPreguntaSubSeccion(pregIndex)}
                                  className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-xs"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                            
                            {/* Mostrar editor de pregunta si está en modo edición */}
                            {editandoPreguntaId === pregunta.id && preguntaEnEdicion && (
                              <div className="mt-3 p-3 bg-white rounded-md border">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                                    <input
                                      type="text"
                                      name="id"
                                      value={preguntaEnEdicion.id}
                                      onChange={handlePreguntaEnEdicionChange}
                                      className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
                                    <input
                                      type="text"
                                      name="texto"
                                      value={preguntaEnEdicion.texto}
                                      onChange={handlePreguntaEnEdicionChange}
                                      className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                  </div>
                                </div>
                                <div className="mb-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                  <select
                                    name="tipo"
                                    value={preguntaEnEdicion.tipo}
                                    onChange={handlePreguntaEnEdicionChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                  >
                                    <option value="si_no">Sí/No</option>
                                    <option value="numerica">Numérica (1-5)</option>
                                  </select>
                                </div>
                                
                                {/* Agregar descripciones para cada opción */}
                                <div className="mb-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción para cada opción</label>
                                  <div className="space-y-2">
                                    {preguntaEnEdicion.opciones.map((opcion, index) => (
                                      <div key={index} className="flex items-center">
                                        <span className="inline-block w-24 font-medium">{opcion}:</span>
                                        <input
                                          type="text"
                                          value={preguntaEnEdicion.descripciones?.[index] || ""}
                                          onChange={(e) => {
                                            const newDescripciones = [...(preguntaEnEdicion.descripciones || [])];
                                            while (newDescripciones.length < preguntaEnEdicion.opciones.length) {
                                              newDescripciones.push("");
                                            }
                                            newDescripciones[index] = e.target.value;
                                            setPreguntaEnEdicion({
                                              ...preguntaEnEdicion,
                                              descripciones: newDescripciones
                                            });
                                          }}
                                          className="flex-1 p-2 border border-gray-300 rounded-md"
                                          placeholder={`Descripción para "${opcion}"`}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="flex items-center mb-2">
                                  <input
                                    type="checkbox"
                                    name="esObligatoria"
                                    checked={preguntaEnEdicion.esObligatoria}
                                    onChange={handlePreguntaEnEdicionChange}
                                    className="mr-2"
                                  />
                                  <label className="text-sm font-medium text-gray-700">Es obligatoria</label>
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => guardarEdicionPreguntaCreacion(pregIndex)}
                                    className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                  >
                                    Guardar Cambios
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            {pregunta.opciones.length > 0 && !editandoPreguntaId && (
                              <div className="mt-1 ml-4">
                                <span className="text-sm text-gray-500">Opciones: </span>
                                {pregunta.opciones.join(", ")}
                                
                                {/* Mostrar descripciones si existen */}
                                {pregunta.descripciones && pregunta.descripciones.length > 0 && (
                                  <div className="mt-1">
                                    <span className="text-sm text-gray-500">Descripciones: </span>
                                    <ul className="ml-2 text-xs text-gray-600">
                                      {pregunta.opciones.map((opcion, idx) => (
                                        <li key={idx}>
                                          <strong>{opcion}:</strong> {pregunta.descripciones[idx] || 'Sin descripción'}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
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
                      <div>
                        <button
                          type="button"
                          onClick={() => editarPreguntaCreacion(pregunta, pIndex)}
                          className="p-1 mr-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-xs"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => eliminarPreguntaSubSeccion(pIndex)}
                          className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                    
                    {/* Mostrar editor de pregunta si está en modo edición */}
                    {editandoPreguntaId === pregunta.id && preguntaEnEdicion && (
                      <div className="mt-3 p-3 bg-white rounded-md border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                            <input
                              type="text"
                              name="id"
                              value={preguntaEnEdicion.id}
                              onChange={handlePreguntaEnEdicionChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
                            <input
                              type="text"
                              name="texto"
                              value={preguntaEnEdicion.texto}
                              onChange={handlePreguntaEnEdicionChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                          <select
                            name="tipo"
                            value={preguntaEnEdicion.tipo}
                            onChange={handlePreguntaEnEdicionChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="si_no">Sí/No</option>
                            <option value="numerica">Numérica (1-5)</option>
                          </select>
                        </div>
                        
                        {/* Agregar descripciones para cada opción */}
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción para cada opción</label>
                          <div className="space-y-2">
                            {preguntaEnEdicion.opciones.map((opcion, index) => (
                              <div key={index} className="flex items-center">
                                <span className="inline-block w-24 font-medium">{opcion}:</span>
                                <input
                                  type="text"
                                  value={preguntaEnEdicion.descripciones?.[index] || ""}
                                  onChange={(e) => {
                                    const newDescripciones = [...(preguntaEnEdicion.descripciones || [])];
                                    while (newDescripciones.length < preguntaEnEdicion.opciones.length) {
                                      newDescripciones.push("");
                                    }
                                    newDescripciones[index] = e.target.value;
                                    setPreguntaEnEdicion({
                                      ...preguntaEnEdicion,
                                      descripciones: newDescripciones
                                    });
                                  }}
                                  className="flex-1 p-2 border border-gray-300 rounded-md"
                                  placeholder={`Descripción para "${opcion}"`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            name="esObligatoria"
                            checked={preguntaEnEdicion.esObligatoria}
                            onChange={handlePreguntaEnEdicionChange}
                            className="mr-2"
                          />
                          <label className="text-sm font-medium text-gray-700">Es obligatoria</label>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => guardarEdicionPreguntaCreacion(pIndex)}
                            className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                          >
                            Guardar Cambios
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {pregunta.opciones.length > 0 && !editandoPreguntaId && (
                      <div className="mt-1 ml-4">
                        <span className="text-sm text-gray-500">Opciones: </span>
                        {pregunta.opciones.join(", ")}
                        
                        {/* Mostrar descripciones si existen */}
                        {pregunta.descripciones && pregunta.descripciones.length > 0 && (
                          <div className="mt-1">
                            <span className="text-sm text-gray-500">Descripciones: </span>
                            <ul className="ml-2 text-xs text-gray-600">
                              {pregunta.opciones.map((opcion, idx) => (
                                <li key={idx}>
                                  <strong>{opcion}:</strong> {pregunta.descripciones[idx] || 'Sin descripción'}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
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
              
              {/* Agregar descripciones para cada opción */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción para cada opción
                </label>
                <div className="space-y-2">
                  {currentPregunta.opciones.map((opcion, index) => (
                    <div key={index} className="flex items-center">
                      <span className="inline-block w-24 font-medium">{opcion}:</span>
                      <input
                        type="text"
                        value={currentPregunta.descripciones[index] || ""}
                        onChange={(e) => {
                          const newDescripciones = [...currentPregunta.descripciones];
                          newDescripciones[index] = e.target.value;
                          setCurrentPregunta({
                            ...currentPregunta,
                            descripciones: newDescripciones
                          });
                        }}
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
        <div className="flex justify-end mt-6 relative">
          <div className="absolute left-2">
            <Link to="/mainauditory" className="flex items-center px-2 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 hover:text-blue-600 transition-colors text-sm">
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
                fechaCreacion: new Date().toISOString(),
                program: "",
                config: {
                  nistThresholds: {
                    lowRisk: 80,
                    mediumRisk: 50
                  }
                }
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
                descripciones: [
                  "Cumplimiento completo", 
                  "Sin cumplimiento", 
                  "Cumplimiento parcial", 
                  "No aplicable a este contexto"
                ],
                esObligatoria: true
              });
              addAlert('info', "Formulario Limpio");
            }}
          >
            Limpiar Formulario
          </button>
          <button
            type="button"
            onClick={guardarFormulario}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={secciones.length === 0 || formData.program.trim() === ""}
          >
            Guardar formulario
          </button>
        </div>
      </div>
    );
};

export default CreateAuditForm;