# Guía de Pruebas para los Servicios del Proyecto NIST

Este documento proporciona instrucciones para ejecutar pruebas para cada microservicio en el proyecto NIST.

## Prerrequisitos

- Asegúrate de tener instalado [Bun](https://bun.sh/) (versión 1.0.0+)
- Todas las dependencias están instaladas (ejecuta `bun install` en cada directorio de servicio)

## Enfoque Actual de Pruebas

El proyecto utiliza un enfoque de pruebas centrado que prioriza la prueba de funciones puras y lógica de negocio que no dependen de dependencias externas. Este enfoque fue adoptado debido a desafíos de compatibilidad entre Bun, Vitest y ciertos patrones de mocking.

### Ejecución de Pruebas

Para ejecutar todas las pruebas actuales que funcionan:

```bash
cd /path/to/proyectoNIST
echo "Ejecutando Pruebas del Servicio de Empresas:" && \
cd services/company-service && bun test tests/unit/services/companyValidation.test.ts && \
echo -e "\nEjecutando Pruebas del Servicio de Usuarios:" && \
cd ../user-service && bun test tests/unit/services/userValidation.test.ts && \
echo -e "\nEjecutando Pruebas del Servicio de Formularios:" && \
cd ../forms-service && bun test tests/unit/utils/schemaValidator.test.ts
```

## Estructura de Pruebas

Cada servicio sigue una estructura de pruebas similar:

```
services/
  <service-name>/
    tests/
      helpers/      # Ayudantes de prueba y factorías
      unit/
        services/   # Pruebas para clases de servicio
        utils/      # Pruebas para funciones de utilidad
```

### Pruebas Unitarias

Nuestras pruebas unitarias se centran en:

1. **Funciones Puras**: Pruebas de funciones que no dependen de dependencias externas

   - Funciones de validación (ej., `isValidRole`, `isValidBusinessType`)
   - Constantes y validadores de esquemas
   - Funciones de utilidad

2. **Ayudantes de Pruebas**: Funciones de factoría para generar datos de prueba consistentemente

## Notas de Compatibilidad

Al trabajar con Vitest y Bun, hemos encontrado algunos problemas de compatibilidad:

1. **Limitaciones de Mocking**: Los patrones complejos de `vi.mock()` pueden no funcionar como se espera con el runtime de Bun
2. **Mocking de Importaciones**: El enfoque estándar para hacer mock de importaciones tiene limitaciones

La recomendación actual es:

- Centrarse en probar la lógica de negocio pura sin mocks
- Utilizar patrones de inyección de dependencias cuando sea posible
- Crear objetos de prueba simplificados con ayudantes de pruebas

## Escribiendo Nuevas Pruebas

Al crear nuevas pruebas:

1. Céntrate en probar funciones puras que no requieran mocking complejo
2. Utiliza las factorías de ayudantes de prueba para crear datos de prueba consistentes
3. Mantén las pruebas centradas en un solo aspecto de la funcionalidad
4. Utiliza nombres de prueba descriptivos que expliquen qué se está probando
5. Para funciones que interactúan con dependencias externas, considera escribir pruebas simplificadas que verifiquen la lógica central

## Mejoras Futuras

A medida que mejore la compatibilidad entre Bun y Vitest, planeamos expandir el conjunto de pruebas para incluir:

- Pruebas de servicio más completas con mocking adecuado de dependencias
- Pruebas de rutas para verificar el comportamiento de la API
- Pruebas de integración para flujos críticos de usuario
- Informes de cobertura de pruebas
