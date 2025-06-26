import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Elysia } from 'elysia';
import { CompanyNotFoundError } from '../../../src/utils/companyErrors';
import {
	createTestCompany,
	handleRequest,
} from '../../helpers/companyTestHelpers';
import { registerCompanyRoutes } from '../../../src/routes/companyRoutes';
import { CompanyService } from '../../../src/services/companyService';

describe('Company Routes', () => {
	let app: Elysia;

	beforeEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();
		app = registerCompanyRoutes(new Elysia());
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	it('POST /newCompany debe crear una empresa', async () => {
		const mockCompany = createTestCompany({ nit: '123456789' });
		const { createdAt, updatedAt, ...requestBody } = mockCompany;

		vi.spyOn(CompanyService, 'createCompany').mockResolvedValue(mockCompany);

		const request = new Request('http://localhost/newCompany', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestBody),
		});

		const { body, status } = await handleRequest(app, request);

		expect(status).toBe(200);
		expect(body.success).toBe(true);
		expect(body.company.nit).toBe('123456789');
	});

	it('GET /getNit/:nit debe manejar empresa no encontrada', async () => {
		vi.spyOn(CompanyService, 'getCompanyByNit').mockRejectedValue(
			new CompanyNotFoundError('12345')
		);

		const request = new Request('http://localhost/getNit/12345');
		const { status } = await handleRequest(app, request);

		expect(status).toBe(404);
	});
});
