import { t } from 'elysia';

export const createUserValidator = t.Object({
	email: t.String({ // Schema validator for user registration and login
		format: 'email',
		error: 'Debe proporcionar un email válido',
	}),
	password: t.String({
		minLength: 6,
		error: 'La contraseña debe tener al menos 6 caracteres',
	}),
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