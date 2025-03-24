import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { Logestic } from 'logestic';

const api = new Elysia({ prefix: '/api' })
  .get('/', () => `Holap, Elysia!`)
  .get('/home', () => `Buenass`, )


const app = new Elysia()
	.state('version', '1.0.0')
	.use(api) // agrupación de rutas de la API de manera ordenada
	.use(swagger()) // localhost:3000/swagger para poder ver la documentación de la API
	.use(Logestic.preset('fancy')) //instancia de Logestic para loggear las peticiones en consola en 'fancy' mode
	.listen(Bun.env.PORT || 3000)

  console.log(
    `🦊 Elysia ejecutándose en http://${app.server?.hostname}:${app.server?.port}`
  );

