import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { registerAuditRoutes } from './routes/routes';
import { swagger } from '@elysiajs/swagger';
import { logger } from '@rasla/logify';
import { validateFirebaseConfig } from './firebase/firebase';

// Validar configuración de Firebase al iniciar
validateFirebaseConfig();

const app = new Elysia({ prefix: '/api/forms' });
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
					title: 'proyectoNIST forms-service service API',
					version: '1.0.0',
					description: 'API para gestionar auditorías NIST 800-30',
				},
				tags: [
					{
						name: 'Auditorías',
						description: 'Operaciones relacionadas con auditorías NIST 800-30',
					},
					{
						name: 'Formularios',
						description:
							'Operaciones relacionadas con formularios de auditoría',
					},
				],
				servers: [
					{
						url: 'http://localhost:3000',
						description: 'Servidor de desarrollo local',
					},
				],
			},
		})
	)
	.use(logger({ includeIp: true }))
	.use(registerAuditRoutes)
	.listen(Bun.env.PORT ?? 4003);

console.log(
	`[FORM_SVC] ejecutándose en http://${app.server?.hostname}:${app.server?.port}`
);
