# Testing Guide for NIST Project

This document provides a comprehensive guide for the NIST project testing system, including test execution, coverage, and CI/CD.

## 🎯 **Current Testing Status**

- [x] **Complete Unit Tests**: All services have complete coverage
- [x] **Firebase Mocking**: Robust mock system for isolated testing
- [x] **Automated CI/CD**: Automatic testing and coverage in GitHub Actions
- [x] **Coverage Reports**: Automatic generation and publishing to GitHub Pages
- [x] **Route Testing**: Integration tests with Elysia

## Prerequisites

- [Bun](https://bun.sh/) (version 1.0.0+)
- All dependencies installed (run `bun install` in each service directory)
- Docker and Docker Compose (for testing with complete services)

## 🚀 **Test Execution**

### **Local Testing**

#### **Run all tests in a service:**

```bash
# Change to service directory
cd services/company-service
# or
cd services/forms-service  
# or
cd services/user-service

# Run all tests
bun test

# Run tests with coverage
bun run test:coverage

# Run in watch mode (auto-reload)
bun test --watch

# Open Vitest web interface
bun test --ui
```

#### **Run specific tests:**

```bash
# Tests from a specific file
bun test tests/unit/services/companyService.test.ts

# Tests by pattern
bun test --grep "should create company"

# Tests from a directory
bun test tests/unit/services/
```

### **Complete Testing Script**

To run all tests from all services:

```bash
#!/bin/bash
echo "Running all NIST project tests..."

services=("company-service" "forms-service" "user-service")

for service in "${services[@]}"; do
    echo "Testing $service..."
    cd services/$service
    bun test
    echo "$service completed"
    cd ../..
done

echo "All tests completed!"
```

## 📊 **Coverage Reports**

### **Local Generation**

```bash
# Generate coverage report for a service
cd services/company-service
bun run test:coverage

# Reports are generated in ./coverage/index.html
# Open in browser
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
```

### **Automatic CI/CD Reports**

Coverage reports are generated automatically and available at:

**[Coverage Dashboard on GitHub Pages](https://postboxretinal.github.io/proyectoNIST/coverage/)**

- [Company Service Coverage](https://postboxretinal.github.io/proyectoNIST/coverage/company-service/)
- [Forms Service Coverage](https://postboxretinal.github.io/proyectoNIST/coverage/forms-service/)  
- [User Service Coverage](https://postboxretinal.github.io/proyectoNIST/coverage/user-service/)

## 🏗️ **Test Structure**

Each service follows a consistent structure:

```yaml
services/<service-name>/
├── tests/
│   ├── setup.ts              # Global mock configuration
│   ├── helpers/              # Helpers and data factories
│   │   └── <service>TestHelpers.ts
│   └── unit/                 # Unit tests
│       ├── services/         # Business logic
│       ├── routes/           # API endpoints
│       └── utils/            # Utility functions
├── vitest.config.ts          # Vitest configuration
└── package.json              # Testing scripts
```

## 🧪 **Types of Tests**

### **1. Unit Tests**

Test individual components in isolation:

- **Business Services**: CRUD logic, validations, transformations
- **Validators**: Schemas and business rules
- **Utilities**: Helper and auxiliary functions
- **Constants**: Values and configurations

```bash
# Examples of unit test files
tests/unit/services/companyService.test.ts
tests/unit/services/userService.test.ts
tests/unit/utils/schemaValidator.test.ts
```

### **2. Integration Tests**

Test interaction between components:

- **API Routes**: Endpoint testing with Elysia
- **Data Flows**: From request to response
- **Authentication**: Middleware and permissions
- **Schema Validation**: API input/output

```bash
# Examples of integration test files
tests/unit/routes/companyRoutes.test.ts
tests/unit/routes/userRoutes.test.ts
```

### **3. Firebase Mocking**

Robust system to isolate tests from external dependencies:

- **Firestore**: Complete simulation of database operations
- **Firebase Auth**: Authentication and authorization mocking
- **Storage**: File operation simulation

```typescript
// Example configuration in tests/setup.ts
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  // ... more mocks
}));
```

## 🔄 **CI/CD and Automation**

### **GitHub Actions Workflows**

#### **Unit Tests Workflow** (`.github/workflows/unit-tests.yml`)

```yaml
# Runs tests automatically on every push/PR
- Install dependencies with Bun
- Run tests with coverage for each service
- Upload coverage artifacts
- Notify results
```

#### **Coverage Report Workflow** (`.github/workflows/coverage-report.yml`)

```yaml
# Runs after the tests workflow
- Download coverage artifacts from all services
- Combine reports in a unified dashboard
- Deploy to GitHub Pages automatically
```

### **CI/CD Triggers**

Tests run automatically when:

- **Push** to `master` or `tests` branches
- **Pull Request** to `master` or `tests`
- **Changes** in `services/` directory
- **Manual trigger** from GitHub Actions

### **Artifacts and Reports**

- **Coverage**: Stored as GitHub artifacts
- **Reports**: Combined and published to GitHub Pages
- **Logs**: Available in each workflow run
- **Notifications**: Test status in README badges

## 📋 **Command Summary**

```bash
# Most used commands
bun test                    # Run all tests
bun run test:coverage       # Run with coverage
bun test --watch           # Development mode with reload
bun test --ui              # Vitest web interface

# For local CI/CD
./scripts/test-all.sh      # Run all services
```

>**💡 For more information, check the [main README](./README_EN.MD) of the project.**
