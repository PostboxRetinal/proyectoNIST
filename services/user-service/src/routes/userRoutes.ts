import { Elysia, t } from 'elysia';
import { UserService, InvalidRoleError } from '../services/userService';
import {
	createUserValidator,
	loginUserValidator,
	resetPasswordValidator,
} from '../utils/schemaValidator';
import { createErrorResponse } from '../utils/firebaseErrors';
import { VALID_ROLES } from '../constants/roles';

export function registerUserRoutes(app: Elysia<any>) {
	app
		.post(
			'/newUser',
			async ({ body, error }) => {
				try {
					const { email, password } = body as any;
					const role = body.role || 'auditor'; // Valor por defecto si no se proporciona

					// Intentamos crear el usuario - el servicio validará el rol
					const user = await UserService.createUser(email, password, role);
					return {
						success: true,
						message: 'Usuario creado exitosamente',
						userId: user.uid,
					};
				} catch (err: any) {
					// Si es un error de rol inválido, devolvemos un error personalizado
					if (
						err instanceof InvalidRoleError ||
						err.code === 'auth/invalid-role'
					) {
						const invalidRole = body?.role;
						return error(400, {
							success: false,
							message: `El rol '${invalidRole}' no es válido`,
							details: {
								role: `Debe ser uno de los siguientes: ${VALID_ROLES.join(
									', '
								)}`,
							},
							invalidValues: { role: invalidRole },
						});
					}

					// Para otros errores de Firebase, usamos el sistema existente
					const errorResponse = createErrorResponse(
						err,
						'Error general de servidor'
					);

					return error(400, {
						success: false,
						message: errorResponse.message,
						errorCode: errorResponse.errorCode,
					});
				}
			},
			{
				body: createUserValidator,
				response: {
					200: t.Object({
						success: t.Boolean(),
						message: t.String(),
						userId: t.String(),
						role: t.String(),
					}),
					400: t.Object({
						success: t.Boolean(),
						message: t.String(),
						details: t.Optional(t.Record(t.String(), t.String())),
						invalidValues: t.Optional(t.Record(t.String(), t.Any())),
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
			'/login',
			async ({ body, error }) => {
				// Validación de rol - lanza error específico
				try {
					const { email, password } = body as any;
					const user = await UserService.loginUser(email, password);
					const userData = await UserService.getUserData(user.uid);
      				
					return {
						success: true,
						message: 'Inicio de sesión exitoso',
						userId: user.uid,
						role: userData.role
					};
					// Si el inicio de sesión es exitoso, devolvemos el ID del usuario
				} catch (err: any) {
					const errorResponse = createErrorResponse(
						err,
						'Error al iniciar sesión'
					);
					// Si el error es 400, 401 o 404, devolvemos un error específico
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
						role: t.String(),
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
		.get(
			'/getUsers',
			async ({ error }) => {
				try {
					const users = await UserService.getAllUsers();
					return {
						success: true,
						message: 'Usuarios obtenidos exitosamente',
						users: users.map((user) => ({
							uid: user.id,
							email: user.email,
							role: user.role,
							createdAt: user.createdAt.toISOString(),
							updatedAt: user.updatedAt.toISOString(),
						})),
					};
				} catch (err: any) {
					const errorResponse = createErrorResponse(
						err,
						'Error al obtener usuarios'
					);

					return error(500, {
						success: false,
						message: errorResponse.message,
						errorCode: errorResponse.errorCode,
					});
				}
			},
			{
				response: {
					200: t.Object({
						success: t.Boolean(),
						message: t.String(),
						users: t.Array(
							t.Object({
								uid: t.String(),
								email: t.String(),
								role: t.String(),
								createdAt: t.String(),
								updatedAt: t.String(),
							})
						),
					}),
					500: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
				},
				detail: {
					summary: 'Obtiene todos los usuarios',
					description:
						'Obtiene la lista de todos los usuarios registrados en Firestore',
					tags: ['Usuarios'],
				},
			}
		)
		.post(
			'/resetPassword',
			async ({ body, error }) => {
				try {
					const { email } = body as { email: string };
					await UserService.resetPassword(email);
					return {
						success: true,
						message:
							'Se ha enviado un enlace de recuperación al correo electrónico proporcionado',
					};
				} catch (err: any) {
					const errorResponse = createErrorResponse(
						err,
						'Error al enviar el correo de recuperación'
					);

					if (errorResponse.status === 404) {
						return error(404, {
							success: false,
							message: 'El correo electrónico no está registrado',
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
					404: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
				},
				detail: {
					summary: 'Recuperación de contraseña',
					description:
						'Envía un correo electrónico con un enlace para restablecer la contraseña',
					tags: ['Usuarios'],
				},
			}
		);
	return app;
}
