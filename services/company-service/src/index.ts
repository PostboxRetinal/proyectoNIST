import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { logger } from '@rasla/logify';
import { cors } from '@elysiajs/cors';
import { registerCompanyRoutes } from './routes/companyRoutes';

const app = new Elysia({ prefix: '/api/company' });

app
	.use(
		cors({
			origin: ['*'],
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization', 'X-Gateway-Source'],
			credentials: true,
			exposeHeaders: ['Access-Control-Allow-Origin'],
			preflight: true,
		})
	)
	.use(
		swagger({
			documentation: {
				info: {
					title: 'proyectoNIST company-service API',
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
	`[COMPANY_SVC] ejecutándose en http://${app.server?.hostname}:${app.server?.port}`
);
