/**
 * Valores posibles para las respuestas de auditoría
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
 * Configuración de umbrales NIST
 */

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
	auditDate: string;
	completionPercentage: number;
	createdAt?: number;
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
