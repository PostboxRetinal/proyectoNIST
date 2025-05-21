import { Elysia, t } from 'elysia';
import { AuditService } from '../services/auditService';
import { NistAudit } from '../schemas/formSchema';
import {
	auditValidator,
	auditIdValidator,
	errorResponseValidator,
} from '../utils/schemaValidator';
import { createAuditErrorResponse } from '../utils/auditErrors';

/**
 * Función para registrar las rutas relacionadas con los formularios de auditoría
 * @param app - Instancia de Elysia
 * @returns La instancia de Elysia con las rutas registradas
 */
export function registerAuditRoutes(app: Elysia<any>) {
	app
		// Guardar resultado de auditoría
		.post(
			'/newForm',
			async ({ body, error }) => {
				try {
					const auditData = body as NistAudit;

					// Preparar el resultado de auditoría
					const auditResult = AuditService.prepareAuditResultObject(auditData);

					// Guardar en Firestore
					const id = await AuditService.saveAuditResult(auditResult);

					return {
						success: true,
						message: 'Auditoría guardada exitosamente',
						auditId: id,
						result: {
							id: auditResult.id,
							program: auditResult.program,
							auditDate: auditResult.auditDate,
							completionPercentage: auditResult.completionPercentage,
						},
					};
				} catch (err: any) {
					const errorResponse = createAuditErrorResponse(
						err,
						'Error al procesar la auditoría'
					);

					// Only use status codes defined in the response schema (400 or 500)
					if (errorResponse.status === 400) {
						return error(400, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					} else {
						return error(500, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					}
				}
			},
			{
				body: auditValidator,
				response: {
					200: t.Object({
						success: t.Boolean(),
						message: t.String(),
						auditId: t.String(),
						result: t.Object({
							id: t.String(),
							program: t.String(),
							auditDate: t.Date(),
							completionPercentage: t.Number(),
						}),
					}),
					400: errorResponseValidator,
					500: errorResponseValidator,
				},
				detail: {
					summary: 'Procesar auditoría',
					description:
						'Procesa y guarda los resultados de una auditoría NIST 800-30',
					tags: ['Auditorías'],
				},
			}
		)

		// Obtener resultado de auditoría específico
		.get(
			'/getForms/:id',
			async ({ params, error }) => {
				try {
					const { id } = params;
					const auditResult = await AuditService.getAuditResult(id);

					return {
						success: true,
						audit: auditResult,
					};
				} catch (err: any) {
					const errorResponse = createAuditErrorResponse(
						err,
						'Error al obtener el resultado de auditoría'
					);

					if (errorResponse.status === 404) {
						return error(404, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					} else {
						return error(500, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					}
				}
			},
			{
				params: auditIdValidator,
				response: {
					200: t.Object({
						success: t.Boolean(),
						audit: t.Any(),
					}),
					404: errorResponseValidator,
					500: errorResponseValidator,
				},
				detail: {
					summary: 'Obtener resultado de auditoría',
					description:
						'Obtiene los detalles de una auditoría específica por su ID',
					tags: ['Auditorías'],
				},
			}
		)

		// Obtener todos los formularios
		.get(
			'/getForms',
			async ({ error }) => {
				try {
					const forms = await AuditService.getForms();
					return {
						success: true,
						forms,
					};
				} catch (err: any) {
					const errorResponse = createAuditErrorResponse(
						err,
						'Error al obtener los formularios'
					);

					return error(500, {
						success: false,
						message: errorResponse.message,
						errorCode: errorResponse.errorCode,
					});
				}
			},
			{
				response: {
					200: t.Object({
						success: t.Boolean(),
						forms: t.Array(t.Any()),
					}),
					500: errorResponseValidator,
				},
				detail: {
					summary: 'Obtener formularios',
					description: 'Retorna todos los formularios disponibles',
					tags: ['Formularios'],
				},
			}
		)

		// Actualizar una auditoría existente
		.put(
			'/update/:id',
			async ({ params, body, error }) => {
				try {
					const { id } = params;
					const auditData = body as NistAudit;

					// Preparar el resultado de auditoría actualizado
					const auditResult = AuditService.prepareAuditResultObject(auditData);

					// Actualizar en Firestore
					const result = await AuditService.updateAuditResult(id, auditResult);

					return {
						success: true,
						message: 'Auditoría actualizada exitosamente',
						auditId: id,
						result: {
							id: auditResult.id,
							program: auditResult.program,
							auditDate: auditResult.auditDate,
							completionPercentage: auditResult.completionPercentage,
						},
					};
				} catch (err: any) {
					const errorResponse = createAuditErrorResponse(
						err,
						'Error al actualizar la auditoría'
					);

					if (errorResponse.status === 404) {
						return error(404, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					} else if (errorResponse.status === 400) {
						return error(400, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					} else {
						return error(500, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					}
				}
			},
			{
				params: auditIdValidator,
				body: auditValidator,
				response: {
					200: t.Object({
						success: t.Boolean(),
						message: t.String(),
						auditId: t.String(),
						result: t.Object({
							id: t.String(),
							program: t.String(),
							auditDate: t.Date(),
							completionPercentage: t.Number()
						}),
					}),
					400: errorResponseValidator,
					404: errorResponseValidator,
					500: errorResponseValidator,
				},
				detail: {
					summary: 'Actualizar auditoría',
					description: 'Actualiza una auditoría existente por su ID',
					tags: ['Auditorías'],
				},
			}
		)

		// Eliminar una auditoría existente
		.delete(
			'/deleteForm/:id',
			async ({ params, error }) => {
				try {
					const { id } = params;
					await AuditService.deleteAuditResult(id);

					return {
						success: true,
						message: 'Auditoría eliminada exitosamente',
						auditId: id,
					};
				} catch (err: any) {
					const errorResponse = createAuditErrorResponse(
						err,
						'Error al eliminar la auditoría'
					);

					if (errorResponse.status === 404) {
						return error(404, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					} else {
						return error(500, {
							success: false,
							message: errorResponse.message,
							errorCode: errorResponse.errorCode,
						});
					}
				}
			},
			{
				params: auditIdValidator,
				response: {
					200: t.Object({
						success: t.Boolean(),
						message: t.String(),
						auditId: t.String(),
					}),
					404: errorResponseValidator,
					500: errorResponseValidator,
				},
				detail: {
					summary: 'Eliminar auditoría',
					description: 'Elimina una auditoría existente por su ID',
					tags: ['Auditorías'],
				},
			}
		);

	return app;
}
