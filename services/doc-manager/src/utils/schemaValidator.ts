import { t } from 'elysia';
import { VALID_BUSINESS_TYPES } from '../constants/businessTypes';
import { VALID_EMPLOYEE_RANGES } from '../constants/businessTypes';

// Esquema para validar la creación de una nueva empresa
export const createCompanyValidator = t.Object(
	{
		companyName: t.String({ minLength: 2, maxLength: 100 }),
		nit: t.String({ minLength: 9, maxLength: 20 }),
		email: t.String({ format: 'email' }),
		phone: t.String({ minLength: 7, maxLength: 15 }),
		address: t.String({ minLength: 5, maxLength: 200 }),
		businessType: t.Enum(t.String(), [...VALID_BUSINESS_TYPES]),
		employeeRange: t.Enum(t.String(), [...VALID_EMPLOYEE_RANGES]),
	},
	{
		additionalProperties: false,
		description: 'Datos para crear una nueva empresa',
	}
);

// Esquema para validar la actualización de una empresa
export const updateCompanyValidator = t.Object(
	{
		companyName: t.Optional(t.String({ minLength: 2, maxLength: 100 })),
		email: t.Optional(t.String({ format: 'email' })),
		phone: t.Optional(t.String({ minLength: 7, maxLength: 15 })),
		address: t.Optional(t.String({ minLength: 5, maxLength: 200 })),
		businessType: t.Optional(t.Enum(t.String(), [...VALID_BUSINESS_TYPES])),
		employeeRange: t.Optional(t.Enum(t.String(), [...VALID_EMPLOYEE_RANGES])),
	},
	{
		additionalProperties: false,
		description: 'Datos para actualizar una empresa',
	}
);

// Validador para búsqueda de empresas
export const getCompanyValidator = t.Object({
	companyId: t.String({
		error: 'Debe proporcionar el ID de la empresa',
	}),
});
