/**
 * Valores posibles para las respuestas de auditoría
 * Se reciben 4 constantes y un número
 * - 'yes': Cumple con la pregunta
 * - 'partial': Cumple parcialmente con la pregunta
 * - 'no': No cumple con la pregunta
 * - 'na': No aplica la pregunta
 * - number: Porcentaje de cumplimiento
 */
export type OptionValue = 'yes' | 'partial' | 'no' | 'na' | number;

/**
 * Opciones disponibles para las preguntas
 */
export interface Option {
	value: OptionValue;
	label: string;
	description: string;
}

/**
 * Pregunta de auditoría
 */
export interface Question {
	id: string;
	text: string;
	options: Option[];
	response: OptionValue | null;
	observations: string;
	evidence_url: string;
}

/**
 * Subsección de auditoría
 */
export interface Subsection {
	subsection: string;
	title: string;
	questions: Question[];
}

/**
 * Sección principal de auditoría
 */
export interface Section {
	section: string;
	title: string;
	subsections: Subsection[];
}

/**
 * Estructura completa de una auditoría NIST
 */
export interface NistAudit {
	program: string;
	sections: Section[];
}

/**
 * Resultado de auditoría procesado
 */
export interface AuditResult {
	id: string;
	program: string;
	auditDate: Date;
	completionPercentage: number;
	createdAt?: Date;
	sections: {
		[sectionId: string]: {
			completionPercentage: number;
			questions: {
				[questionId: string]: {
					response: OptionValue | null;
					observations: string;
					evidence_url: string;
				};
			};
		};
	};
}

/**
 * Respuesta básica para APIs
 */
export interface ApiResponse {
	success: boolean;
	message?: string;
}

/**
 * Error de API
 */
export interface ApiError extends ApiResponse {
	success: false;
	message: string;
	errorCode: string;
}
