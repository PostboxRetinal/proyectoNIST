import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { Logestic } from 'logestic';
import { cors } from '@elysiajs/cors';
import { UserService } from './services/userService';
import { validateFirebaseConfig } from './utils/firebaseValidator';
import {
	createUserValidator,
	loginUserValidator,
	resetPasswordValidator,
} from './utils/schemaValidator';

// Revisa si las variables de entorno de Firebase son válidas
const firebaseConfigValid = validateFirebaseConfig();
if (!firebaseConfigValid) {
	console.error(
		'❌ Configuración de Firebase no válida. Verifica las variables de entorno'
	);
	process.exit(1);
} else {
	console.log(`✅ Configuración de Firebase válida`);
}

const api = new Elysia({ prefix: '/api' }).post(
	'/newUser',
	async ({ body, error }) => {
		try {
			const { email, password } = body as any; // Reemplaza 'any' con una definición de tipo adecuada

			// CRUD - Crea usuario en Firebase
			const user = await UserService.createUser(email, password);

			// retorno 201
			return error(201, {
				success: true,
				message: 'Usuario creado exitosamente',
				userId: user.uid,
			});
		} catch (error: any) {
			// manejo de errores
			let status: number = 400; // código de error (numérico) por defectolet status: number = 400; // código de error (numérico) por defecto
			let errorMessage: string = error.message || 'Error al crear usuario';
			if (error.code === 'auth/api-key-not-valid') {
				status = 500;
				errorMessage =
					'Error de configuración del servidor. Por favor contacte al administrador.';
			} else if (error.code === 'auth/email-already-in-use') {
				status = 409;
				errorMessage = 'El correo electrónico ya está en uso';
			} else if (error.code === 'auth/invalid-email') {
				status = 400;
				errorMessage = 'El correo electrónico no es válido';
			} else if (error.code === 'auth/weak-password') {
				status = 400;
				errorMessage = 'La contraseña es demasiado débil';
			}

			// uso de función error como se sugiere para retornos custom
			return error(status, {
				success: false,
				message: errorMessage,
				errorCode: error.code,
			});
		}
	},
	{
		body: createUserValidator, //info para Swagger y su doc
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
);
// configuración de server
const app = new Elysia()
	.state('version', '1.0.0')
	.use(api)
	.use(
		cors({
			origin: ['127.0.0.1', 'localhost'], // permite el acceso desde localhost o 127.0.0.1 que es lo mismo
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
			allowedHeaders: ['Content-Type', 'Authorization'],
		})
	)
	.use(swagger()) // genera la documentación de la API
	.use(Logestic.preset('fancy')) // logs habilitados en CLI
	.listen(Bun.env.BACKEND_PORT || 3000);

console.log(
	`🦊 ElysiaJS backend ejecutándose en http://${app.server?.hostname}:${app.server?.port}`
);

//debugging .env test
// console.log(`FIREBASE_API_KEY: ${Bun.env.FIREBASE_API_KEY}`);
