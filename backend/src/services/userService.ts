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
 * Service class for handling Firebase user authentication operations
 */
export class UserService {
	/**
	 * Creates a new user with the provided email and password
	 * @param {string} email - The email address for the new user
	 * @param {string} password - The password for the new user
	 * @returns {Promise<User>} The created Firebase user object
	 * @throws {Error} If user creation fails
	 */
	static async createUser(email: string, password: string): Promise<User> {
		try {
			const userCredential: UserCredential =
				await createUserWithEmailAndPassword(auth, email, password);
			const user: User = userCredential.user;

			// CRUD - User created
			console.log('Usuario creado:', user);
			return user;
		} catch (error: any) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.error('Error creando usuario:', errorCode, errorMessage);
			throw error;
		}
	}

	/**
	 * Signs in a user with the provided email and password
	 * @param {string} email - The email address of the user
	 * @param {string} password - The password of the user
	 * @returns {Promise<User>} The signed-in Firebase user object
	 * @throws {Error} If sign-in fails
	 */
	static async signIn(email: string, password: string): Promise<User> {
		try {
			const userCredential: UserCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user: User = userCredential.user;

			// CRUD - User signed in
			console.log('Usuario conectado:', user);
			return user;
		} catch (error: any) {
			const errorCode = error.code;
			const errorMessage = error.message;

			// User sign-in failed
			console.error('Error conectando usuario:', errorCode, errorMessage);
			throw error;
		}
	}

	/**
	 * Signs out the currently signed-in user
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
	 * Sends a password reset email to the provided email address
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
	 * Updates the profile of the currently signed-in user
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
	 * Gets the currently signed-in user
	 * @returns {User | null} The current user or null if no user is signed in
	 */
	static getCurrentUser(): User | null {
		return auth.currentUser;
	}
}

export default UserService;
