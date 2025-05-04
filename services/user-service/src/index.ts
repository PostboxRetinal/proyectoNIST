import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { Logestic } from 'logestic';
import { cors } from '@elysiajs/cors';
import { registerUserRoutes } from './routes/userRoutes';

const app = new Elysia({ prefix: '/api' });

app
	.use(
		cors({
			origin: ['http://api-gateway', 'http://api-gateway:80'],
			methods: ['GET', 'POST', 'PUT', 'DELETE'],
			allowedHeaders: ['Content-Type', 'Authorization', 'X-Gateway-Source'],
		})
	)

	.use(
		swagger({
			documentation: {
				info: {
					title: 'proyectoNIST User Service API',
					version: '1.0.0',
				},
			},
		})
	)
	.use(Logestic.preset('fancy'))
	// Verificación de gateway antes de las rutas

	// Registrar rutas después de la verificación del gateway
	.use(registerUserRoutes)

	// Gestión de errores y lanzamiento del servidor
	.onError(({ code, error, set }) => {
		if (code === 'VALIDATION') {
			set.status = 400;

			// Extraemos los detalles de validación del error
			const fieldErrors = error.all || [];

			// Definimos objetos vacíos con tipos específicos
			const errorMessages: Record<string, string> = {}; // Objeto que tendrá claves de tipo string y valores de tipo string
			const invalidValues: Record<string, any> = {}; // Objeto que tendrá claves de tipo string y valores de cualquier tipo

			/* FRIENDLY REMINDER de los errores que manejamos
			 *
			 * El tipo Record<K, V> es un alias en TypeScript para un objeto donde:
			 *
			 * - K es el tipo de las claves (en este caso, string)
			 * - V es el tipo de los valores (string para errorMessages, any para invalidValues)
			 *
			 * Después se llenarán con los mensajes de error y valores inválidos respectivamente
			 **/

			// Procesamos cada error de campo
			for (const fieldError of fieldErrors) {
				const field = fieldError.path?.join('.') || 'unknown';
				errorMessages[field] = fieldError.message;

				// Solo incluimos el valor inválido específico
				if (error.value && field in error.value) {
					invalidValues[field] = error.value[field];
				}
			}

			return {
				success: false,
				message: 'Error de validación',
				details: errorMessages,
				invalidValues,
			};
		}

		return {
			success: false,
			message: error.message || 'Error interno del servidor',
		};
	})
	.listen(Bun.env.USER_SERVICE_PORT ?? 4001);

console.log(
	`🦊 User Service ejecutándose en http://${app.server?.hostname}:${app.server?.port}`
);
