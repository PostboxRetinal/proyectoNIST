import { Elysia, t } from 'elysia';
import { CompanyService } from '../services/companyService';
import {
	createCompanyValidator,
	updateCompanyValidator,
} from '../utils/schemaValidator';
import { createCompanyErrorResponse } from '../utils/companyErrors';

export function registerCompanyRoutes(app: Elysia<any>) {
	app
		.post(
			'/newCompany',
			async ({ body, error }) => {
				try {
					const companyData = body as any;

					// Crear la empresa en Firestore
					const company = await CompanyService.createCompany(companyData);

					return {
						success: true,
						message: 'Empresa creada exitosamente',
						company: {
							companyName: company.companyName,
							nit: company.nit,
							email: company.email,
							phone: company.phone,
							address: company.address,
							businessType: company.businessType,
							employeeRange: company.employeeRange,
						},
					};
				} catch (err: any) {
					const errorResponse = createCompanyErrorResponse(
						err,
						'Error al crear la empresa'
					);

					if (errorResponse.status === 409) {
						return error(409, {
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
				body: createCompanyValidator,
				response: {
					200: t.Object({
						success: t.Boolean(),
						message: t.String(),
						company: t.Object({
							companyName: t.String(),
							nit: t.String(),
							email: t.String(),
							phone: t.String(),
							address: t.String(),
							businessType: t.String(),
							employeeRange: t.String(),
						}),
					}),
					400: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
					409: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
					500: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
				},
				detail: {
					summary: 'Crear una nueva empresa',
					description: 'Crea una nueva empresa en Firestore',
					tags: ['Empresas'],
				},
			}
		)
		.get(
			'/nit/:nit',
			async ({ params, error }) => {
				try {
					const { nit } = params;

					// Obtener la empresa por su NIT
					const company = await CompanyService.getCompanyByNit(nit);

					return {
						success: true,
						company: {
							companyName: company.companyName,
							nit: company.nit,
							email: company.email,
							phone: company.phone,
							address: company.address,
							businessType: company.businessType,
							employeeRange: company.employeeRange,
							createdAt: company.createdAt,
							updatedAt: company.updatedAt,
						},
					};
				} catch (err: any) {
					const errorResponse = createCompanyErrorResponse(
						err,
						'Error al obtener la empresa'
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
				params: t.Object({
					nit: t.String(),
				}),
				response: {
					200: t.Object({
						success: t.Boolean(),
						company: t.Object({
							companyName: t.String(),
							nit: t.String(),
							email: t.String(),
							phone: t.String(),
							address: t.String(),
							businessType: t.String(),
							employeeRange: t.String(),
							createdAt: t.Number(),
							updatedAt: t.Number(),
						}),
					}),
					404: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
					500: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
				},
				detail: {
					summary: 'Obtener empresa por NIT',
					description: 'Obtiene una empresa por su NIT',
					tags: ['Empresas'],
				},
			}
		)
		.put(
			'/update/:nit',
			async ({ params, body, error }) => {
				try {
					const { nit } = params;
					const updateData = body as any;

					// Actualizar la empresa por NIT
					const updatedCompany = await CompanyService.updateCompanyByNit(
						nit,
						updateData
					);

					return {
						success: true,
						message: 'Empresa actualizada exitosamente',
						company: {
							companyName: updatedCompany.companyName,
							nit: updatedCompany.nit,
							email: updatedCompany.email,
							phone: updatedCompany.phone,
							address: updatedCompany.address,
							businessType: updatedCompany.businessType,
							employeeRange: updatedCompany.employeeRange,
							updatedAt: updatedCompany.updatedAt,
						},
					};
				} catch (err: any) {
					const errorResponse = createCompanyErrorResponse(
						err,
						'Error al actualizar la empresa'
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
				params: t.Object({
					nit: t.String(),
				}),
				body: updateCompanyValidator,
				response: {
					200: t.Object({
						success: t.Boolean(),
						message: t.String(),
						company: t.Object({
							companyName: t.String(),
							nit: t.String(),
							email: t.String(),
							phone: t.String(),
							address: t.String(),
							businessType: t.String(),
							employeeRange: t.String(),
							updatedAt: t.Number(),
						}),
					}),
					400: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
					404: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
					500: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
				},
				detail: {
					summary: 'Actualizar empresa',
					description: 'Actualiza los datos de una empresa',
					tags: ['Empresas'],
				},
			}
		);

	return app;
}
