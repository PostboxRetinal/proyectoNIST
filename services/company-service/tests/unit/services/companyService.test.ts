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
		
		// Mock all the Firestore functions needed for this test
		const collectionSpy = vi.spyOn(firestore, 'collection').mockReturnValue({ id: 'mock-collection' } as any);
		const querySpy = vi.spyOn(firestore, 'query').mockReturnValue({ id: 'mock-query' } as any);
		const whereSpy = vi.spyOn(firestore, 'where').mockReturnValue({ id: 'mock-where' } as any);
		const getDocsSpy = vi.spyOn(firestore, 'getDocs').mockResolvedValue(mockSnapshot as any);
		
		await expect(CompanyService.nitExists('123456789')).resolves.toBe(true);
		
		// Verify the mocks were called
		expect(collectionSpy).toHaveBeenCalled();
		expect(querySpy).toHaveBeenCalled();
		expect(whereSpy).toHaveBeenCalled();
		expect(getDocsSpy).toHaveBeenCalled();
	});

	it('debe crear una empresa exitosamente', async () => {
		const inputData = getMockCompanyData();
		// Remove timestamps for input (they will be added by the service)
		const { createdAt, updatedAt, ...inputDataWithoutTimestamps } = inputData;
		
		// Mock the nitExists method to return false (NIT doesn't exist)
		const nitExistsSpy = vi.spyOn(CompanyService, 'nitExists').mockResolvedValue(false);
		
		// Mock all Firestore functions
		const collectionSpy = vi.spyOn(firestore, 'collection').mockReturnValue({ id: 'mock-collection' } as any);
		const docSpy = vi.spyOn(firestore, 'doc').mockReturnValue({ id: 'mock-doc' } as any);
		const setDocSpy = vi.spyOn(firestore, 'setDoc').mockResolvedValue(undefined);

		const result = await CompanyService.createCompany(inputDataWithoutTimestamps);

		// Verify the core data matches (excluding timestamps)
		expect(result).toEqual(expect.objectContaining(inputDataWithoutTimestamps));
		
		// Verify timestamps exist and are Date objects
		expect(result.createdAt).toBeInstanceOf(Date);
		expect(result.updatedAt).toBeInstanceOf(Date);
		
		// Verify Firebase functions were called
		expect(collectionSpy).toHaveBeenCalledWith(expect.anything(), 'companies');
		expect(docSpy).toHaveBeenCalled();
		expect(setDocSpy).toHaveBeenCalledTimes(1);
		expect(nitExistsSpy).toHaveBeenCalledWith(inputDataWithoutTimestamps.nit);
	});
});
