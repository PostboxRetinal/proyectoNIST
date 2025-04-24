import { auth } from '../firebase/firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	sendPasswordResetEmail,
	UserCredential,
	User,
} from 'firebase/auth';

/**
 * Clase userService para manejar la autenticación de usuarios
 */
export class UserService {
	/**
	 * Crea un nuevo usuario con el correo electrónico y la contraseña
	 * @param {string} email - Correo electrónico del nuevo usuario
	 * @param {string} password - Contraseña del nuevo usuario
	 * @returns {Promise<User>} - El objeto de usuario de Firebase creado
	 * @throws {Error} - Si la creación del usuario falla
	 */
	static async createUser(email: string, password: string): Promise<User> {
		try {
			const userCredential: UserCredential =
				await createUserWithEmailAndPassword(auth, email, password);
			const user: User = userCredential.user;
			console.log('Usuario creado:', user); // CRUD - Usuario creado
			return user;
		} catch (error: any) {
			//const errorCode = error.code;
			const errorMessage = error.message;
			console.error(errorMessage);
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
	static async signIn(email: string, password: string): Promise<User> {
		try {
			const userCredential: UserCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user: User = userCredential.user;

			// CRUD - Usuario loggeado
			console.log('Usuario conectado:', user);
			return user;
		} catch (error: any) {
			const errorCode = error.code;
			const errorMessage = error.message;

			// Error general
			console.error('Error conectando usuario:', errorCode, errorMessage);
			throw error;
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
			console.error('Error desconectando usuario:', error);
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
			console.error('Error enviando email de recuperación:', error);
			throw error;
		}
	}

	/**
	 * Actualiza el perfil del usuario
	 * @param {User} user - The user to update
	 * @param {object} profileData - The profile data to update
	 * @returns {Promise<void>}
	 * @throws {Error} If profile update fails
	 */
	static async updateUserProfile(
		user: User,
		profileData: { displayName?: string; photoURL?: string }
	): Promise<void> {
		try {
			await updateProfile(user, profileData);
			console.log('Perfil actualizado:', profileData);
		} catch (error: any) {
			console.error('Error actualizando perfil:', error);
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