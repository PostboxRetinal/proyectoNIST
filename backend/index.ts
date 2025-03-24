const server = Bun.serve({
    // entorno de desarrollo
	development: true,
	// puerto de ejecución
	port: parseInt(Bun.env.BACKEND_PORT || '4000'),
	// rutas de la API
	routes: {
		'/api/': () => new Response('REST API root', { status: 201 }),
		'/': () => new Response('root', { status: 201 }),
	},

	fetch(request) {
		// 404 no encontrado
		return new Response('404: NOT FOUND', { status: 404 });
	},
});

console.log(`Server ejecutando en puerto ${server.port}`);
