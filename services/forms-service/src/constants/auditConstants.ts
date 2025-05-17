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
 * Valores posibles para las respuestas
 */
export const OPTION_VALUES = ['yes', 'partial', 'no', 'na'] as const;