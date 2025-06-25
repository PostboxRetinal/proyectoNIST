// Importar utilidades de prueba, el SERVICIO y el MÓDULO a simular.
import { describe, it, expect, afterEach, vi } from 'vitest';
import { CompanyService } from '../../../src/services/companyService';
import * as firestore from 'firebase/firestore';

// Importar tipos y errores.
import {
	DuplicateNITError,
	InvalidBusinessTypeError,
	InvalidEmployeeRangeError,
} from '../../../src/utils/companyErrors';
import { CompanyData } from '../../../src/schemas/companySchemas';
import {
	VALID_BUSINESS_TYPES,
	VALID_EMPLOYEE_RANGES,
} from '../../../src/constants/businessTypes';

// PASO 1: Mockear el módulo 'firebase/firestore' al nivel más alto del archivo.
// `vi.mock` es "hoisted" (elevado) por Vitest, lo que significa que se ejecuta
// ANTES de todas las importaciones. Esto rompe la dependencia circular.
// La función factory debe ser `async` para poder importar 'vitest' de forma segura dentro de ella.
vi.mock('firebase/firestore', async () => {
	const { vi: internalVi } = await import('vitest');
	return {
		collection: internalVi.fn(),
		doc: internalVi.fn(),
		getDocs: internalVi.fn(),
		setDoc: internalVi.fn(),
		query: internalVi.fn(),
		// Añade cualquier otra función de firestore que uses.
	};
});

// Función de ayuda para crear datos de prueba válidos y completos.
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
	// Después de cada prueba, limpiamos el estado de los mocks (ej. número de llamadas).
	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('Lógica de Validación', () => {
		it('isValidBusinessType debe devolver true para tipos válidos', () => {
			VALID_BUSINESS_TYPES.forEach((type) => {
				expect(CompanyService.isValidBusinessType(type)).toBe(true);
			});
		});

		it('isValidEmployeeRange debe devolver true para rangos válidos', () => {
			VALID_EMPLOYEE_RANGES.forEach((range) => {
				expect(CompanyService.isValidEmployeeRange(range)).toBe(true);
			});
		});
	});

	describe('nitExists', () => {
		it('debe devolver true si el NIT existe', async () => {
			const mockSnapshot = { empty: false, docs: [{ id: 'company1' }] };
			// `firestore.getDocs` ahora se refiere a nuestro mock. Le damos un valor para esta prueba.
			// Usamos `vi.mocked()` para que TypeScript sepa que es un mock.
			vi.mocked(firestore.getDocs).mockResolvedValue(mockSnapshot as any);

			await expect(CompanyService.nitExists('123456789')).resolves.toBe(true);
		});

		it('debe devolver false si el NIT no existe', async () => {
			const mockSnapshot = { empty: true, docs: [] };
			vi.mocked(firestore.getDocs).mockResolvedValue(mockSnapshot as any);

			await expect(CompanyService.nitExists('123456789')).resolves.toBe(false);
		});
	});

	describe('createCompany', () => {
		it('debe crear una empresa exitosamente', async () => {
			// Configuramos los mocks para el camino feliz.
			vi.spyOn(CompanyService, 'nitExists').mockResolvedValue(false);
			vi.spyOn(CompanyService as any, 'generateCompanyId').mockReturnValue(
				'test-id'
			);
			const companyData = getMockCompanyData();

			const result = await CompanyService.createCompany(companyData);

			expect(result).toEqual({ success: true, companyId: 'test-id' });
			expect(firestore.setDoc).toHaveBeenCalledTimes(1);
		});

		it('debe lanzar DuplicateNITError si nitExists devuelve true', async () => {
			vi.spyOn(CompanyService, 'nitExists').mockResolvedValue(true);
			const companyData = getMockCompanyData();
			await expect(CompanyService.createCompany(companyData)).rejects.toThrow(
				DuplicateNITError
			);
		});

		it('debe lanzar InvalidBusinessTypeError para un tipo de negocio inválido', async () => {
			const companyData = {
				...getMockCompanyData(),
				businessType: 'tipo-invalido' as any,
			};
			await expect(CompanyService.createCompany(companyData)).rejects.toThrow(
				InvalidBusinessTypeError
			);
		});
	});
});
