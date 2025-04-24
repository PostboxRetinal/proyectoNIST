import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { Logestic } from 'logestic';

const USER_SERVICE_URL = Bun.env.USER_SERVICE_URL || 'http://localhost:4001/api';

// configuración de server
const app = new Elysia()
	.state('version', '1.0.0')
	.post('/api/newUser', async ({ body, set }) => {
		// Proxy request to user-service
		const response = await fetch(`${USER_SERVICE_URL}/newUser`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		set.status = response.status;
		return await response.json();
	})
	.post('/api/loginUser', async ({ body, set }) => {
		const response = await fetch(`${USER_SERVICE_URL}/loginUser`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		set.status = response.status;
		return await response.json();
	})
	.post('/api/resetPassword', async ({ body, set }) => {
		const response = await fetch(`${USER_SERVICE_URL}/resetPassword`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		set.status = response.status;
		return await response.json();
	})
	.post('/api/updateProfile', async ({ body, set }) => {
		const response = await fetch(`${USER_SERVICE_URL}/updateProfile`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		set.status = response.status;
		return await response.json();
	})
	.post('/api/signOut', async ({ body, set }) => {
		const response = await fetch(`${USER_SERVICE_URL}/signOut`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		set.status = response.status;
		return await response.json();
	})
	.use(
		cors({
			origin: ['127.0.0.1', 'localhost', '0.0.0.0'], // permite el acceso desde localhost o 127.0.0.1 que es lo mismo
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
			allowedHeaders: ['Content-Type', 'Authorization'],
		})
	)
	.use(swagger()) // genera la documentación de la API
	.use(Logestic.preset('fancy')) // logs habilitados en CLI
	.listen(Bun.env.BACKEND_PORT || 3000);

console.log(
	`🦊 API GATEWAY ejecutándose en http://${app.server?.hostname}:${app.server?.port}`
);

//debugging .env test
// console.log(`FIREBASE_API_KEY: ${Bun.env.FIREBASE_API_KEY}`);
