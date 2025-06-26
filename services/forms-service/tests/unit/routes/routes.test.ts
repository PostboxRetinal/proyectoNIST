import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Elysia } from 'elysia';
import { NistAudit } from '../../../src/schemas/formSchema';
import { registerAuditRoutes } from '../../../src/routes/routes';
import { AuditService } from '../../../src/services/auditService';

describe('Audit Routes', () => {
	let app: Elysia;

	beforeEach(() => {
		// Clear all mocks and restore original implementations
		vi.clearAllMocks();
		vi.restoreAllMocks();
		app = new Elysia();
		registerAuditRoutes(app);
	});

	afterEach(() => {
		// Ensure cleanup after each test
		vi.clearAllMocks();
		vi.restoreAllMocks();
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

			// Setup spies instead of mocks
			const prepareAuditSpy = vi
				.spyOn(AuditService, 'prepareAuditResultObject')
				.mockReturnValue(mockPreparedAudit);
			const saveAuditSpy = vi
				.spyOn(AuditService, 'saveAuditResult')
				.mockResolvedValue('test-id');

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
				expect(prepareAuditSpy).toHaveBeenCalledWith(mockRequest.body);
				expect(saveAuditSpy).toHaveBeenCalledWith(mockPreparedAudit);

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
			// Setup spy to throw an error
			const prepareAuditSpy = vi
				.spyOn(AuditService, 'prepareAuditResultObject')
				.mockImplementation(() => {
					throw new Error('Test error');
				});

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
