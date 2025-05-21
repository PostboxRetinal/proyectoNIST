import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Elysia } from 'elysia';
import { registerCompanyRoutes } from '../../../src/routes/companyRoutes';
import { CompanyService } from '../../../src/services/companyService';
import { CompanyData } from '../../../src/schemas/companySchemas';

// Mock CompanyService
vi.mock('../../../src/services/companyService', () => ({
	CompanyService: {
		createCompany: vi.fn(),
		getCompanyById: vi.fn(),
		updateCompany: vi.fn(),
		deleteCompany: vi.fn(),
		getAllCompanies: vi.fn(),
		isValidBusinessType: vi.fn(),
		isValidEmployeeRange: vi.fn(),
		nitExists: vi.fn(),
	},
}));

// Mock company errors
vi.mock('../../../src/utils/companyErrors', () => ({
	logCompanyError: vi.fn(),
	DuplicateNITError: class DuplicateNITError extends Error {},
	CompanyNotFoundError: class CompanyNotFoundError extends Error {},
	InvalidBusinessTypeError: class InvalidBusinessTypeError extends Error {},
	InvalidEmployeeRangeError: class InvalidEmployeeRangeError extends Error {},
}));

describe('Company Routes', () => {
	let app: Elysia;

	beforeEach(() => {
		vi.clearAllMocks();
		app = new Elysia();
		registerCompanyRoutes(app);
	});

	describe('POST /newCompany', () => {
		it('should create a company successfully', async () => {
			// Mock successful company creation
			vi.mocked(CompanyService.createCompany).mockResolvedValue({
				nit: '9001736282-1',
				companyName: 'Test Company',
				businessType: 'Otro',
				employeeRange: 'Entre 50 y 149',
				address: 'Test Address',
				email: 'test@test.com',
				phone: '1234567890',
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			// Find the handler
			const handlers = app.routes
				.filter(
					(route) => route.path === '/newCompany' && route.method === 'POST'
				)
				.map((route) => route.handler);

			expect(handlers).toHaveLength(1);

			if (handlers.length > 0) {
				const handler = handlers[0];

				// Mock request object
				const mockCompanyData: CompanyData = {
					companyName: 'Insumos S.A.S',
					nit: '123456789',
					businessType: 'Otro',
					employeeRange: 'Entre 50 y 149',
					address: 'DG 50C #34-5',
					email: 'testing2@gmail.com',
					phone: '1234567890',
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				const mockRequest = {
					body: mockCompanyData,
					error: vi.fn().mockImplementation((status, body) => {
						return { status, body };
					}),
				};

				// Execute handler
				const response = await handler(mockRequest as any);
				// Check response structure
				expect(response).toEqual({
					success: true,
					nit: '9001736282-1',
					message: 'Empresa creada exitosamente',
				});
				// Check response structure
				expect(response).toEqual({
					success: true,
					companyId: 'test-id',
					message: 'Empresa creada exitosamente',
				});
			}
		});

		it('should handle duplicate NIT error', async () => {
			// Import the error class
			const { DuplicateNITError } = await import(
				'../../../src/utils/companyErrors'
			);

			// Mock createCompany to throw DuplicateNITError
			vi.mocked(CompanyService.createCompany).mockRejectedValue(
				new DuplicateNITError('123456789')
			);

			// Find the handler
			const handlers = app.routes
				.filter((route) => route.path === '/create' && route.method === 'POST')
				.map((route) => route.handler);

			if (handlers.length > 0) {
				const handler = handlers[0];

				const mockRequest = {
					body: {
						companyName: 'Juan Valdez LTDA',
						nit: '900467185-6',
						businessType: 'Comercio',
						employeeRange: 'Entre 150 y 299',
						address: 'CRA 8 #3-3',
						email: 'amigos@juanvaldez.com',
						phone: '300 675 1234',
						createdAt: new Date(),
						updatedAt: new Date(),
					},
					error: vi.fn().mockImplementation((status, body) => {
						return { status, body };
					}),
				};

				// Execute handler
				await handler(mockRequest as any);

				// Verify error was called
				expect(mockRequest.error).toHaveBeenCalledWith(
					400,
					expect.objectContaining({
						success: false,
						error: expect.stringContaining('NIT'),
					})
				);
			}
		});
	});

	describe('GET /:id', () => {
		it('should return company by ID', async () => {
			const mockCompany = {
				id: 'test-id',
				nit: '900161729-5',
				companyName: 'Insumos S.A.S',
				email: 'hola@gmail.com',
				phone: '301 2345678',
				address: 'DG 50C #34-5',
				businessType: 'Comercio' as const,
				employeeRange: 'Entre 50 y 149' as const,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			// Mock successful company retrieval
			vi.mocked(CompanyService.getCompanyByNit).mockResolvedValue(mockCompany);

			// Find the handler
			const handlers = app.routes
				.filter((route) => route.path === '/:id' && route.method === 'GET')
				.map((route) => route.handler);

			expect(handlers).toHaveLength(1);

			if (handlers.length > 0) {
				const handler = handlers[0];

				// Mock request object with params
				const mockRequest = {
					params: {
						id: 'test-id',
					},
					error: vi.fn().mockImplementation((status, body) => {
						return { status, body };
					}),
				};

				// Execute handler
				const response = await handler(mockRequest as any);

				// Verify CompanyService was called with correct ID
				expect(CompanyService.getCompanyByNit).toHaveBeenCalledWith('test-id');

				// Check response
				expect(response).toEqual({
					success: true,
					company: mockCompany,
				});
			}
		});

		it('should handle company not found error', async () => {
			// Import the error class
			const { CompanyNotFoundError } = await import(
				'../../../src/utils/companyErrors'
			);

			// Mock getCompanyById to throw CompanyNotFoundError
			vi.mocked(CompanyService.getCompanyByNit).mockRejectedValue(
				new CompanyNotFoundError('test-id')
			);

			// Find the handler
			const handlers = app.routes
				.filter((route) => route.path === '/:id' && route.method === 'GET')
				.map((route) => route.handler);

			if (handlers.length > 0) {
				const handler = handlers[0];

				// Mock request
				const mockRequest = {
					params: {
						id: 'test-id',
					},
					error: vi.fn().mockImplementation((status, body) => {
						return { status, body };
					}),
				};

				// Execute handler
				await handler(mockRequest as any);

				// Verify error was called with 404
				expect(mockRequest.error).toHaveBeenCalledWith(
					404,
					expect.objectContaining({
						success: false,
						error: expect.stringContaining('Empresa no encontrada'),
					})
				);
			}
		});
	});

	// Add more tests for other routes (update, delete, getAll)
});
