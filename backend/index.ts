Bun.serve({
    port: Bun.env.BACKEND_PORT,
    async fetch(request) {
        return new Response('Hello, World!');
    },
});