/**
 * Constantes para las puntuaciones de las respuestas de auditoría
 */
export const RESPONSE_SCORES = {
    yes: 100,
    partial: 50,
    no: 0,
    na: 100, // No aplica se considera como cumplimiento completo
};

/**
 * Colecciones de Firestore utilizadas en el servicio
 */
export const FIRESTORE_COLLECTIONS = {
    AUDIT_TEMPLATES: 'templates',
    AUDIT_RESULTS: 'audit-results'
};

/**
 * ID del template NIST 800-30 en Firestore
 */
export const NIST_TEMPLATE_ID = 'nist-800-30';

/**
 * Niveles de riesgo para auditorías
 */
export const RISK_LEVELS = {
    HIGH: 'Alto',
    MEDIUM: 'Medio',
    LOW: 'Bajo'
} as const;

/**
 * Valores posibles para las respuestas
 */
export const OPTION_VALUES = ['yes', 'partial', 'no', 'na'] as const;