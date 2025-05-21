// Definir los tipos aquí ya que no podemos importarlos
interface Option {
  value: string;
  label: string;
  description: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  response: string | null;
  observations: string;
  evidence_url: string;
}

interface Subsection {
  subsection: string;
  title: string;
  questions: Question[];
}

interface Section {
  section: string;
  title: string;
  subsections: Subsection[];
}

// Tipos para el reporte
interface FormResponse {
  program: string;
  sections: Array<{
    section?: string | number;
    id?: string | number;
    title: string;
    subsections: Array<{
      subsection?: string | number;
      id?: string | number;
      title: string;
      questions: Array<{
        id: string | number;
        text: string;
        options?: Array<{
          value: string;  
          label: string;
          description?: string;
        }>;
        response?: string;  
        observations?: string;
        evidence_url?: string;
      }>;
    }>;
  }>;
}

export interface FormDataNew {
  program: string;
  sections: Section[];
}

interface ApiForm {
  id: string | number;
  name?: string;
  program?: string;
  date?: string;
  fechaCreacion?: string;
  hasResponses?: boolean;
}

interface FormListItem {
  id: string;
  name: string;
  date: string;
  status: string;
}

// Función para transformar los datos de la API al formato necesario para el componente FormEvaluation
export const adaptFormData = (data: FormResponse): FormDataNew => {
  return {
    program: data.program,
    sections: data.sections.map((section) => ({
      section: section.section?.toString() || section.id?.toString() || '',
      title: section.title,
      subsections: section.subsections.map((subsection) => ({
        subsection: subsection.subsection?.toString() || subsection.id?.toString() || '',
        title: subsection.title,
        questions: subsection.questions.map((question) => {
          // Convertir las opciones y valores al nuevo formato (solo strings)
          const options = question.options?.map((opt) => ({
            value: typeof opt.value === 'string' ? opt.value : 'no', // Asegurar que sea string
            label: opt.label,
            description: opt.description || ''
          })) || [];

          // Asegurar que respuesta sea si_no (yes, no, partial, na)
          let normalizedResponse = '';
          if (question.response !== undefined) {
            normalizedResponse = String(question.response).toLowerCase();
            
            // Si por alguna razón viene un valor numérico (datos existentes),
            // lo convertimos a string de si_no
            if (normalizedResponse === 'true' || normalizedResponse === '1') {
              normalizedResponse = 'yes';
            } else if (normalizedResponse === 'false' || normalizedResponse === '0') {
              normalizedResponse = 'no';
            }
            
            // Verificar que sea uno de los valores permitidos
            if (!['yes', 'no', 'partial', 'na'].includes(normalizedResponse)) {
              normalizedResponse = 'na'; // Valor por defecto
            }
          }

          return {
            id: question.id.toString(),
            text: question.text,
            options: options,
            response: normalizedResponse as string,
            observations: question.observations || '',
            evidence_url: question.evidence_url || '',
          };
        })
      }))
    }))
  };
};

// Función para adaptar la lista de formularios
export const adaptFormList = (apiForms: ApiForm[]): FormListItem[] => {
  return apiForms.map((form: ApiForm) => ({
    id: String(form.id),
    name: form.name || form.program || `Formulario ${form.id}`,
    date: form.date || form.fechaCreacion || new Date().toISOString(),
    status: form.hasResponses ? 'Completado' : 'Pendiente'
  })).filter((form: FormListItem) => form.status === 'Completado');
};