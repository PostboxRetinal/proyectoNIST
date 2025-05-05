import { db } from '../firebase/firebase';
import {
	doc,
	setDoc,
	getDoc,
	updateDoc,
	query,
	collection,
	where,
	getDocs,
	DocumentData,
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

// Interfaz para los datos de la empresa
export interface CompanyData {
	companyName: string;
	nit: string;
	email: string;
	phone: string;
	address: string;
	businessType: BusinessType;
	employeeRange: EmployeeRange;
	createdAt: number;
	updatedAt: number;
	userId: string; // ID del usuario que creó la empresa
}

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
	 * @returns {Promise<{id: string, ...CompanyData}>} - La empresa creada con su ID
	 * @throws {Error} - Si la creación falla
	 */
	static async createCompany(
		companyData: Omit<CompanyData, 'createdAt' | 'updatedAt'>
	): Promise<{ id: string } & CompanyData> {
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

			// Generar un nuevo ID para la empresa
			const companyRef = doc(collection(db, 'companies'));
			const timestamp = Date.now();

			const completeCompanyData: CompanyData = {
				...companyData,
				createdAt: timestamp,
				updatedAt: timestamp,
			};

			// Guardar empresa en Firestore
			await setDoc(companyRef, completeCompanyData);

			console.log(`Empresa creada con ID: ${companyRef.id}`);

			// Retornar la empresa creada con su ID
			return {
				id: companyRef.id,
				...completeCompanyData,
			};
		} catch (error) {
			logCompanyError('createCompany', error);
			throw error;
		}
	}

	/**
	 * Obtiene una empresa por su ID
	 * @param {string} companyId - ID de la empresa a buscar
	 * @returns {Promise<{id: string, ...CompanyData}>} - La empresa encontrada con su ID
	 * @throws {CompanyNotFoundError} - Si la empresa no existe
	 */
	static async getCompanyById(
		companyId: string
	): Promise<{ id: string } & CompanyData> {
		try {
			const companyRef = doc(db, 'companies', companyId);
			const companySnap = await getDoc(companyRef);

			if (!companySnap.exists()) {
				throw new CompanyNotFoundError(companyId);
			}

			const companyData = companySnap.data() as CompanyData;

			return {
				id: companySnap.id,
				...companyData,
			};
		} catch (error) {
			logCompanyError('getCompanyById', error);
			throw error;
		}
	}

	/**
	 * Actualiza los datos de una empresa
	 * @param {string} companyId - ID de la empresa a actualizar
	 * @param {Partial<CompanyData>} updateData - Datos a actualizar
	 * @returns {Promise<{id: string, ...CompanyData}>} - La empresa actualizada
	 * @throws {CompanyNotFoundError} - Si la empresa no existe
	 */
	static async updateCompany(
		companyId: string,
		updateData: Partial<
			Omit<CompanyData, 'nit' | 'createdAt' | 'updatedAt' | 'userId'>
		>
	): Promise<{ id: string } & CompanyData> {
		try {
			// Verificar que la empresa existe
			const companyRef = doc(db, 'companies', companyId);
			const companySnap = await getDoc(companyRef);

			if (!companySnap.exists()) {
				throw new CompanyNotFoundError(companyId);
			}

			// Validar tipo de empresa si viene en los datos a actualizar
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
			await updateDoc(companyRef, dataToUpdate);

			// Obtener la empresa actualizada
			const updatedCompanySnap = await getDoc(companyRef);
			const updatedCompanyData = updatedCompanySnap.data() as CompanyData;

			console.log(`Empresa actualizada con ID: ${companyId}`);

			return {
				id: companyId,
				...updatedCompanyData,
			};
		} catch (error) {
			logCompanyError('updateCompany', error);
			throw error;
		}
	}

	/**
	 * Obtiene todas las empresas asociadas a un usuario
	 * @param {string} userId - ID del usuario
	 * @returns {Promise<Array<{id: string} & CompanyData>>} - Lista de empresas
	 */
	static async getCompaniesByUser(
		userId: string
	): Promise<Array<{ id: string } & CompanyData>> {
		try {
			const q = query(
				collection(db, 'companies'),
				where('userId', '==', userId)
			);
			const querySnapshot = await getDocs(q);

			const companies: Array<{ id: string } & CompanyData> = [];

			querySnapshot.forEach((doc) => {
				const companyData = doc.data() as CompanyData;
				companies.push({
					id: doc.id,
					...companyData,
				});
			});

			return companies;
		} catch (error) {
			logCompanyError('getCompaniesByUser', error);
			throw error;
		}
	}
}

export default CompanyService;
