# ProyectoNIST - Test Coverage Reports

This branch contains the automatically generated test coverage reports for the ProyectoNIST microservices platform.

## 📊 Coverage Reports

This repository hosts comprehensive test coverage reports for all microservices in the ProyectoNIST platform:

- **[Company Service Coverage](coverage/company-service/index.html)** - User company management service
- **[Forms Service Coverage](coverage/forms-service/index.html)** - NIST audit forms and questionnaires service  
- **[User Service Coverage](coverage/user-service/index.html)** - Authentication and user management service

## 🔍 How to View Reports

1. **GitHub Pages**: Visit the live coverage reports at `https://[username].github.io/proyectoNIST/coverage/`
2. **Local Development**: Clone this branch and open `coverage/[service-name]/index.html` in your browser

## 📈 Coverage Metrics

Each service report includes:

- **Line Coverage**: Percentage of code lines executed during tests
- **Branch Coverage**: Percentage of conditional branches tested
- **Function Coverage**: Percentage of functions called during tests
- **Statement Coverage**: Percentage of statements executed

## 🔄 Automated Updates

These coverage reports are automatically generated and updated by:

- **CI/CD Pipeline**: GitHub Actions workflow on every push to main branch
- **Test Runner**: Vitest with coverage collection enabled
- **Publisher**: Automated deployment to GitHub Pages

## 📂 Directory Structure

```text
coverage/
├── company-service/     # Company management service coverage
├── forms-service/       # Forms service coverage
├── user-service/        # User service coverage
└── index.html          # Main coverage dashboard
```

## 🎯 Coverage Goals

- **Target**: 100% test coverage across all services
- **Threshold**: Minimum 95% coverage required for CI/CD pipeline
- **Quality Gate**: All services must maintain high coverage standards

## 🔗 Related Links

- [Main Repository](https://github.com/[username]/proyectoNIST) - Source code and documentation
- [API Documentation](https://github.com/[username]/proyectoNIST/tree/main/docs) - Swagger/OpenAPI specs
- [Deployment Guide](https://github.com/[username]/proyectoNIST/blob/main/README.md) - Setup and deployment instructions

---

*This branch is automatically maintained by the CI/CD pipeline. Do not manually edit coverage files.*
