import { db } from '../firebase/firebase';
import {
	doc,
	setDoc,
	updateDoc,
	query,
	collection,
	where,
	getDocs,
	deleteDoc,
} from 'firebase/firestore';
import {
	logCompanyError,
	DuplicateNITError,
	CompanyNotFoundError,
	InvalidBusinessTypeError,
	InvalidEmployeeRangeError,
} from '../utils/companyErrors';
import {
	VALID_BUSINESS_TYPES,
	VALID_EMPLOYEE_RANGES,
	BusinessType,
	EmployeeRange,
} from '../constants/businessTypes';
import { CompanyData } from '../schemas/companySchemas';

export class CompanyService {
	/**
	 * Valida si un tipo de empresa es válido
	 * @param {string} businessType - Tipo de empresa a validar
	 * @returns {boolean} - true si el tipo es válido, false en caso contrario
	 */
	static isValidBusinessType(businessType: string): boolean {
		return VALID_BUSINESS_TYPES.includes(businessType as BusinessType);
	}

	/**
	 * Valida si un rango de empleados es válido
	 * @param {string} employeeRange - Rango de empleados a validar
	 * @returns {boolean} - true si el rango es válido, false en caso contrario
	 */
	static isValidEmployeeRange(employeeRange: string): boolean {
		return VALID_EMPLOYEE_RANGES.includes(employeeRange as EmployeeRange);
	}

	/**
	 * Verifica si ya existe una empresa con el mismo NIT
	 * @param {string} nit - NIT a verificar
	 * @returns {Promise<boolean>} - true si el NIT ya existe, false en caso contrario
	 */
	static async nitExists(nit: string): Promise<boolean> {
		try {
			const q = query(collection(db, 'companies'), where('nit', '==', nit));
			const querySnapshot = await getDocs(q);
			return !querySnapshot.empty;
		} catch (error) {
			logCompanyError('nitExists', error);
			throw error;
		}
	}

	/**
	 * Crea una nueva empresa en Firestore
	 * @param {CompanyData} companyData - Datos de la empresa a crear
	 * @returns {Promise<{nit: string, ...CompanyData}>} - La empresa creada con su ID
	 * @throws {Error} - Si la creación falla
	 */
	static async createCompany(
		companyData: Omit<CompanyData, 'createdAt' | 'updatedAt'>
	): Promise<{ nit: string } & CompanyData> {
		try {
			// Validar tipo de empresa
			if (!this.isValidBusinessType(companyData.businessType)) {
				throw new InvalidBusinessTypeError(companyData.businessType);
			}

			// Validar rango de empleados
			if (!this.isValidEmployeeRange(companyData.employeeRange)) {
				throw new InvalidEmployeeRangeError(companyData.employeeRange);
			}

			// Verificar si ya existe una empresa con el mismo NIT
			const nitAlreadyExists = await this.nitExists(companyData.nit);
			if (nitAlreadyExists) {
				throw new DuplicateNITError(companyData.nit);
			}

			// Crear referencia para la nueva empresa
			const companyRef = doc(collection(db, 'companies'));
			const timestamp = new Date(); // Timestamp actual

			const completeCompanyData: CompanyData = {
				...companyData,
				createdAt: timestamp,
				updatedAt: timestamp,
			};

			// Guardar empresa en Firestore
			await setDoc(companyRef, completeCompanyData);

			console.log(`Empresa creada con NIT: ${companyData.nit}`);

			// Retornar la empresa creada con su NIT
			return {
				...completeCompanyData,
			};
		} catch (error) {
			logCompanyError('createCompany', error);
			throw error;
		}
	}

