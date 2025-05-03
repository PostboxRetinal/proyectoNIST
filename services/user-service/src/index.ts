import { Elysia, t } from 'elysia';
import { UserService } from './services/userService';
import { swagger } from '@elysiajs/swagger';
import { Logestic } from 'logestic';
import { cors } from '@elysiajs/cors';
import { validateFirebaseConfig } from './utils/firebaseValidator';
import {
	createUserValidator,
	loginUserValidator,
	resetPasswordValidator,
} from './utils/schemaValidator';
import { createErrorResponse } from './utils/firebaseErrors';
import { authRoutes } from './routes/authRoutes';

const firebaseConfigValid = validateFirebaseConfig();
if (!firebaseConfigValid) {
	console.error(
		'❌ Configuración de Firebase no válida. Verifica las variables de entorno'
	);
	process.exit(1);
} else {
	console.log(`✅ Configuración de Firebase válida`);
}

// Aplicación principal Elysia con prefijo /api
const app = new Elysia({ prefix: '/api' })

// Rutas de usuarios
.post(
	'/newUser',
	async ({ body, error }) => {
		try {
			const { email, password, role } = body as any;
			const user = await UserService.createUser(email, password, role);
			return error(201, {
				success: true,
				message: 'Usuario creado exitosamente',
				userId: user.uid,
			});
		} catch (err: any) {
			const errorResponse = createErrorResponse(err, 'Error al crear usuario');
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
			description: 'Crea un nuevo usuario en Firebase con email y contraseña',
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
			const errorResponse = createErrorResponse(err, 'Error al iniciar sesión');
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
			description: 'Inicia sesión de usuario en Firebase con email y contraseña',
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
			const errorResponse = createErrorResponse(err, 'Error al enviar email de recuperación');
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
			description: 'Envía un email de recuperación de contraseña al usuario',
			tags: ['Usuarios'],
		},
	}
)
// Grupo de rutas de autenticación
.use(authRoutes)
// Middlewares y configuración
.use(
	cors({
		origin: ['127.0.0.1', 'localhost'], // permite el acceso desde localhost o 127.0.0.1 que es lo mismo
		methods: ['GET', 'POST', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}))
.use(swagger())
.use(Logestic.preset('fancy'))
.listen(Bun.env.USER_SERVICE_PORT || 4001);

console.log(`🦊 User Service ejecutándose en http://${app.server?.hostname}:${app.server?.port}`);
