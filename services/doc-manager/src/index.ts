import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { logger } from '@rasla/logify';
import { cors } from '@elysiajs/cors';
import { registerCompanyRoutes } from './routes/routes';

const app = new Elysia({ prefix: '/api/company' });

app
	.use(
		cors({
			origin: ['http://api-gateway:80', 'http://localhost:5173'],
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
	.use(logger({ includeIp: true }))
	// Registrar rutas de empresas
	.use(registerCompanyRoutes)
	// Gestión de errores y lanzamiento del servidor
	.onError(({ code, set }) => {
		if (code === 'VALIDATION') {
			set.status = 400;

			// Definimos objetos vacíos con tipos específicos
			const errorMessages: Record<string, string> = {}; // Objeto que tendrá claves de tipo string y valores de tipo string
			const invalidValues: Record<string, any> = {}; // Objeto que tendrá claves de tipo string y valores de cualquier tipo

			return {
				success: false,
				message: 'Error de validación',
				details: errorMessages,
				invalidValues,
			};
		}

		return {
			success: false,
			message: 'Error interno del servidor',
		};
	})
	.listen(Bun.env.SERVICE_PORT ?? 4002);

console.log(
	`📄 Document Manager ejecutándose en http://${app.server?.hostname}:${app.server?.port}`
);
