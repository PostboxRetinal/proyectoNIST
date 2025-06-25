import { logger } from '@rasla/logify';

/**
 * Error personalizado base para errores relacionados con auditorías
 */
export class AuditError extends Error {
	public errorCode: string;

	constructor(message: string, errorCode: string) {
		super(message);
		this.name = this.constructor.name;
		this.errorCode = errorCode;
	}
}

/**
 * Logs audit-related errors
 * @param {string} functionName - Name of the function where the error occurred
 * @param {unknown} error - The error object
 */
export function logAuditError(functionName: string, error: unknown): void {
	console.error(`Error en auditService.${functionName}:`, error);
}

export class AuditTemplateNotFoundError extends AuditError {
	constructor() {
		super(
			'No se encontró la plantilla de auditoría solicitada',
			'AUDIT_TEMPLATE_NOT_FOUND'
		);
	}
}

export class AuditResultNotFoundError extends AuditError {
	constructor(id: string) {
		super(
			`No se encontró el resultado de auditoría con ID: '${id}'`,
			'AUDIT_RESULT_NOT_FOUND'
		);
	}
}

export class InvalidAuditDataError extends AuditError {
	constructor(detail: string) {
		super(`Datos de auditoría inválidos: ${detail}`, 'INVALID_AUDIT_DATA');
	}
}

export class FirebaseOperationError extends AuditError {
	constructor(operation: string) {
		super(
			`Error en la operación de Firebase: ${operation}`,
			'FIREBASE_OPERATION_ERROR'
		);
	}
}

// Función para crear respuestas de error estandarizadas
export function createAuditErrorResponse(error: any, defaultMessage: string) {
	// Error específico de auditoría
	if (error instanceof AuditError) {
		if (
			error instanceof AuditTemplateNotFoundError ||
			error instanceof AuditResultNotFoundError
		) {
			return {
				status: 404,
				message: error.message,
				errorCode: error.errorCode,
			};
		} else if (error instanceof InvalidAuditDataError) {
			return {
				status: 400,
				message: error.message,
				errorCode: error.errorCode,
			};
		} else if (error instanceof FirebaseOperationError) {
			return {
				status: 500,
				message: error.message,
				errorCode: error.errorCode,
			};
		}
	}

	// Error genérico
	console.error('Error en el servicio de auditoría:', error);
	return {
		status: 500,
		message: defaultMessage,
		errorCode: 'INTERNAL_SERVER_ERROR',
	};
}
