# Automatización CI/CD para Tests Unitarios

Este documento explica cómo se ha implementado la automatización de CI/CD para los tests unitarios del proyecto NIST.

## Workflows de GitHub Actions

Se han configurado los siguientes workflows:

### 1. Unit Tests (`unit-tests.yml`)

Ejecuta todas las pruebas unitarias en todos los servicios cuando:

- Se hace push a `master` o `feature/integration-frontend-backend`
- Se crea una Pull Request hacia `master` o `feature/integration-frontend-backend`
- Se activa manualmente desde GitHub

Características:

- Ejecuta pruebas en paralelo para cada servicio
- Genera reportes de cobertura
- Almacena los reportes como artefactos

### 2. Coverage Report (`coverage-report.yml`)

Genera un informe combinado de cobertura de pruebas después de que se ejecuta con éxito el workflow de "Unit Tests".

Características:

- Combina los reportes de cobertura de todos los servicios
- Publica el informe en GitHub Pages
- Crea un índice HTML para navegar entre informes

### 3. Pull Request Tests (`pr-tests.yml`)

Ejecuta pruebas específicas cuando se crea una Pull Request:

Características:

- Identifica servicios afectados por los cambios
- Ejecuta pruebas solo para los servicios afectados
- Reduce el tiempo de ejecución de CI/CD

### 4. Targeted Tests (`targeted-tests.yml`)

Ejecuta pruebas específicas relacionadas con los archivos modificados:

Características:

- Identifica archivos específicos que han cambiado
- Encuentra pruebas asociadas basadas en nombres de archivo
- Ejecuta solo las pruebas relevantes para los cambios

## Cómo usarlo

### Para desarrolladores:

1. **Desarrollo normal**: Simplemente haz `push` a tu rama. Si estás trabajando en `master` o `feature/integration-frontend-backend`, los tests se ejecutarán automáticamente.

2. **Pull Requests**: Al crear un PR hacia `master` o `feature/integration-frontend-backend`, los tests se ejecutarán automáticamente.

3. **Ejecución manual**: Puedes ejecutar los workflows manualmente desde la pestaña "Actions" en GitHub.

### Para ver los resultados:

1. **Resultados de pruebas**: Ve a la pestaña "Actions" y haz clic en cualquier ejecución del workflow para ver detalles.

2. **Informes de cobertura**: Una vez que se complete el workflow de "Coverage Report", los informes estarán disponibles en GitHub Pages.

## Configuración de GitHub Pages

Para habilitar GitHub Pages para los informes de cobertura:

1. Ve a Settings > Pages
2. Selecciona la rama `gh-pages` y la carpeta `/ (root)`
3. Haz clic en Save

## Solución de problemas

Si tienes problemas con los workflows:

1. Verifica la pestaña "Actions" para ver logs detallados
2. Asegúrate de que tus pruebas pasen localmente antes de hacer `push`
3. Verifica que los permisos de GitHub Actions estén configurados correctamente

## Próximos pasos

- Implementar notificaciones de Slack/Discord/Teams para fallos en pruebas
- Agregar análisis de tendencias de cobertura
- Configurar reglas de protección de ramas basadas en resultados de pruebas
