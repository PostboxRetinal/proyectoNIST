# ProyectoNIST

Proyecto de microservicios backend construido con ElysiaJS y Bun, usando Firebase como backend NoSQL.

[![Unit Tests](https://github.com/PostboxRetinal/proyectoNIST/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/PostboxRetinal/proyectoNIST/actions/workflows/unit-tests.yml)
[![Coverage Report](https://github.com/PostboxRetinal/proyectoNIST/actions/workflows/coverage-report.yml/badge.svg)](https://github.com/PostboxRetinal/proyectoNIST/actions/workflows/coverage-report.yml)

## 🎯 **Estado del Proyecto**

- ✅ **Pruebas Unitarias**: Todos los servicios tienen cobertura completa de pruebas
- ✅ **Pipeline CI/CD**: Testing automatizado y reportes de cobertura
- ✅ **Mocking de Firebase**: Pruebas aisladas sin dependencias externas
- ✅ **Reportes de Cobertura**: Generación automática y despliegue en GitHub Pages
- ✅ **Arquitectura Multi-Servicio**: Servicios de Company, Forms y User

## 📊 Reportes de Cobertura

Los reportes de cobertura de pruebas están disponibles en: [**Dashboard de Cobertura**](https://postboxretinal.github.io/proyectoNIST/coverage/)

- [Cobertura del Servicio Company](https://postboxretinal.github.io/proyectoNIST/coverage/company-service/)
- [Cobertura del Servicio Forms](https://postboxretinal.github.io/proyectoNIST/coverage/forms-service/)
- [Cobertura del Servicio User](https://postboxretinal.github.io/proyectoNIST/coverage/user-service/)

## Arquitectura

- **api-gateway**: Puerta de entrada para todas las peticiones externas. Redirige y controla el acceso a los microservicios internos.
- **user-service**: Microservicio dedicado a la autenticación y gestión de usuarios (registro, login, recuperación de contraseña, etc.) usando Firebase Auth y Firestore.
- **company-service**: Microservicio para gestionar la información de empresas.
- **forms-service**: Microservicio para manejar los formularios y auditorías NIST.

Cada microservicio es independiente y se comunica a través del API Gateway. El despliegue se realiza mediante Docker y Docker Compose.

## Tecnologías principales

- [Bun](https://bun.sh/) (runtime ultrarrápido para JavaScript/TypeScript)
- [ElysiaJS](https://elysiajs.com/) (framework web para Bun)
- [Firebase](https://firebase.google.com/) (Auth y Firestore)
- [Swagger/OpenAPI](https://swagger.io/) (documentación interactiva de la API)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)
- [Vitest](https://vitest.dev/) (framework de testing para Bun/Node.js)
- [Elysia Swagger Plugin](https://elysiajs.com/plugins/swagger) (generación automática de documentación)

## Pruebas (Testing)

El proyecto incluye un sistema de testing robusto con CI/CD automatizado:

### 🧪 **Ejecutar Pruebas Localmente**

```bash
# Ejecutar pruebas en un servicio específico
cd services/company-service
bun test

# Ejecutar pruebas con cobertura
bun run test:coverage

# Ejecutar todas las pruebas en modo watch
bun test --watch
```

### 🔄 **Pipeline CI/CD**

- **Pruebas automáticas**: Se ejecutan en cada push y pull request
- **Cobertura**: Se genera automáticamente y se publica en GitHub Pages
- **Múltiples servicios**: company-service, forms-service, user-service
- **Mocking de Firebase**: Pruebas aisladas sin dependencias externas

### 📋 **Características de Testing**

- ✅ **Pruebas Unitarias**: Cobertura completa de servicios, rutas y validaciones
- ✅ **Mocking de Firebase**: Pruebas aisladas usando mocks de Vitest
- ✅ **Pruebas de Integración**: Testing de rutas con Elysia
- ✅ **Reportes de Cobertura**: Generación automática con reportes HTML
- ✅ **CI/CD**: GitHub Actions para pruebas y deployment

Para más información sobre testing, consulta [la guía de testing](TESTING.md).

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

## 📋 **Documentación API con Swagger**

### **🌐 Acceso a través del API Gateway (Recomendado)**

El API Gateway con nginx redirige automáticamente las peticiones a los servicios correspondientes:

- **User Service Swagger**: `http://localhost:3001/users/swagger`
- **Company Service Swagger**: `http://localhost:3001/companies/swagger`  
- **Forms Service Swagger**: `http://localhost:3001/forms/swagger`

### **🎯 Servicios y sus Endpoints**

**User Service** (acceso via `/users/`):

- Gestión de usuarios, autenticación, roles
- Swagger: `http://localhost:3001/users/swagger`

**Company Service** (acceso via `/companies/`):

- Gestión de empresas y organizaciones  
- Swagger: `http://localhost:3001/companies/swagger`

**Forms Service** (acceso via `/forms/`):

- Formularios y auditorías NIST
- Swagger: `http://localhost:3001/forms/swagger`

### 🔗 **Estructura de Endpoints**

```yaml
User Service (via API Gateway: /users/)
├── POST /users/register     - Registro de usuarios
├── POST /users/login        - Autenticación
├── GET /users/profile       - Perfil del usuario
├── PUT /users/profile       - Actualizar perfil
├── POST /users/forgot       - Recuperar contraseña
└── GET /users/roles         - Obtener roles disponibles

Company Service (via API Gateway: /companies/)
├── POST /companies/         - Crear empresa
├── GET /companies/          - Listar empresas
├── GET /companies/:id       - Obtener empresa por ID
├── PUT /companies/:id       - Actualizar empresa
├── DELETE /companies/:id    - Eliminar empresa
└── GET /companies/types     - Tipos de negocio

Forms Service (via API Gateway: /forms/)
├── POST /forms/             - Crear formulario
├── GET /forms/              - Listar formularios
├── GET /forms/:id           - Obtener formulario
├── PUT /forms/:id           - Actualizar formulario
├── POST /forms/:id/submit   - Enviar formulario
└── GET /forms/:id/report    - Generar reporte
```

> **💡 Nota**: Todos los endpoints están disponibles a través del API Gateway en `http://localhost:3001`. Las rutas internas de los servicios (puerto 4001, 4002, 4003) son para desarrollo directo.

### 🚀 **Cómo usar Swagger**

1. **Inicia los servicios**:

   ```bash
   docker-compose up --build
   ```

2. **Accede a la documentación a través del API Gateway**:

   - **User Service**: `http://localhost:3000/api/docs/user`
   - **Company Service**: `http://localhost:3000/api/docs/company`
   - **Forms Service**: `http://localhost:3000/api/docs/forms`

3. **Explora y prueba los endpoints**:

   - Navega por los endpoints disponibles
   - Prueba las peticiones directamente desde la interfaz
   - Visualiza los modelos de datos requeridos

4. **Autenticación en Swagger**:

   - Usa el endpoint `/users/login` para obtener un token JWT
   - Haz clic en "Authorize" en Swagger UI
   - Ingresa el token Bearer: `Bearer tu_token_jwt`
   - Ahora puedes acceder a endpoints protegidos

### 💡 **Beneficios de la Documentación Swagger**

- **Documentación Automática**: Se genera automáticamente desde los esquemas de validación
- **Testing Interactivo**: Prueba endpoints directamente desde el navegador
- **Validación de Esquemas**: Visualiza los modelos de datos requeridos
- **Autenticación Integrada**: Maneja tokens JWT directamente en la interfaz
- **Sincronización**: Siempre actualizada con el código actual
- **Acceso Unificado**: Todas las APIs accesibles desde un solo punto (API Gateway)

## Scripts útiles

### 🏗️ **Desarrollo**

- `bun run dev` — Inicia el servicio en modo desarrollo con recarga automática
- `docker-compose up --build` — Levanta todos los servicios con Docker

### 🧪 **Pruebas**

- `bun test` — Ejecuta todas las pruebas
- `bun run test:coverage` — Ejecuta pruebas con reporte de cobertura
- `bun test --watch` — Ejecuta pruebas en modo watch
- `bun test --ui` — Abre la interfaz web de Vitest

### 📊 **Cobertura**

- Los reportes se generan automáticamente en CI/CD
- Disponibles en: [Dashboard de Cobertura](https://postboxretinal.github.io/proyectoNIST/coverage/)

## 🚀 **Workflows de CI/CD**

- **Pruebas Unitarias**: `.github/workflows/unit-tests.yml` - Ejecuta pruebas en cada push
- **Reporte de Cobertura**: `.github/workflows/coverage-report.yml` - Genera y publica reportes de cobertura

## 🛠️ **Implementación Técnica**

### **Estrategia de Mocking de Firebase**

- **Mocks Globales**: Configurados en `tests/setup.ts` para cada servicio
- **Aislamiento de Pruebas**: Cada prueba se ejecuta en un entorno aislado
- **Sin Dependencias Externas**: Las pruebas no requieren conexión a Firebase real

### **Integración Continua**

- **Testing Multi-Servicio**: Pruebas paralelas para cada microservicio
- **Gestión de Artefactos**: Cobertura almacenada y combinada automáticamente
- **Despliegue en GitHub Pages**: Reportes publicados automáticamente

---

Desarrollado con ❤️ usando Bun, ElysiaJS y Firebase.
