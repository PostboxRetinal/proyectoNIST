import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { Logestic } from 'logestic';
import { cors } from '@elysiajs/cors';
import { registerUserRoutes } from './routes/userRoutes';

const app = new Elysia({ prefix: '/api' }); // <--- Aquí el prefijo

registerUserRoutes(app);

// Middlewares y configuración
app
    .use(
        cors({
            origin: ['127.0.0.1', 'localhost'],
            methods: ['GET', 'POST', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
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
    .listen(Bun.env.USER_SERVICE_PORT ?? 4001);

console.log(
    `🦊 User Service ejecutándose en http://${app.server?.hostname}:${app.server?.port}`
);