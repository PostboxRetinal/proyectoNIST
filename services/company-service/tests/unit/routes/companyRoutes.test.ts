import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'; // <-- Añadido Mock
import { Elysia } from 'elysia';
import { registerCompanyRoutes } from '../../../src/routes/companyRoutes';
import { CompanyService } from '../../../src/services/companyService';
import { CompanyNotFoundError } from '../../../src/utils/companyErrors';

vi.mock('../../../src/services/companyService');

describe('Company Routes', () => {
	let app: Elysia;

	beforeEach(() => {
		vi.clearAllMocks();
		app = registerCompanyRoutes(new Elysia());
	});

	it('POST /newCompany debe crear una empresa', async () => {
		// CORRECCIÓN: Usamos 'as Mock'
		(CompanyService.createCompany as Mock).mockResolvedValue({
			companyId: 'test-id-123',
		});

		const response = await app
			.handle(
				new Request('http://localhost/newCompany', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ nit: '123' }),
				})
			)
			.then((res) => res.json());

		expect(response.success).toBe(true);
		expect(response.companyId).toBe('test-id-123');
	});

	it('GET /nit/:nit debe manejar empresa no encontrada', async () => {
		// CORRECCIÓN: Usamos 'as Mock'
		(CompanyService.getCompanyByNit as Mock).mockRejectedValue(
			new CompanyNotFoundError('12345')
		);

		const response = await app.handle(
			new Request('http://localhost/nit/12345')
		);

		expect(response.status).toBe(404);
	});
});
