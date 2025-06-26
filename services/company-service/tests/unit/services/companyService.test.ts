import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import * as firestore from 'firebase/firestore';
import { CompanyData } from '../../../src/schemas/companySchemas';
import { CompanyService } from '../../../src/services/companyService';

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
	beforeEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	it('debe devolver true si el NIT existe', async () => {
		const mockSnapshot = { empty: false, docs: [{ id: 'company1' }] };
		const getDocsSpy = vi.spyOn(firestore, 'getDocs');
		getDocsSpy.mockResolvedValue(mockSnapshot as any);
		
		await expect(CompanyService.nitExists('123456789')).resolves.toBe(true);
	});

	it('debe crear una empresa exitosamente', async () => {
		const inputData = getMockCompanyData();
		// Remove timestamps for input (they will be added by the service)
		const { createdAt, updatedAt, ...inputDataWithoutTimestamps } = inputData;
		
		// Mock the nitExists method to return false (NIT doesn't exist)
		const nitExistsSpy = vi.spyOn(CompanyService, 'nitExists').mockResolvedValue(false);
		
		// Mock firestore.setDoc to simulate successful document creation
		const setDocSpy = vi.spyOn(firestore, 'setDoc');
		setDocSpy.mockResolvedValue(undefined);
		
		// Mock the firestore.doc to return a mock document reference
		const docSpy = vi.spyOn(firestore, 'doc');
		docSpy.mockReturnValue({ id: 'mocked-doc-id' } as any);

		const result = await CompanyService.createCompany(inputDataWithoutTimestamps);

		// Verify the core data matches (excluding timestamps)
		expect(result).toEqual(expect.objectContaining(inputDataWithoutTimestamps));
		
		// Verify timestamps exist and are Date objects
		expect(result.createdAt).toBeInstanceOf(Date);
		expect(result.updatedAt).toBeInstanceOf(Date);
		
		// Verify Firebase setDoc was called
		expect(setDocSpy).toHaveBeenCalledTimes(1);
		expect(nitExistsSpy).toHaveBeenCalledWith(inputDataWithoutTimestamps.nit);
	});
});
