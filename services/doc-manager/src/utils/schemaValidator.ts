import { t } from 'elysia';
import {
	VALID_BUSINESS_TYPES,
	VALID_EMPLOYEE_RANGES,
} from '../constants/businessTypes';

// Custom validator para tipos de empresa
const BusinessTypeValidator = t.String({
	validate: (value: string) => {
		return VALID_BUSINESS_TYPES.includes(
			value as (typeof VALID_BUSINESS_TYPES)[number]
		);
	},
	error: `El tipo de empresa proporcionado no es válido. Debe ser uno de los siguientes: ${VALID_BUSINESS_TYPES.join(
		', '
	)}`,
});

// Custom validator para rangos de empleados
const EmployeeRangeValidator = t.String({
	validate: (value: string) => {
		return VALID_EMPLOYEE_RANGES.includes(
			value as (typeof VALID_EMPLOYEE_RANGES)[number]
		);
	},
	error: `El rango de empleados proporcionado no es válido. Debe ser uno de los siguientes: ${VALID_EMPLOYEE_RANGES.join(
		', '
	)}`,
});

// Validador para NIT colombiano (formato básico)
const NITValidator = t.String({
	pattern: '^[0-9]{9,10}-[0-9]$',
	error:
		'El NIT debe tener el formato correcto: 9-10 dígitos seguidos de un guion y un dígito de verificación',
});

// Validador para teléfono colombiano
const PhoneValidator = t.String({
	pattern: '^(\\+57\\s?)?[3][0-9]{9}$',
	error:
		'El teléfono debe tener un formato válido colombiano. Ej: +57 3001234567 o 3001234567',
});

// Validador para la creación de empresas
export const createCompanyValidator = t.Object({
	companyName: t.String({
		minLength: 2,
		error: 'El nombre de la empresa debe tener al menos 2 caracteres',
	}),
	nit: NITValidator,
	email: t.String({
		format: 'email',
		error: 'Debe proporcionar un email válido para la empresa',
	}),
	phone: PhoneValidator,
	address: t.String({
		minLength: 5,
		error: 'La dirección debe tener al menos 5 caracteres',
	}),
	businessType: BusinessTypeValidator,
	employeeRange: EmployeeRangeValidator,
	userId: t.String({
		error: 'Debe proporcionar el ID del usuario que registra la empresa',
	}),
});

// Validador para actualización de empresas (campos opcionales)
export const updateCompanyValidator = t.Object({
	companyName: t.Optional(
		t.String({
			minLength: 2,
			error: 'El nombre de la empresa debe tener al menos 2 caracteres',
		})
	),
	email: t.Optional(
		t.String({
			format: 'email',
			error: 'Debe proporcionar un email válido para la empresa',
		})
	),
	phone: t.Optional(PhoneValidator),
	address: t.Optional(
		t.String({
			minLength: 5,
			error: 'La dirección debe tener al menos 5 caracteres',
		})
	),
	businessType: t.Optional(BusinessTypeValidator),
	employeeRange: t.Optional(EmployeeRangeValidator),
});

// Validador para búsqueda de empresas
export const getCompanyValidator = t.Object({
	companyId: t.String({
		error: 'Debe proporcionar el ID de la empresa',
	}),
});
