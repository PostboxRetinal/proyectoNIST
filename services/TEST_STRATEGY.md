# Estrategia de Pruebas para Servicios NIST

## Descripción General

Este documento describe el enfoque de pruebas para los microservicios del proyecto NIST.

## Enfoque de Pruebas

### Pruebas Unitarias

1. **Pruebas de Funciones Puras**: Probar funciones que no dependen de dependencias externas

   - Funciones de validación
   - Funciones de transformación de datos
   - Funciones de utilidad

2. **Pruebas de Integración Parcial**: Para funciones que interactúan con servicios externos
   - Usar inyección de dependencias manual donde sea posible
   - Probar la lógica de negocio independientemente de los servicios externos

### Categorías de Prueba por Servicio

#### Servicio de Formularios

- Pruebas de lógica de validación de formularios
- Pruebas de cálculo de puntuaciones de cumplimiento
- Pruebas de preparación de resultados de auditoría
- Pruebas de manejo de errores

#### Servicio de Empresas

- Pruebas de validación de tipos de negocio
- Pruebas de validación de rango de empleados
- Pruebas de validación de datos de empresa
- Pruebas de manejo de errores

#### Servicio de Usuarios

- Pruebas de validación de roles
- Pruebas de validación de datos de usuario
- Pruebas de manejo de errores

## Directrices de Implementación

1. Crear casos de prueba simples que no dependan de hacer mock de servicios externos
2. Utilizar inyección de dependencias donde sea posible para aislar la lógica de negocio
3. Crear factorías de datos de prueba para generar datos de prueba de manera consistente
4. Enfocarse en probar la lógica de negocio crítica en lugar de puntos de integración
