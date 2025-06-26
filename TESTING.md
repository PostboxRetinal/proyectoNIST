# Guía de Pruebas para el Proyecto NIST

Este documento proporciona una guía completa para el sistema de testing del proyecto NIST, incluyendo ejecución de pruebas, cobertura y CI/CD.

## 🎯 **Estado Actual del Testing**

- ✅ **Pruebas Unitarias Completas**: Todos los servicios tienen cobertura completa
- ✅ **Firebase Mocking**: Sistema robusto de mocks para testing aislado
- ✅ **CI/CD Automatizado**: Testing y cobertura automáticos en GitHub Actions
- ✅ **Reportes de Cobertura**: Generación y publicación automática en GitHub Pages
- ✅ **Testing de Rutas**: Pruebas de integración con Elysia

## Prerrequisitos

- [Bun](https://bun.sh/) (versión 1.0.0+)
- Todas las dependencias instaladas (ejecuta `bun install` en cada directorio de servicio)
- Docker y Docker Compose (para testing con servicios completos)

## 🚀 **Ejecución de Pruebas**

### **Pruebas Locales**

#### **Ejecutar todas las pruebas en un servicio:**

```bash
# Cambiar al directorio del servicio
cd services/company-service
# o
cd services/forms-service  
# o
cd services/user-service

# Ejecutar todas las pruebas
bun test

# Ejecutar pruebas con cobertura
bun run test:coverage

# Ejecutar en modo watch (recarga automática)
bun test --watch

# Abrir interfaz web de Vitest
bun test --ui
```

#### **Ejecutar pruebas específicas:**

```bash
# Pruebas de un archivo específico
bun test tests/unit/services/companyService.test.ts

# Pruebas por patrón
bun test --grep "should create company"

# Pruebas de un directorio
bun test tests/unit/services/
```

## 📊 **Reportes de Cobertura**

### **Generación Local**

```bash
# Generar reporte de cobertura para un servicio
cd services/company-service
bun run test:coverage

# Los reportes se generan en ./coverage/index.html
# Abrir en navegador
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
```

### **Reportes Automáticos en CI/CD**

Los reportes de cobertura se generan automáticamente y están disponibles en:

**🌐 [Dashboard de Cobertura en GitHub Pages](https://postboxretinal.github.io/proyectoNIST/coverage/)**

- [Cobertura Company Service](https://postboxretinal.github.io/proyectoNIST/coverage/company-service/)
- [Cobertura Forms Service](https://postboxretinal.github.io/proyectoNIST/coverage/forms-service/)  
- [Cobertura User Service](https://postboxretinal.github.io/proyectoNIST/coverage/user-service/)

## 🏗️ **Estructura de Pruebas**

Cada servicio sigue una estructura consistente:

```yaml
services/<service-name>/
├── tests/
│   ├── setup.ts              # Configuración global de mocks
│   ├── helpers/              # Ayudantes y factorías de datos
│   │   └── <service>TestHelpers.ts
│   └── unit/                 # Pruebas unitarias
│       ├── services/         # Lógica de negocio
│       ├── routes/           # Endpoints de API
│       └── utils/            # Funciones utilitarias
├── vitest.config.ts          # Configuración de Vitest
└── package.json              # Scripts de testing
```

## 🧪 **Tipos de Pruebas**

### **1. Pruebas Unitarias**

Prueban componentes individuales de forma aislada:

- **Servicios de Negocio**: Lógica de CRUD, validaciones, transformaciones
- **Validadores**: Esquemas y reglas de negocio
- **Utilidades**: Funciones auxiliares y helpers
- **Constantes**: Valores y configuraciones

```bash
# Ejemplos de archivos de pruebas unitarias
tests/unit/services/companyService.test.ts
tests/unit/services/userService.test.ts
tests/unit/utils/schemaValidator.test.ts
```

### **2. Pruebas de Integración**

Prueban la interacción entre componentes:

- **Rutas de API**: Testing de endpoints con Elysia
- **Flujos de Datos**: Desde request hasta response
- **Autenticación**: Middleware y permisos
- **Validación de Esquemas**: Input/output de APIs

```bash
# Ejemplos de archivos de pruebas de integración
tests/unit/routes/companyRoutes.test.ts
tests/unit/routes/userRoutes.test.ts
```

### **3. Mocking de Firebase**

Sistema robusto para aislar pruebas de dependencias externas:

- **Firestore**: Simulación completa de operaciones de base de datos
- **Firebase Auth**: Mocking de autenticación y autorización
- **Storage**: Simulación de operaciones de archivos

```typescript
// Ejemplo de configuración en tests/setup.ts
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  // ... más mocks
}));
```

## ⚙️ **Configuración del Sistema de Testing**

### **Vitest Configuration**

Cada servicio tiene un `vitest.config.ts` optimizado:

### **Setup Global (tests/setup.ts)**

Configuración de mocks globales para Firebase:

### **Package.json Scripts**

Scripts estandarizados en cada servicio:

## 🔄 **CI/CD y Automatización**

### **GitHub Actions Workflows**

#### **Unit Tests Workflow** (`.github/workflows/unit-tests.yml`)

```yaml
# Ejecuta pruebas automáticamente en cada push/PR
- Instala dependencias con Bun
- Ejecuta tests con cobertura para cada servicio
- Sube artifacts de cobertura
- Notifica resultados
```

#### **Coverage Report Workflow** (`.github/workflows/coverage-report.yml`)

```yaml
# Se ejecuta después del workflow de tests
- Descarga artifacts de cobertura de todos los servicios
- Combina reportes en un dashboard unificado
- Despliega a GitHub Pages automáticamente
```

### **Triggers de CI/CD**

Las pruebas se ejecutan automáticamente cuando:

- 🚀 **Push** a ramas `master` o `tests`
- 🔀 **Pull Request** hacia `master` o `tests`
- 📁 **Cambios** en el directorio `services/`
- 🔧 **Trigger manual** desde GitHub Actions

### **Artifacts y Reportes**

- **📊 Cobertura**: Almacenada como artifacts de GitHub
- **📈 Reportes**: Combinados y publicados en GitHub Pages
- **🔍 Logs**: Disponibles en cada workflow run
- **📋 Notificaciones**: Estado de tests en badges del README

## 📋 **Resumen de Comandos**

```bash
# Comandos más utilizados
bun test                    # Ejecutar todas las pruebas
bun run test:coverage       # Ejecutar con cobertura
bun test --watch           # Modo desarrollo con recarga
bun test --ui              # Interfaz web de Vitest

# Para CI/CD local
./scripts/test-all.sh      # Ejecutar todos los servicios
```

**🎯 Para más información, consulta el [README principal](./README.MD) del proyecto.**
