import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { Logestic } from 'logestic';
import { cors } from '@elysiajs/cors';
import { registerCompanyRoutes } from './routes/companyRoutes';

const app = new Elysia({ prefix: '/api/company' });

app
	.use(
		cors({
			origin: ['http://api-gateway:80','http://localhost:5173'],
			methods: ['GET', 'POST', 'PUT', 'DELETE'],
			allowedHeaders: ['Content-Type', 'Authorization', 'X-Gateway-Source'],
		})
	)
	.use(
		swagger({
			documentation: {
				info: {
					title: 'proyectoNIST doc-manager service API',
					version: '1.0.0',
				},
			},
		})
	)
	.use(Logestic.preset('fancy'))
	// Registrar rutas de empresas
	.use(registerCompanyRoutes)
	// Gestión de errores y lanzamiento del servidor
	.onError(({ code, error, set }) => {
		if (code === 'VALIDATION') {
			set.status = 400;

			// Extraemos los detalles de validación del error
			const fieldErrors = error.all || [];

			// Definimos objetos vacíos con tipos específicos
			const errorMessages: Record<string, string> = {}; // Objeto que tendrá claves de tipo string y valores de tipo string
			const invalidValues: Record<string, any> = {}; // Objeto que tendrá claves de tipo string y valores de cualquier tipo

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
	.listen(Bun.env.SERVICE_PORT ?? 4002);

console.log(
	`📄 Document Manager ejecutándose en http://${app.server?.hostname}:${app.server?.port}`
);
