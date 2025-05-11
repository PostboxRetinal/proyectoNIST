/**
 * Tipos de empresa válidos
 */
export const VALID_BUSINESS_TYPES = [
	'Tecnología',
	'Finanzas',
	'Salud',
	'Educación',
	'Manufactura',
	'Comercio',
	'Servicios',
	'Construcción',
	'Transporte',
	'Entretenimiento',
	'Agricultura',
	'Otro',
] as const;

// Tipo para usar con TypeScript
export type BusinessType = (typeof VALID_BUSINESS_TYPES)[number];

/**
 * Define los rangos de empleados permitidos
 */
export const VALID_EMPLOYEE_RANGES = [
	'Menos de 50',
	'Entre 50 y 149',
	'Entre 150 y 299',
	'Entre 300 y 399',
	'Entre 400 y 500',
	'Más de 500',
] as const;

export type EmployeeRange = (typeof VALID_EMPLOYEE_RANGES)[number];
