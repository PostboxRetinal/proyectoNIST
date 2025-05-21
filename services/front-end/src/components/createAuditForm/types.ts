// types.ts
// Interfaces base para las estructuras de datos de auditoría

// Opciones de respuesta para preguntas
export interface Option {
  value: string;
  label: string;
  description: string;
}

// Pregunta individual de una auditoría
export interface Question {
  id: string;
  text: string;
  options: Option[];
  response: string | null;
  observations: string;
  evidence_url: string;
  esObligatoria?: boolean; // Campo adicional para la creación de formularios
}

// Subsección que contiene preguntas
export interface Subsection {
  subsection: string;
  title: string;
  questions: Question[];
}

// Sección que contiene subsecciones
export interface Section {
  section: string;
  title: string;
  subsections: Subsection[];
}

// Datos completos de una auditoría
export interface FormularioData {
  success?: boolean;
  audit: {
    sections: Record<string, Section>;
    program?: string;
    auditDate?: string;
  };
}
