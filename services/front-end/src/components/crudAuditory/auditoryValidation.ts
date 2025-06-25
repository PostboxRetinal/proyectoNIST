import { AuditFormData } from "./auditoryTypes";

export function validateAuditoryJson(jsonData: unknown): void {
  // Type guard to check if the data has the expected structure
  const data = jsonData as AuditFormData;
  
  // Basic schema validation
  if (!data.program || typeof data.program !== 'string') {
    throw new Error('El JSON debe contener un campo "program" de tipo string');
  }
  
  if (!data.sections || !Array.isArray(data.sections)) {
    throw new Error('El JSON debe contener un campo "sections" de tipo array');
  }
  
  // Validate sections have the required structure
  for (const section of data.sections) {
    if (!section.section || typeof section.section !== 'string') {
      throw new Error('Cada sección debe tener un campo "section" de tipo string');
    }
    
    if (!section.title || typeof section.title !== 'string') {
      throw new Error('Cada sección debe tener un campo "title" de tipo string');
    }
    
    if (!section.subsections || !Array.isArray(section.subsections)) {
      throw new Error('Cada sección debe tener un campo "subsections" de tipo array');
    }
    
    // Validate subsections
    for (const subsection of section.subsections) {
      if (!subsection.subsection || typeof subsection.subsection !== 'string') {
        throw new Error('Cada subsección debe tener un campo "subsection" de tipo string');
      }
      
      if (!subsection.title || typeof subsection.title !== 'string') {
        throw new Error('Cada subsección debe tener un campo "title" de tipo string');
      }
      
      if (!subsection.questions || !Array.isArray(subsection.questions)) {
        throw new Error('Cada subsección debe tener un campo "questions" de tipo array');
      }
      
      // Validate questions
      for (const question of subsection.questions) {
        if (!question.id || typeof question.id !== 'string') {
          throw new Error('Cada pregunta debe tener un campo "id" de tipo string');
        }
        
        if (!question.text || typeof question.text !== 'string') {
          throw new Error('Cada pregunta debe tener un campo "text" de tipo string');
        }
        
        if (!question.options || !Array.isArray(question.options)) {
          throw new Error('Cada pregunta debe tener un campo "options" de tipo array');
        }
        
        // Validate options
        for (const option of question.options) {
          if (!option.value || typeof option.value !== 'string') {
            throw new Error('Cada opción debe tener un campo "value" de tipo string');
          }
          
          if (!option.label || typeof option.label !== 'string') {
            throw new Error('Cada opción debe tener un campo "label" de tipo string');
          }
          
          if (typeof option.description !== 'string') {
            throw new Error('Cada opción debe tener un campo "description" de tipo string');
          }
        }
      }
    }
  }
}