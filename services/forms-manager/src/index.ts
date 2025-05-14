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
			origin: ['http://api-gateway:80', 'http://localhost:5173'],
			methods: ['GET', 'POST', 'PUT', 'DELETE'],
			allowedHeaders: ['Content-Type', 'Authorization', 'X-Gateway-Source'],
			credentials: true,
		})
	)
	.use(
		swagger({
			documentation: {
				info: {
					title: 'proyectoNIST forms-manager service API',
					version: '1.0.0',
					description: 'API para gestionar auditorías NIST 800-30',
				},
				tags: [
					{
						name: 'Auditorías',
						description: 'Operaciones relacionadas con auditorías NIST 800-30',
					},
				],
				components: {
					securitySchemes: {
						apiKey: {
							type: 'apiKey',
							name: 'X-Gateway-Source',
							in: 'header',
							description: 'API key para validar el origen de la petición',
						},
					},
				},
			},
		})
	)
	.use(logger({ includeIp: true }))
	.use(registerAuditRoutes)
	.listen(Bun.env.PORT || 4003);

console.log(
	`🚨 NIST 800-30 Audit app is running at ${app.server?.hostname}:${app.server?.port}`
);
