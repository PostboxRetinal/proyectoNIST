import { t } from 'elysia';

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
	role: t.Optional(
		t.String({
			enum: ['admin', 'gestor', 'auditor'],
			error: 'El rol debe ser uno de los siguientes: admin, gestor, auditor',
		})
	),
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
