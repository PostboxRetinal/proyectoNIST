import { BusinessType, EmployeeRange } from '../constants/businessTypes';

// Errores específicos para el servicio de empresas
export class CompanyError extends Error {
	public errorCode: string;

	constructor(message: string, errorCode: string) {
		super(message);
		this.name = this.constructor.name;
		this.errorCode = errorCode;
	}
}

/**
 * Logs company-related errors
 * @param {string} functionName - Name of the function where the error occurred
 * @param {unknown} error - The error object
 */
export function logCompanyError(functionName: string, error: unknown): void {
	console.error(`Error in CompanyService.${functionName}:`, error);
}

export class InvalidBusinessTypeError extends CompanyError {
	constructor(businessType: string) {
		super(
			`El tipo de empresa '${businessType}' no es válido`,
			'INVALID_BUSINESS_TYPE'
		);
	}
}

export class InvalidEmployeeRangeError extends CompanyError {
	constructor(employeeRange: string) {
		super(
			`El rango de empleados '${employeeRange}' no es válido`,
			'INVALID_EMPLOYEE_RANGE'
		);
	}
}

export class DuplicateNITError extends CompanyError {
	constructor(nit: string) {
		super(`Ya existe una empresa con el NIT '${nit}'`, 'DUPLICATE_NIT');
	}
}

export class CompanyNotFoundError extends CompanyError {
	constructor(identifier: string) {
		super(
			`No se encontró la empresa con el identificador '${identifier}'`,
			'COMPANY_NOT_FOUND'
		);
	}
}

// Función para crear respuestas de error estandarizadas
export function createCompanyErrorResponse(error: any, defaultMessage: string) {
	// Error específico de empresa
	if (error instanceof CompanyError) {
		if (error instanceof DuplicateNITError) {
			return {
				status: 409,
				message: error.message,
				errorCode: error.errorCode,
			};
		} else if (
			error instanceof InvalidBusinessTypeError ||
			error instanceof InvalidEmployeeRangeError
		) {
			return {
				status: 400,
				message: error.message,
				errorCode: error.errorCode,
			};
		} else if (error instanceof CompanyNotFoundError) {
			return {
				status: 404,
				message: error.message,
				errorCode: error.errorCode,
			};
		}
	}

	// Error genérico
	console.error('Error en el servicio de empresas:', error);
	return {
		status: 500,
		message: defaultMessage,
		errorCode: 'INTERNAL_SERVER_ERROR',
	};
}
