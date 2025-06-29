# ProyectoNIST

Backend microservices project built with ElysiaJS and Bun, using Firebase as NoSQL backend.

[![Unit Tests](https://github.com/PostboxRetinal/proyectoNIST/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/PostboxRetinal/proyectoNIST/actions/workflows/unit-tests.yml)
[![Coverage Report](https://github.com/PostboxRetinal/proyectoNIST/actions/workflows/coverage-report.yml/badge.svg)](https://github.com/PostboxRetinal/proyectoNIST/actions/workflows/coverage-report.yml)

## 👷🏾‍♂️ **Project Status**

- [x] **Unit Tests**: All services have complete test coverage
- [x] **CI/CD Pipeline**: Automated testing and coverage reports
- [x] **Firebase Mocking**: Isolated tests without external dependencies
- [x] **Coverage Reports**: Automatic generation and deployment to GitHub Pages
- [x] **Multi-Service Architecture**: Company, Forms, and User services

## 🧪 **Test Coverage Reports**

Test coverage reports are available at: [**Coverage Dashboard**](https://postboxretinal.github.io/proyectoNIST/coverage/)

- [Company Service Coverage](https://postboxretinal.github.io/proyectoNIST/coverage/company-service/)
- [Forms Service Coverage](https://postboxretinal.github.io/proyectoNIST/coverage/forms-service/)
- [User Service Coverage](https://postboxretinal.github.io/proyectoNIST/coverage/user-service/)

## ⚙️ **Architecture**

- **api-gateway**: Entry point for all external requests. Redirects and controls access to internal microservices.
- **user-service**: Microservice dedicated to authentication and user management (registration, login, password recovery, etc.) using Firebase Auth and Firestore.
- **company-service**: Microservice for managing company information.
- **forms-service**: Microservice for handling NIST forms and audits.

Each microservice is independent and communicates through the API Gateway. Deployment is done using Docker and Docker Compose.

## 🧰 **Main Technologies**

- [Bun](https://bun.sh/) (ultra-fast runtime for JavaScript/TypeScript)
- [ElysiaJS](https://elysiajs.com/) (web framework for Bun)
- [Firebase](https://firebase.google.com/) (Auth and Firestore)
- [Swagger/OpenAPI](https://swagger.io/) (interactive API documentation)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Vitest](https://vitest.dev/) (testing framework for Bun/Node.js)
- [Elysia Swagger Plugin](https://elysiajs.com/plugins/swagger) (automatic documentation generation)

## ⚠️ Prerequisites

- Already created .env files
- [Bun](https://bun.sh/) (latest version)
- [Docker](https://www.docker.com/) / [Docker Compose](https://docs.docker.com/compose/) / [Podman](https://podman.io)

## 💻 **Installation and Execution**

1. Clone the repository:

   ```bash
   git clone https://github.com/PostboxRetinal/proyectoNIST.git
   cd proyectoNIST
   ```

2. Create the necessary `.env` files in each microservice

3. Install and run docker to start the complete project stack

   ```bash
   docker-compose up --build
   ```

### **Access through API Gateway (Recommended)**

The API Gateway with nginx automatically redirects requests to the corresponding services:

### **Endpoint Structure**

```yaml
User Service (via API Gateway: /api/users/)
├── POST /users/register     - User registration
├── POST /users/login        - Authentication
├── GET /users/profile       - User profile
├── PUT /users/profile       - Update profile
├── POST /users/forgot       - Password recovery
└── GET /users/roles         - Get available roles

Company Service (via API Gateway: /api/companies/)
├── POST /companies/         - Create company
├── GET /companies/          - List companies
├── GET /companies/:id       - Get company by ID
├── PUT /companies/:id       - Update company
├── DELETE /companies/:id    - Delete company
└── GET /companies/types     - Business types

Forms Service (via API Gateway: /api/forms/)
├── POST /forms/             - Create form
├── GET /forms/              - List forms
├── GET /forms/:id           - Get form
├── PUT /forms/:id           - Update form
├── POST /forms/:id/submit   - Submit form
└── GET /forms/:id/report    - Generate report
```

> **💡 Note**: All endpoints are available through the API Gateway at `http://localhost:3001`. Internal service routes (ports 4001, 4002, 4003) are for direct development.

## 📋 **API Documentation with Swagger**

1. **Start the services**:

   ```bash
   docker-compose up --build
   ```

2. **Access documentation through API Gateway**:

   - **User Service**: `http://localhost:3000/api/docs/user`
   - **Company Service**: `http://localhost:3000/api/docs/company`
   - **Forms Service**: `http://localhost:3000/api/docs/forms`

3. **Explore and test endpoints**:

   - Navigate through available endpoints
   - Test requests directly from the interface
   - Visualize required data models

## 🪧 **Useful Scripts**

### **Development**

- `bun run dev` — Start service in development mode with auto-reload
- `docker-compose up --build` — Start all services with Docker

### **Testing**

- `bun test` — Run all tests
- `bun run test:coverage` — Run tests with coverage report
- `bun test --watch` — Run tests in watch mode
- `bun test --ui` — Open Vitest web interface

### **Coverage**

- Reports are generated automatically in CI/CD
- Available at: [Coverage Dashboard](https://postboxretinal.github.io/proyectoNIST/coverage/)

## ⏳ **CI/CD Workflows**

- **Unit Tests**: `.github/workflows/unit-tests.yml` - Runs tests on every push
- **Coverage Report**: `.github/workflows/coverage-report.yml` - Generates and publishes coverage reports

## 🧑🏾‍💻 **Technical Implementation**

### **Firebase Mocking Strategy**

- **Global Mocks**: Configured in `tests/setup.ts` for each service
- **Test Isolation**: Each test runs in an isolated environment
- **No External Dependencies**: Tests don't require real Firebase connection

### **Testing Architecture**

- **Vitest Configuration**: Optimized for Bun runtime
- **Setup Files**: Global configuration of mocks and utilities
- **Test Helpers**: Auxiliary functions for testing in `tests/helpers/`
- **Coverage Reports**: Automatic generation with detailed metrics

### **Continuous Integration**

- **Multi-Service Testing**: Parallel tests for each microservice
- **Artifact Management**: Coverage stored and combined automatically
- **GitHub Pages Deployment**: Reports published automatically

---

Developed with ❤️ using Bun, ElysiaJS and Firebase.
