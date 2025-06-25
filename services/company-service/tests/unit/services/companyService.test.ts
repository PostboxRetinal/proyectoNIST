import { describe, it, expect, afterEach, vi, Mock } from 'vitest'; // <-- Añadido Mock
import { CompanyService } from '../../../src/services/companyService';
import * as firestore from 'firebase/firestore';
import { CompanyData } from '../../../src/schemas/companySchemas';

const getMockCompanyData = (): CompanyData => ({
	nit: '123456789-0',
	companyName: 'Empresa de Prueba',
	email: 'test@empresa.com',
	phone: '123456789',
	address: 'Calle Falsa 123',
	businessType: 'Tecnología',
	employeeRange: 'Menos de 50',
	createdAt: new Date(),
	updatedAt: new Date(),
});

describe('CompanyService', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('debe devolver true si el NIT existe', async () => {
		const mockSnapshot = { empty: false, docs: [{ id: 'company1' }] };
		// CORRECCIÓN: Usamos 'as Mock' en lugar de 'as vi.Mock'
		(firestore.getDocs as Mock).mockResolvedValue(mockSnapshot);
		await expect(CompanyService.nitExists('123456789')).resolves.toBe(true);
	});

	it('debe crear una empresa exitosamente', async () => {
		vi.spyOn(CompanyService, 'nitExists').mockResolvedValue(false);
		vi.spyOn(CompanyService as any, 'generateCompanyId').mockReturnValue(
			'test-id'
		);
		const companyData = getMockCompanyData();

		const result = await CompanyService.createCompany(companyData);

		expect(result).toEqual({ success: true, companyId: 'test-id' });
		expect(firestore.setDoc).toHaveBeenCalledTimes(1);
	});
});
