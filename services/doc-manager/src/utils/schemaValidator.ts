import { t } from 'elysia';
import {
	VALID_BUSINESS_TYPES,
	VALID_EMPLOYEE_RANGES,
} from '../constants/businessTypes';

// Esquema para validar la creación de una nueva empresa
export const createCompanyValidator = t.Object({
	companyName: t.String({ minLength: 2, maxLength: 100 }),
	nit: t.String({ minLength: 9, maxLength: 20 }),
	email: t.String({ format: 'email' }),
	phone: t.String({ minLength: 7, maxLength: 15 }),
	address: t.String({ minLength: 5, maxLength: 200 }),
	businessType: t.String({ enum: VALID_BUSINESS_TYPES }),
	employeeRange: t.String({ enum: VALID_EMPLOYEE_RANGES }),
});

// Esquema para validar la actualización de una empresa
export const updateCompanyValidator = t.Object(
	{
		companyName: t.Optional(t.String({ minLength: 2, maxLength: 100 })),
		email: t.Optional(t.String({ format: 'email' })),
		phone: t.Optional(t.String({ minLength: 7, maxLength: 15 })),
		address: t.Optional(t.String({ minLength: 5, maxLength: 200 })),
		businessType: t.Optional((t.String({enum : VALID_BUSINESS_TYPES}))),
		employeeRange: t.Optional((t.String({enum : VALID_EMPLOYEE_RANGES}))),
	},
	{
		additionalProperties: false,
		description: 'Datos para actualizar una empresa',
	}
);

// Validador para búsqueda de empresas
export const getCompanyValidator = t.Object({
	nit: t.String({
		error: 'Debe proporcionar un NIT de empresa válido',
	}),
});
