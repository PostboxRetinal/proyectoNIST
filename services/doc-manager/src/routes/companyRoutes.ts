import { Elysia, t } from 'elysia';
import { CompanyService } from '../services/companyService';
import {
	createCompanyValidator,
	updateCompanyValidator,
} from '../utils/schemaValidator';
import { createCompanyErrorResponse } from '../utils/companyErrors';
import { VALID_BUSINESS_TYPES } from '../constants/businessTypes';

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
							id: company.id,
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
							id: t.String(),
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
			'/:companyId',
			async ({ params, error }) => {
				try {
					const { companyId } = params;

					// Obtener la empresa por su ID
					const company = await CompanyService.getCompanyById(companyId);

					return {
						success: true,
						company: {
							id: company.id,
							companyName: company.companyName,
							nit: company.nit,
							email: company.email,
							phone: company.phone,
							address: company.address,
							businessType: company.businessType,
							employeeRange: company.employeeRange,
							createdAt: company.createdAt,
							updatedAt: company.updatedAt,
							userId: company.userId,
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
					companyId: t.String(),
				}),
				response: {
					200: t.Object({
						success: t.Boolean(),
						company: t.Object({
							id: t.String(),
							companyName: t.String(),
							nit: t.String(),
							email: t.String(),
							phone: t.String(),
							address: t.String(),
							businessType: t.String(),
							employeeRange: t.String(),
							createdAt: t.Number(),
							updatedAt: t.Number(),
							userId: t.String(),
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
					summary: 'Obtener empresa por ID',
					description: 'Obtiene una empresa por su ID',
					tags: ['Empresas'],
				},
			}
		)
		.get(
			'/user/:userId',
			async ({ params, error }) => {
				try {
					const { userId } = params;

					// Obtener todas las empresas de un usuario
					const companies = await CompanyService.getCompaniesByUser(userId);

					return {
						success: true,
						companies: companies.map((company) => ({
							id: company.id,
							companyName: company.companyName,
							nit: company.nit,
							email: company.email,
							phone: company.phone,
							address: company.address,
							businessType: company.businessType,
							employeeRange: company.employeeRange,
							createdAt: company.createdAt,
							updatedAt: company.updatedAt,
						})),
					};
				} catch (err: any) {
					const errorResponse = createCompanyErrorResponse(
						err,
						'Error al obtener las empresas del usuario'
					);

					return error(500, {
						success: false,
						message: errorResponse.message,
						errorCode: errorResponse.errorCode,
					});
				}
			},
			{
				params: t.Object({
					userId: t.String(),
				}),
				response: {
					200: t.Object({
						success: t.Boolean(),
						companies: t.Array(
							t.Object({
								id: t.String(),
								companyName: t.String(),
								nit: t.String(),
								email: t.String(),
								phone: t.String(),
								address: t.String(),
								businessType: t.String(),
								employeeRange: t.String(),
								createdAt: t.Number(),
								updatedAt: t.Number(),
							})
						),
					}),
					500: t.Object({
						success: t.Boolean(),
						message: t.String(),
						errorCode: t.Optional(t.String()),
					}),
				},
				detail: {
					summary: 'Obtener empresas por usuario',
					description: 'Obtiene todas las empresas asociadas a un usuario',
					tags: ['Empresas'],
				},
			}
		)
		.put(
			'/update/:companyId',
			async ({ params, body, error }) => {
				try {
					const { companyId } = params;
					const updateData = body as any;

					// Actualizar la empresa
					const updatedCompany = await CompanyService.updateCompany(
						companyId,
						updateData
					);

					return {
						success: true,
						message: 'Empresa actualizada exitosamente',
						company: {
							id: updatedCompany.id,
							companyName: updatedCompany.companyName,
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
					companyId: t.String(),
				}),
				body: updateCompanyValidator,
				response: {
					200: t.Object({
						success: t.Boolean(),
						message: t.String(),
						company: t.Object({
							id: t.String(),
							companyName: t.String(),
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
		)
		.get(
			'/types',
			() => {
				return {
					success: true,
					businessTypes: [...VALID_BUSINESS_TYPES],
				};
			},
			{
				response: {
					200: t.Object({
						success: t.Boolean(),
						businessTypes: t.Array(t.String()),
					}),
				},
				detail: {
					summary: 'Obtener tipos de empresas',
					description: 'Obtiene la lista de tipos de empresas válidos',
					tags: ['Empresas'],
				},
			}
		);

	return app;
}
