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

					// Convertir los objetos Timestamp de Firestore a formatos compatibles si se incluyen en la respuesta
					const createdAt =
						company.createdAt instanceof Date
							? company.createdAt
							: company.createdAt &&
							  typeof company.createdAt === 'object' &&
							  'seconds' in company.createdAt
							? new Date(
									(company.createdAt as { seconds: number }).seconds * 1000
							  )
							: new Date();

					const updatedAt =
						company.updatedAt instanceof Date
							? company.updatedAt
							: company.updatedAt &&
							  typeof company.updatedAt === 'object' &&
							  'seconds' in company.updatedAt
							? new Date(
									(company.updatedAt as { seconds: number }).seconds * 1000
							  )
							: new Date();

					return {
						success: true,
						message: 'Empresa creada exitosamente',
						company: {
							nit: company.nit,
							companyName: company.companyName,
							email: company.email,
							phone: company.phone,
							address: company.address,
							businessType: company.businessType,
							employeeRange: company.employeeRange,
							createdAt: createdAt,
							updatedAt: updatedAt,
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
							createdAt: t.Date(),
							updatedAt: t.Date(),
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
			'/getNit/:nit',
			async ({ params, error }) => {
				try {
					const { nit } = params;

					// Obtener la empresa por su NIT
					const company = await CompanyService.getCompanyByNit(nit);

					// Convertir los objetos Timestamp de Firestore a formatos compatibles
					const createdAt =
						company.createdAt instanceof Date
							? company.createdAt
							: company.createdAt &&
							  typeof company.createdAt === 'object' &&
							  'seconds' in company.createdAt
							? new Date((company.createdAt as any).seconds * 1000)
							: new Date();

					const updatedAt =
						company.updatedAt instanceof Date
							? company.updatedAt
							: company.updatedAt &&
							  typeof company.updatedAt === 'object' &&
							  'seconds' in company.updatedAt
							? new Date((company.updatedAt as any).seconds * 1000)
							: new Date();

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
							createdAt: createdAt,
							updatedAt: updatedAt,
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
							createdAt: t.Date(),
							updatedAt: t.Date(),
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

					// Convertir el objeto Timestamp de updatedAt a un formato compatible
					const updatedAtDate =
						updatedCompany.updatedAt instanceof Date
							? updatedCompany.updatedAt
							: updatedCompany.updatedAt &&
							  typeof updatedCompany.updatedAt === 'object' &&
							  'seconds' in updatedCompany.updatedAt
							? new Date((updatedCompany.updatedAt as any).seconds * 1000)
							: new Date();

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
							updatedAt: updatedAtDate,
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
		)
		.get(
			'/getCompanies',
			async ({ error }) => {
				try {
					const companies = await CompanyService.getAllCompanies();

					return {
						success: true,
						message: 'Empresas obtenidas exitosamente',
						companies: companies.map((company) => ({
							nit: company.nit,
							companyName: company.companyName,
						})),
					};
				} catch (err: any) {
					const errorResponse = createCompanyErrorResponse(
						err,
						'Error al obtener las empresas'
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
						message: t.String(),
						companies: t.Array(
							t.Object({
								nit: t.String(),
								companyName: t.String(),
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
					summary: 'Obtener todas las empresas',
					description:
						'Obtiene la lista de todas las empresas registradas con su NIT y nombre',
					tags: ['Empresas'],
				},
			}
		)
		.delete(
			'/delete/:nit',
			async ({ params, error }) => {
				try {
					const { nit } = params;
					
					// Eliminar la empresa por su NIT
					await CompanyService.deleteCompanyByNit(nit);
					
					return {
						success: true,
						message: `Empresa con NIT ${nit} eliminada exitosamente`,
					};
				} catch (err: any) {
					const errorResponse = createCompanyErrorResponse(
						err,
						'Error al eliminar la empresa'
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
						message: t.String(),
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
					summary: 'Eliminar empresa',
					description: 'Elimina una empresa por su NIT',
					tags: ['Empresas'],
				},
			}
		);

	return app;
}
