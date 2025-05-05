# ProyectoNIST

Proyecto de microservicios backend construido con ElysiaJS y Bun, usando Firebase como backend NoSQL.

## Arquitectura

- **api-gateway**: Puerta de entrada para todas las peticiones externas. Redirige y controla el acceso a los microservicios internos.
- **user-service**: Microservicio dedicado a la autenticación y gestión de usuarios (registro, login, recuperación de contraseña, etc.) usando Firebase Auth y Firestore.

Cada microservicio es independiente y se comunica a través del API Gateway. El despliegue se realiza mediante Docker y Docker Compose.

## Tecnologías principales

- [Bun](https://bun.sh/) (runtime ultrarrápido para JavaScript/TypeScript)
- [ElysiaJS](https://elysiajs.com/) (framework web para Bun)
- [Firebase](https://firebase.google.com/) (Auth y Firestore)
- [Swagger](https://swagger.io/) (documentación interactiva de la API)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)

## Requisitos previos

- [Bun](https://bun.sh/) (última versión)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)

## Instalación y ejecución

1. Clona el repositorio:

   ```bash
   git clone https://github.com/PostboxRetinal/proyectoNIST.git
   cd proyectoNIST
   ```

2. Crea los archivos `.env` necesarios en cada microservicio

3. Instala y ejecuta docker para levantar el stack completo del proyecto

   ```bash
   docker-compose up --build
   ```

## Endpoints principales

- **User Service** (por defecto en `http://localhost:4001/api`):
  - `GET /api/swagger` — Documentación interactiva Swagger

- **API Gateway** (por defecto en `http://localhost:3001`):
  - Redirige las rutas públicas a los microservicios internos

## Scripts útiles

- `bun run dev` — Inicia el servicio en modo desarrollo con recarga automática
- `docker-compose up --build` — Levanta todos los servicios con Docker

---

Desarrollado con ❤️ usando Bun, ElysiaJS y Firebase.
