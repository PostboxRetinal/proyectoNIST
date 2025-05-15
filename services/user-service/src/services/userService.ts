import { auth, db } from '../firebase/firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
	UserCredential,
	User,
} from 'firebase/auth';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { logFirebaseError } from '../utils/firebaseErrors';
import { VALID_ROLES, Role } from '../constants/roles';
import { UserData } from '../schemas/userSchema';

// Error personalizado para roles inválidos
export class InvalidRoleError extends Error {
	code: string;

	constructor(role: string) {
		super(
			`El rol '${role}' no es válido. Debe ser uno de los siguientes: ${VALID_ROLES.join(
				', '
			)}`
		);
		this.name = 'InvalidRoleError';
		this.code = 'auth/invalid-role';
	}
}

export class UserService {
	/**
	 * Valida si un rol es válido
	 * @param {string} role - Rol a validar
	 * @returns {boolean} - true si el rol es válido, false en caso contrario
	 */
	static isValidRole(role: string): boolean {
		return VALID_ROLES.includes(role as Role);
	}

	/**
	 * Crea un nuevo usuario con el correo electrónico, la contraseña y el rol
	 * @param {string} email - Correo electrónico del nuevo usuario
	 * @param {string} password - Contraseña del nuevo usuario
	 * @param {string} role - Rol del usuario (opciones: "admin", "gestor", "auditor", por defecto "auditor")
	 * @returns {Promise<User>} - El objeto de usuario de Firebase creado
	 * @throws {Error} - Si la creación del usuario falla o el rol es inválido
	 */
	static async createUser(
		email: string,
		password: string,
		role: string
	): Promise<User> {
		try {
			// Validación de rol - lanza error específico
			if (!this.isValidRole(role)) {
				throw new InvalidRoleError(role);
			}
			// Crear usuario en Firebase
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			/*
			 * - userCredential es un objeto que contiene información sobre el usuario creado
			 * - userData es la interfaz que define la estructura de los datos del usuario
			 */
			const user = userCredential.user;
			const userData: UserData = {
				id: user.uid,
				email: email,
				role: role as Role,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			try {
				const userRef = doc(db, 'users', user.uid);
				await setDoc(userRef, userData);
			} catch (error) {
				logFirebaseError('createUser:setDoc', error);
			}

			console.log(`Usuario creado con rol: ${role}`);
			return user;
		} catch (error: any) {
			logFirebaseError('createUser', error);
			throw error;
		}
	}

	/**
	 * Loggea un usuario con el correo electrónico y la contraseña proporcionados
	 * @param {string} email - El correo electrónico del usuario
	 * @param {string} password - La contraseña del usuario
	 * @returns {Promise<User>} - El objeto de usuario de Firebase
	 * @throws {Error} - Si el inicio de sesión falla
	 */
	static async loginUser(email: string, password: string): Promise<User> {
		try {
			const userCredential: UserCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user: User = userCredential.user;

			console.log('Usuario conectado:', user);
			return user;
		} catch (error: any) {
			logFirebaseError('loginUser', error);
			throw error; // Relanzo el error original para que lo maneje la capa de API
		}
	}

	/**
	 * Envia un email de recuperación de contraseña al usuario
	 * @param {string} email - The email address to send the reset link to
	 * @returns {Promise<void>}
	 * @throws {Error} If sending the reset email fails
	 */
	static async resetPassword(email: string): Promise<void> {
		try {
			await sendPasswordResetEmail(auth, email);
			console.log('Email de recuperación enviado a:', email);
		} catch (error: any) {
			logFirebaseError('resetPassword', error);
			throw error;
		}
	}

	/**
	 * Obtiene todos los usuarios registrados en Firestore
	 * @returns {Promise<UserData[]>} - Array con todos los usuarios
	 * @throws {Error} - Si ocurre un error al obtener los usuarios
	 */
	static async getAllUsers(): Promise<UserData[]> {
		try {
			const usersRef = collection(db, 'users');
			const querySnapshot = await getDocs(usersRef);

			const users: UserData[] = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				// Convertir campos de fecha de Firestore a objetos Date de JavaScript
				const user: UserData = {
					id: doc.id,
					email: data.email,
					role: data.role,
					createdAt: data.createdAt
						? new Date(data.createdAt.seconds * 1000)
						: new Date(),
					updatedAt: data.updatedAt
						? new Date(data.updatedAt.seconds * 1000)
						: new Date(),
				};
				users.push(user);
			});

			return users;
		} catch (error: any) {
			logFirebaseError('getAllUsers', error);
			throw error;
		}
	}
}
