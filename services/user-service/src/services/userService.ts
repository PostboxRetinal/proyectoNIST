// userService.ts
import { auth, db } from '../firebase/firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	sendPasswordResetEmail,
	UserCredential,
	User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Asegúrate de importar Firestore
import { logFirebaseError } from '../utils/firebaseErrors';

export class UserService {
	/**
	 * Crea un nuevo usuario con el correo electrónico, la contraseña y el rol
	 * @param {string} email - Correo electrónico del nuevo usuario
	 * @param {string} password - Contraseña del nuevo usuario
	 * @param {string} role - Rol del usuario (opciones: "admin", "gestor", "auditor", por defecto "admin")
	 * @returns {Promise<User>} - El objeto de usuario de Firebase creado
	 * @throws {Error} - Si la creación del usuario falla o el rol es inválido
	 */
	static async createUser(
		email: string,
		password: string,
		role: string
	): Promise<User> {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			const userRef = doc(db, 'users', user.uid);
			try {
				await setDoc(userRef, { role });
			} catch (error) {
				console.error('Error al guardar el rol en Firestore:', error);
				logFirebaseError('createUser:setDoc', error);
			}

			console.log(`Usuario creado con rol: ${role}`);

			return user;
		} catch (error: any) {
			console.error('Error al crear el usuario:', error);
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
	 * Actualiza el perfil del usuario
	 * @param {User} user - The user to update
	 * @param {object} profileData - The profile data to update
	 * @returns {Promise<void>}
	 * @throws {Error} If profile update fails
	 */
	static async updateUserProfile(
		user: User, // auth from firebase not user
		profileData: { displayName?: string; photoURL?: string }
	): Promise<void> {
		try {
			await updateProfile(user, profileData);
			console.log('Perfil actualizado:', profileData);
		} catch (error: any) {
			logFirebaseError('updateUserProfile', error);
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
