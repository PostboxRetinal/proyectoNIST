// authExample.ts - Ejemplo de uso del manejo de errores de Firebase
import { auth } from '../firebase/firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
  reauthenticateWithCredential,
  deleteUser
} from 'firebase/auth';
import { handleFirebaseError, logFirebaseError, createErrorResponse } from '../utils/firebaseErrors';

/**
 * Clase de ejemplo que muestra cómo utilizar el módulo de errores de Firebase
 * para diferentes operaciones de autenticación.
 */
export class AuthExampleService {
  /**
   * Ejemplo de inicio de sesión con Google usando el manejo de errores centralizado
   */
  static async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      // Registra el error con contexto
      logFirebaseError('signInWithGoogle', error);
      
      // Propaga el error original para que la capa de API lo maneje
      throw error;
    }
  }
  
  /**
   * Ejemplo de inicio de sesión con GitHub
   */
  static async signInWithGithub() {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      logFirebaseError('signInWithGithub', error);
      throw error;
    }
  }
  
  /**
   * Ejemplo de vinculación de cuentas
   */
  static async linkEmailAccount(email: string, password: string) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No hay usuario autenticado para vincular');
    }
    
    try {
      const credential = EmailAuthProvider.credential(email, password);
      const result = await linkWithCredential(currentUser, credential);
      return result.user;
    } catch (error) {
      logFirebaseError('linkEmailAccount', error);
      throw error;
    }
  }
  
  /**
   * Ejemplo de reautenticación con manejo de errores
   */
  static async reauthenticateUser(email: string, password: string) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No hay usuario autenticado para reautenticar');
    }
    
    try {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(currentUser, credential);
      return true;
    } catch (error) {
      // Usa handleFirebaseError para obtener un error formateado
      const formattedError = handleFirebaseError(error, 'Error al reautenticar usuario');
      console.log(`Error con código ${formattedError.code} (estado HTTP ${formattedError.status}): ${formattedError.message}`);
      
      // Propaga el error original
      throw error;
    }
  }
  
  /**
   * Ejemplo de eliminación de cuenta con manejo de errores
   */
  static async deleteAccount() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No hay usuario autenticado para eliminar');
    }
    
    try {
      await deleteUser(currentUser);
      return { success: true, message: 'Cuenta eliminada correctamente' };
    } catch (error) {
      logFirebaseError('deleteAccount', error);
      
      // Usa createErrorResponse para generar una respuesta de error para la API
      const errorResponse = createErrorResponse(error, 'Error al eliminar la cuenta');
      
      // En este caso estamos devolviendo el error formateado en lugar de propagarlo
      return errorResponse;
    }
  }
} 