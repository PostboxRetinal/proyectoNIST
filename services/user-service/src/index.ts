import { Elysia, t } from 'elysia';
import { UserService } from './services/userService';
import { validateFirebaseConfig } from './utils/firebaseValidator';
import {
	createUserValidator,
	loginUserValidator,
	resetPasswordValidator,
} from './utils/schemaValidator';

const firebaseConfigValid = validateFirebaseConfig();
if (!firebaseConfigValid) {
	console.error(
		'❌ Configuración de Firebase no válida. Verifica las variables de entorno'
	);
	process.exit(1);
} else {
	console.log(`✅ Configuración de Firebase válida`);
}

const app = new Elysia({ prefix: '/api' }).post(
	'/newUser',
	async ({ body, error }) => {
		try {
			const { email, password } = body as any;
			const user = await UserService.createUser(email, password);
			return error(201, {
				success: true,
				message: 'Usuario creado exitosamente',
				userId: user.uid,
			});
		} catch (error: any) {
			const errorMapping: {
				[key: string]: { status: number; message: string };
			} = {
				'auth/api-key-not-valid': {
					status: 500,
					message:
						'Error de configuración del servidor. Por favor contacte al administrador.',
				},
				'auth/email-already-in-use': {
					status: 409,
					message: 'El correo electrónico ya está en uso',
				},
				'auth/invalid-email': {
					status: 400,
					message: 'El correo electrónico no es válido',
				},
				'auth/weak-password': {
					status: 400,
					message: 'La contraseña es demasiado débil',
				},
			};
			const { status, message } = errorMapping[error.code] || {
				status: 400,
				message: error.message || 'Error al crear usuario',
			};
			return error(status, {
				success: false,
				message: message,
				errorCode: error.code,
			});
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
).post(
	'/loginUser',
	async ({ body, error }) => {
		try {
			const { email, password } = body as any;
			const user = await UserService.loginUser(email, password);
			return error(200, {
				success: true,
				message: 'Inicio de sesión exitoso',
				userId: user.uid,
			});
		} catch (error: any) {
			const errorMapping: {
				[key: string]: { status: number; message: string };
			} = {
				'auth/user-not-found': {
					status: 404,
					message: 'Usuario no encontrado',
				},
				'auth/invalid-email': {
					status: 400,
					message: 'El correo electrónico no es válido',
				},
				'auth/wrong-password': {
					status: 401,
					message: 'Contraseña incorrecta',
				},
			};
			const { status, message } = errorMapping[error.code] || {
				status: 400,
				message: error.message || 'Error al iniciar sesión',
			};
			return error(status, {
				success: false,
				message: message,
				errorCode: error.code,
			});
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
);


const port = Bun.env.USER_SERVICE_PORT || 4001;
app.listen(port);
console.log(`🦊 User Service ejecutándose en http://localhost:${port}`);
