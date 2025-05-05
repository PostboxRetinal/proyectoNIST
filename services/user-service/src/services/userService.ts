import { auth, db } from '../firebase/firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
	UserCredential,
	User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { logFirebaseError } from '../utils/firebaseErrors';
import { VALID_ROLES, Role } from '../constants/roles';

// Error personalizado para roles inválidos
export class InvalidRoleError extends Error {
	code: string;
	
	constructor(role: string) {
		super(`El rol '${role}' no es válido. Debe ser uno de los siguientes: ${VALID_ROLES.join(', ')}`);
		this.name = "InvalidRoleError";
		this.code = "auth/invalid-role";
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

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			try {
				const userRef = doc(db, 'users', user.uid);
				await setDoc(userRef, { email, role });
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
	 * Cierra la sesión del usuario actual
	 * @returns {Promise<void>}
	 * @throws {Error} If sign-out fails
	 */
	static async signOut(): Promise<void> {
		try {
			await signOut(auth);
			console.log('Usuario desconectado');
		} catch (error: any) {
			logFirebaseError('signOut', error);
			throw error;
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
	 * Obtiene el usuario actualmente conectado
	 * @returns {User | null} usuario actual o ninguno si no hay
	 */
	static getCurrentUser(): User | null {
		return auth.currentUser;
	}
}

export default UserService;
