import { t } from 'elysia';

// Definición de valores constantes para opciones
export const OPTION_VALUES = ['yes', 'partial', 'no', 'na'] as const;
export type OptionValue = (typeof OPTION_VALUES)[number];

// Esquema para la validación de opciones de respuesta
export const optionValidator = t.Object({
	value: t.String({
		enum: OPTION_VALUES,
		error: 'El valor debe ser "yes", "partial", "no" o "na"',
	}),
	label: t.String({ minLength: 1, maxLength: 50 }),
	description: t.String({ minLength: 0, maxLength: 500 }),
});

// Esquema para la validación de preguntas
export const questionValidator = t.Object({
	id: t.String({ minLength: 1, maxLength: 50 }),
	text: t.String({ minLength: 1, maxLength: 500 }),
	options: t.Array(optionValidator),
	response: t.Union([t.String({ enum: OPTION_VALUES }), t.Null()]),
	observations: t.String({ maxLength: 1000 }),
	evidence_url: t.String({ maxLength: 500 }),
});

// Esquema para la validación de subsecciones
export const subsectionValidator = t.Object({
	subsection: t.String({ minLength: 1, maxLength: 50 }),
	title: t.String({ minLength: 1, maxLength: 100 }),
	questions: t.Array(questionValidator),
});

// Esquema para la validación de secciones
export const sectionValidator = t.Object({
	section: t.String({ minLength: 1, maxLength: 50 }),
	title: t.String({ minLength: 1, maxLength: 100 }),
	subsections: t.Array(subsectionValidator),
});

// Esquema para la auditoría NIST completa
export const auditValidator = t.Object({
	program: t.String({
		minLength: 1,
		maxLength: 100,
		error: 'El nombre del programa es requerido',
	}),
	sections: t.Array(sectionValidator),
});

// Esquema para el ID de auditoría
export const auditIdValidator = t.Object({
	id: t.String({
		minLength: 1,
		error: 'El ID de auditoría es requerido',
	}),
});

// Esquema para la recepción de los resultados de auditoría
export const auditResultValidator = t.Object({
	id: t.Optional(t.String()),
	auditDate: t.String(),
	completionPercentage: t.Number({ minimum: 0, maximum: 100 }),
	sections: t.Record(
		t.String(),
		t.Object({
			completionPercentage: t.Number({ minimum: 0, maximum: 100 }),
			questions: t.Record(
				t.String(),
				t.Object({
					response: t.Union([t.String({ enum: OPTION_VALUES }), t.Null()]),
					observations: t.String(),
					evidence_url: t.String(),
				})
			),
		})
	),
});

// Esquema para las respuestas de errores comunes
export const errorResponseValidator = t.Object({
	success: t.Boolean(),
	message: t.String(),
	errorCode: t.Optional(t.String()),
});

// Ejemplo de cómo hacer una petición para guardar una auditoría
/**
 * Para hacer una petición POST basada en esta estructura:
 *
 * ```javascript
 * // Ejemplo de uso en un cliente
 * const response = await fetch('/api/audit', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *   },
 *   body: JSON.stringify({
 *     program: "Programa de Auditoría para NIST 800-30 (Ciclo PDCA)",
 *     sections: [
 *       {
 *         section: "1",
 *         title: "PLANIFICAR (PLAN)",
 *         subsections: [
 *           {
 *             subsection: "1.1",
 *             title: "Risk Framing",
 *             questions: [
 *               {
 *                 id: "1.1.1",
 *                 text: "¿Existe una estrategia de gestión de riesgos documentada que incluya roles y responsabilidades?",
 *                 options: [
 *                   { value: "yes", label: "Sí", description: "Estrategia documentada y aprobada" },
 *                   { value: "partial", label: "Parcialmente", description: "Estrategia en desarrollo o incompleta" },
 *                   { value: "no", label: "No", description: "Sin estrategia documentada" },
 *                   { value: "na", label: "No aplica", description: "" }
 *                 ],
 *                 response: "yes",
 *                 observations: "Se verificó la existencia del documento en el repositorio",
 *                 evidence_url: "https://ejemplo.com/evidencia1.pdf"
 *               },
 *               // Más preguntas...
 *             ]
 *           },
 *           // Más subsecciones...
 *         ]
 *       },
 *       // Más secciones...
 *     ]
 *   })
 * });
 *
 * const result = await response.json();
 * // Result contendrá el ID de la auditoría y otros datos del resultado
 * ```
 */
