import { Elysia, t } from 'elysia';
import { UserService } from '../services/userService';
import {
	createUserValidator,
	loginUserValidator,
	resetPasswordValidator,
} from '../utils/schemaValidator';
import { createErrorResponse } from '../utils/firebaseErrors';

export function registerUserRoutes(app: Elysia<any>) {
	app
		.post(
			'/newUser',
			async ({ body, error }) => {
				try {
					const { email, password } = body as any;
					const role = body.role ?? 'auditor';
					const user = await UserService.createUser(email, password, role);
					return error(201, {
						success: true,
						message: 'Usuario creado exitosamente',
						userId: user.uid,
					});
				} catch (err: any) {
					//FLAG DEBUG
					console.error('ERROR:', err);
					//FLAG DEBUG

					const errorResponse = createErrorResponse(
						err,
						'Error general de servidor'
					);
					if (errorResponse.status === 409) {
						return error(409, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					} else if (errorResponse.status === 500) {
						return error(500, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					} else {
						return error(400, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					}
				}
			},
			{
				body: createUserValidator,
				response: {
					201: t.Object({
						success: t.Boolean(),
						message: t.String(),
						userId: t.String(),
					}),
					400: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
					409: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
					500: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
				},
				detail: {
					summary: 'Crea un nuevo usuario',
					description:
						'Crea un nuevo usuario en Firebase con email y contraseña',
					tags: ['Usuarios'],
				},
			}
		)
		.post(
			'/loginUser',
			async ({ body, error }) => {
				try {
					const { email, password } = body as any;
					const user = await UserService.loginUser(email, password);
					return {
						success: true,
						message: 'Inicio de sesión exitoso',
						userId: user.uid,
					};
				} catch (err: any) {
					const errorResponse = createErrorResponse(
						err,
						'Error al iniciar sesión'
					);
					if (errorResponse.status === 404) {
						return error(404, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					} else if (errorResponse.status === 401) {
						return error(401, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					} else {
						return error(400, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					}
				}
			},
			{
				body: loginUserValidator,
				response: {
					200: t.Object({
						success: t.Boolean(),
						message: t.String(),
						userId: t.String(),
					}),
					400: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
					401: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
					404: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
				},
				detail: {
					summary: 'Inicia sesión de usuario',
					description:
						'Inicia sesión de usuario en Firebase con email y contraseña',
					tags: ['Usuarios'],
				},
			}
		)
		.post(
			'/resetPassword',
			async ({ body, error }) => {
				try {
					const { email } = body as any;
					await UserService.resetPassword(email);
					return {
						success: true,
						message: 'Email de recuperación enviado',
					};
				} catch (err: any) {
					const errorResponse = createErrorResponse(
						err,
						'Error al enviar email de recuperación'
					);
					return error(400, {
						success: false,
						message: errorResponse.message,
						errorCode: errorResponse.errorCode,
					});
				}
			},
			{
				body: resetPasswordValidator,
				response: {
					200: t.Object({
						success: t.Boolean(),
						message: t.String(),
					}),
					400: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
				},
				detail: {
					summary: 'Recuperación de contraseña',
					description:
						'Envía un email de recuperación de contraseña al usuario',
					tags: ['Usuarios'],
				},
			}
		);
	return app;
}