	/**
	 * Obtiene una empresa por su NIT
	 * @param {string} nit - NIT de la empresa a buscar
	 * @returns {Promise<{id: string, ...CompanyData}>} - La empresa encontrada con su ID
	 * @throws {CompanyNotFoundError} - Si la empresa no existe
	 */
	static async getCompanyByNit(
		nit: string
	): Promise<{ id: string } & CompanyData> {
		try {
			const q = query(collection(db, 'companies'), where('nit', '==', nit));
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				throw new CompanyNotFoundError(`NIT: ${nit}`);
			}

			// Tomar el primer documento que coincida (debería ser único por el NIT)
			const companyDoc = querySnapshot.docs[0];
			const companyData = companyDoc.data() as CompanyData;

			return {
				id: companyDoc.id,
				...companyData,
			};
		} catch (error) {
			logCompanyError('getCompanyByNit', error);
			throw error;
		}
	}

	/**
	 * Actualiza los datos de una empresa usando su NIT
	 * @param {string} nit - NIT de la empresa a actualizar
	 * @param {Partial<CompanyData>} updateData - Datos a actualizar
	 * @returns {Promise<{id: string, ...CompanyData}>} - La empresa actualizada
	 * @throws {CompanyNotFoundError} - Si la empresa no existe
	 */
	static async updateCompanyByNit(
		nit: string,
		updateData: Partial<
			Omit<CompanyData, 'nit' | 'createdAt' | 'updatedAt' | 'userId'>
		>
	): Promise<{ id: string } & CompanyData> {
		try {
			// Buscar la empresa por NIT para obtener su ID
			const company = await this.getCompanyByNit(nit);
			const companyId = company.id;

			// Verificar tipo de empresa si viene en los datos a actualizar
			if (
				updateData.businessType &&
				!this.isValidBusinessType(updateData.businessType)
			) {
				throw new InvalidBusinessTypeError(updateData.businessType);
			}

			// Validar rango de empleados si viene en los datos a actualizar
			if (
				updateData.employeeRange &&
				!this.isValidEmployeeRange(updateData.employeeRange)
			) {
				throw new InvalidEmployeeRangeError(updateData.employeeRange);
			}

			// Preparar los datos a actualizar
			const dataToUpdate = {
				...updateData,
				updatedAt: Date.now(),
			};

			// Actualizar la empresa en Firestore
			const companyRef = doc(db, 'companies', companyId);
			await updateDoc(companyRef, dataToUpdate);

			// Obtener la empresa actualizada
			const updatedCompany = await this.getCompanyByNit(nit);

			console.log(`Empresa con NIT ${nit} actualizada exitosamente`);

			return updatedCompany;
		} catch (error) {
			logCompanyError('updateCompanyByNit', error);
			throw error;
		}
	}

	/**
	 * Obtiene todas las empresas registradas en Firestore
	 * @returns {Promise<Array<{id: string, nit: string, companyName: string}>>} - Array con todas las empresas
	 * @throws {Error} - Si ocurre un error al obtener las empresas
	 */
	static async getAllCompanies(): Promise<Array<{id: string, nit: string, companyName: string}>> {
		try {
			const companiesRef = collection(db, 'companies');
			const querySnapshot = await getDocs(companiesRef);
			
			const companies: Array<{id: string, nit: string, companyName: string}> = [];
			
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				companies.push({
					id: doc.id,
					nit: data.nit,
					companyName: data.companyName,
				});
			});
			
			return companies;
		} catch (error) {
			logCompanyError('getAllCompanies', error);
			throw error;
		}
	}

	/**
	 * Elimina una empresa por su NIT
	 * @param {string} nit - NIT de la empresa a eliminar
	 * @returns {Promise<void>} - Promesa vacía que se resuelve cuando se completa la eliminación
	 * @throws {CompanyNotFoundError} - Si la empresa no existe
	 * @throws {Error} - Si ocurre un error durante la eliminación
	 */
	static async deleteCompanyByNit(nit: string): Promise<void> {
		try {
			// Buscar la empresa por NIT para obtener su ID
			const company = await this.getCompanyByNit(nit);
			const companyId = company.id;
			
			// Crear referencia al documento de la empresa
			const companyRef = doc(db, 'companies', companyId);
			
			// Eliminar el documento de la empresa
			await deleteDoc(companyRef);
			
			console.log(`Empresa con NIT ${nit} eliminada exitosamente`);
		} catch (error) {
			logCompanyError('deleteCompanyByNit', error);
			throw error;
		}
	}
}
