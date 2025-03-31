import { t } from 'elysia';

/**
 * Validador de esquema para la creación de usuario
 */
export const createUserValidator = t.Object({
	email: t.String({
		format: 'email',
		error: 'Debe proporcionar un email válido',
	}),
	password: t.String({
		minLength: 6,
		error: 'La contraseña debe tener al menos 6 caracteres',
	}),
});

/**
 * Validador de esquema para el inicio de sesión de usuario
 */
export const loginUserValidator = t.Object({
	email: t.String({
		format: 'email',
		error: 'Debe proporcionar un email válido',
	}),
	password: t.String({
		error: 'Debe proporcionar una contraseña',
	}),
});

/**
 * Validador de esquema para la actualización del perfil de usuario
 */
export const resetPasswordValidator = t.Object({
	email: t.String({
		format: 'email',
		error: 'Debe proporcionar un email válido',
	}),
});
