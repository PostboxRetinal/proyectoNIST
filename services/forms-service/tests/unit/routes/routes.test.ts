import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Elysia } from 'elysia';
import { registerAuditRoutes } from '../../../src/routes/routes';
import { AuditService } from '../../../src/services/auditService';
import { NistAudit } from '../../../src/schemas/formSchema';

// Mock AuditService
vi.mock('../../../src/services/auditService', () => ({
	AuditService: {
		prepareAuditResultObject: vi.fn(),
		saveAuditResult: vi.fn(),
		getAuditResultById: vi.fn(),
		getAuditsByCompanyId: vi.fn(),
		deleteAuditResult: vi.fn(),
	},
}));

// Mock error handling
vi.mock('../../../src/utils/auditErrors', () => ({
	createAuditErrorResponse: vi.fn((_err, message) => ({
		success: false,
		message: message || 'Error genérico',
		error: 'MOCK_ERROR',
		status: 400,
	})),
}));

describe('Audit Routes', () => {
	let app: Elysia;

	beforeEach(() => {
		vi.clearAllMocks();
		app = new Elysia();
		registerAuditRoutes(app);
	});

	describe('POST /newForm', () => {
		it('should successfully create a new audit', async () => {
			// Mock prepared audit result
			const mockPreparedAudit = {
				id: 'test-id',
				program: 'Test Program',
				companyId: 'company-id',
				auditDate: new Date(),
				completionPercentage: 85,
				sections: {}, // Objeto vacío para simplificar
			};

			// Setup mocks
			vi.mocked(AuditService.prepareAuditResultObject).mockReturnValue(
				mockPreparedAudit
			);
			vi.mocked(AuditService.saveAuditResult).mockResolvedValue('test-id');

			// Create a mock request handler function
			const handlers = app.routes
				.filter((route) => route.path === '/newForm' && route.method === 'POST')
				.map((route) => route.handler);

			expect(handlers).toHaveLength(1);

			if (handlers.length > 0) {
				const handler = handlers[0];
				const mockRequest = {
					body: {
						id: 'test-id',
						program: 'Test Program',
						companyId: 'company-id',
						auditDate: '2023-12-15',
						sections: [],
					} as NistAudit,
					error: vi.fn().mockImplementation((status, body) => {
						return { status, body };
					}),
				};

				// Execute the route handler
				const response = await handler(mockRequest as any);

				// Assertions
				expect(AuditService.prepareAuditResultObject).toHaveBeenCalledWith(
					mockRequest.body
				);
				expect(AuditService.saveAuditResult).toHaveBeenCalledWith(
					mockPreparedAudit
				);

				expect(response).toEqual({
					success: true,
					message: 'Auditoría guardada exitosamente',
					auditId: 'test-id',
					result: {
						id: mockPreparedAudit.id,
						program: mockPreparedAudit.program,
						auditDate: mockPreparedAudit.auditDate,
						completionPercentage: mockPreparedAudit.completionPercentage,
					},
				});
			}
		});

		it('should handle errors when creating an audit', async () => {
			// Setup mocks to throw an error
			vi.mocked(AuditService.prepareAuditResultObject).mockImplementation(
				() => {
					throw new Error('Test error');
				}
			);

			// Get the handler
			const handlers = app.routes
				.filter((route) => route.path === '/newForm' && route.method === 'POST')
				.map((route) => route.handler);

			if (handlers.length > 0) {
				const handler = handlers[0];
				const mockRequest = {
					body: {
						program: 'Test Program',
						companyId: 'company-id',
						auditDate: '2023-12-15',
						sections: [],
					} as NistAudit,
					error: vi.fn().mockImplementation((status, body) => {
						return { status, body };
					}),
				};

				// Execute the handler
				await handler(mockRequest as any);

				// Verify that error was called
				expect(mockRequest.error).toHaveBeenCalledTimes(1);
			}
		});
	});

	// Add more tests for other routes
});
