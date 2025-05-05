import {
	VALID_BUSINESS_TYPES,
	VALID_EMPLOYEE_RANGES,
} from '../constants/businessTypes';

// Error personalizado para tipos de empresa inválidos
export class InvalidBusinessTypeError extends Error {
	code: string;

	constructor(businessType: string) {
		super(
			`El tipo de empresa '${businessType}' no es válido. Debe ser uno de los siguientes: ${VALID_BUSINESS_TYPES.join(
				', '
			)}`
		);
		this.name = 'InvalidBusinessTypeError';
		this.code = 'company/invalid-business-type';
	}
}

// Error personalizado para rangos de empleados inválidos
export class InvalidEmployeeRangeError extends Error {
	code: string;

	constructor(employeeRange: string) {
		super(
			`El rango de empleados '${employeeRange}' no es válido. Debe ser uno de los siguientes: ${VALID_EMPLOYEE_RANGES.join(
				', '
			)}`
		);
		this.name = 'InvalidEmployeeRangeError';
		this.code = 'company/invalid-employee-range';
	}
}

// Error personalizado para NIT inválido
export class InvalidNITError extends Error {
	code: string;

	constructor(nit: string) {
		super(
			`El NIT '${nit}' no tiene un formato válido. Debe tener 9-10 dígitos seguidos de un guion y un dígito de verificación`
		);
		this.name = 'InvalidNITError';
		this.code = 'company/invalid-nit';
	}
}

// Error personalizado para NIT duplicado
export class DuplicateNITError extends Error {
	code: string;

	constructor(nit: string) {
		super(`Ya existe una empresa registrada con el NIT '${nit}'`);
		this.name = 'DuplicateNITError';
		this.code = 'company/duplicate-nit';
	}
}

// Error personalizado para empresa no encontrada
export class CompanyNotFoundError extends Error {
	code: string;

	constructor(companyId: string) {
		super(`No se encontró ninguna empresa con el ID '${companyId}'`);
		this.name = 'CompanyNotFoundError';
		this.code = 'company/not-found';
	}
}

// Función para crear respuestas de error estandarizadas
export function createCompanyErrorResponse(
	error: unknown,
	defaultMessage?: string
) {
	let status = 500;
	let message = defaultMessage || 'Error del servidor';
	let code = 'company/unknown-error';

	if (error instanceof InvalidBusinessTypeError) {
		status = 400;
		message = error.message;
		code = error.code;
	} else if (error instanceof InvalidEmployeeRangeError) {
		status = 400;
		message = error.message;
		code = error.code;
	} else if (error instanceof InvalidNITError) {
		status = 400;
		message = error.message;
		code = error.code;
	} else if (error instanceof DuplicateNITError) {
		status = 409;
		message = error.message;
		code = error.code;
	} else if (error instanceof CompanyNotFoundError) {
		status = 404;
		message = error.message;
		code = error.code;
	} else if (error instanceof Error) {
		message = error.message;
	}

	return {
		success: false,
		message,
		errorCode: code,
		status: status as 400 | 401 | 403 | 404 | 409 | 429 | 500 | 503 | 504,
	};
}

// Función para registrar errores en la consola
export function logCompanyError(context: string, error: unknown): void {
	if (error instanceof Error) {
		console.error(`[${context}] Error: ${error.message}`);
		if (error.stack) {
			console.error(`Stack: ${error.stack}`);
		}
	} else {
		console.error(`[${context}] Unknown error:`, error);
	}
}
