import { t } from 'elysia';
import { VALID_ROLES } from '../constants/roles';

// Custom validator for roles that throws a specific error
const RoleValidator = t.String({
	validate: (value: string) => {
		return VALID_ROLES.includes(value as (typeof VALID_ROLES)[number]);
	},
	error: `El rol proporcionado no es válido. Debe ser uno de los siguientes: ${VALID_ROLES.join(
		', '
	)}`,
});

export const createUserValidator = t.Object({
	email: t.String({
		format: 'email',
		error: 'Debe proporcionar un email válido',
	}),
	password: t.String({
		minLength: 6,
		error:
			'La contraseña debe tener al menos 6 caracteres, incluir una letra minúscula, un número y un carácter no alfanumérico',
	}),
	role: t.Optional(RoleValidator),
});

export const loginUserValidator = t.Object({
	email: t.String({
		format: 'email',
		error: 'Debe proporcionar un email válido',
	}),
	password: t.String({
		error: 'Debe proporcionar una contraseña',
	}),
});

export const resetPasswordValidator = t.Object({
	email: t.String({
		format: 'email',
		error: 'Debe proporcionar un email válido',
	}),
});
