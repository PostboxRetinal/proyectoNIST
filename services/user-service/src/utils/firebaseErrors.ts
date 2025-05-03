// firebaseErrors.ts
import { FirebaseError } from 'firebase/app';

// Define custom error response type
export interface ErrorResponse {
  status: number;
  message: string;
  code: string;
}

// Define Firebase error code types
export type FirebaseAuthErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/invalid-login-credentials'
  | 'auth/weak-password'
  | 'auth/requires-recent-login'
  | 'auth/too-many-requests'
  | 'auth/api-key-not-valid'
  | 'auth/network-request-failed'
  | 'auth/popup-closed-by-user'
  | 'auth/invalid-credential'
  | 'auth/internal-error'
  | 'auth/account-exists-with-different-credential'
  | 'auth/operation-not-allowed';

export type FirestoreErrorCode =
  | 'cancelled'
  | 'unknown'
  | 'invalid-argument'
  | 'deadline-exceeded'
  | 'not-found'
  | 'already-exists'
  | 'permission-denied'
  | 'resource-exhausted'
  | 'failed-precondition'
  | 'aborted'
  | 'out-of-range'
  | 'unimplemented'
  | 'internal'
  | 'unavailable'
  | 'data-loss'
  | 'unauthenticated';

export type FirebaseErrorCode = FirebaseAuthErrorCode | FirestoreErrorCode;

/**
 * Global error mapping for different Firebase errors with appropriate HTTP status codes
 */
export const FIREBASE_ERROR_MAP: Record<FirebaseErrorCode, ErrorResponse> = {
  // Authentication Errors
  'auth/email-already-in-use': {
    status: 409,
    message: 'El correo electrónico ya está en uso',
    code: 'auth/email-already-in-use'
  },
  'auth/invalid-email': {
    status: 400,
    message: 'El correo electrónico no es válido',
    code: 'auth/invalid-email'
  },
  'auth/user-disabled': {
    status: 403,
    message: 'Esta cuenta de usuario ha sido deshabilitada',
    code: 'auth/user-disabled'
  },
  'auth/user-not-found': {
    status: 404,
    message: 'Usuario no encontrado',
    code: 'auth/user-not-found'
  },
  'auth/wrong-password': {
    status: 401,
    message: 'Contraseña incorrecta',
    code: 'auth/wrong-password'
  },
  'auth/invalid-login-credentials': {
    status: 401,
    message: 'Credenciales de acceso inválidas',
    code: 'auth/invalid-login-credentials'
  },
  'auth/weak-password': {
    status: 400,
    message: 'La contraseña es demasiado débil',
    code: 'auth/weak-password'
  },
  'auth/requires-recent-login': {
    status: 403,
    message: 'Esta operación requiere un inicio de sesión reciente',
    code: 'auth/requires-recent-login'
  },
  'auth/too-many-requests': {
    status: 429,
    message: 'Demasiados intentos fallidos. Intente más tarde',
    code: 'auth/too-many-requests'
  },
  'auth/api-key-not-valid': {
    status: 500,
    message: 'Error de configuración del servidor. Por favor contacte al administrador',
    code: 'auth/api-key-not-valid'
  },
  'auth/network-request-failed': {
    status: 503,
    message: 'Error de red. Verifique su conexión a internet',
    code: 'auth/network-request-failed'
  },
  'auth/popup-closed-by-user': {
    status: 400,
    message: 'Operación cancelada por el usuario',
    code: 'auth/popup-closed-by-user'
  },
  'auth/invalid-credential': {
    status: 401,
    message: 'Credencial inválida',
    code: 'auth/invalid-credential'
  },
  'auth/internal-error': {
    status: 500,
    message: 'Error interno de Firebase. Intente nuevamente más tarde',
    code: 'auth/internal-error'
  },
  'auth/account-exists-with-different-credential': {
    status: 409,
    message: 'Ya existe una cuenta con este correo electrónico pero con credenciales diferentes',
    code: 'auth/account-exists-with-different-credential'
  },
  'auth/operation-not-allowed': {
    status: 403,
    message: 'Operación no permitida',
    code: 'auth/operation-not-allowed'
  },

  // Firestore Errors
  'cancelled': {
    status: 499,
    message: 'Operación cancelada',
    code: 'cancelled'
  },
  'unknown': {
    status: 500,
    message: 'Error desconocido',
    code: 'unknown'
  },
  'invalid-argument': {
    status: 400,
    message: 'Argumento inválido',
    code: 'invalid-argument'
  },
  'deadline-exceeded': {
    status: 504,
    message: 'Tiempo de espera excedido',
    code: 'deadline-exceeded'
  },
  'not-found': {
    status: 404,
    message: 'Recurso no encontrado',
    code: 'not-found'
  },
  'already-exists': {
    status: 409,
    message: 'El recurso ya existe',
    code: 'already-exists'
  },
  'permission-denied': {
    status: 403,
    message: 'Permiso denegado',
    code: 'permission-denied'
  },
  'resource-exhausted': {
    status: 429,
    message: 'Recursos agotados',
    code: 'resource-exhausted'
  },
  'failed-precondition': {
    status: 400,
    message: 'Precondición fallida',
    code: 'failed-precondition'
  },
  'aborted': {
    status: 409,
    message: 'Operación abortada',
    code: 'aborted'
  },
  'out-of-range': {
    status: 400,
    message: 'Fuera de rango',
    code: 'out-of-range'
  },
  'unimplemented': {
    status: 501,
    message: 'No implementado',
    code: 'unimplemented'
  },
  'internal': {
    status: 500,
    message: 'Error interno',
    code: 'internal'
  },
  'unavailable': {
    status: 503,
    message: 'Servicio no disponible',
    code: 'unavailable'
  },
  'data-loss': {
    status: 500,
    message: 'Pérdida de datos',
    code: 'data-loss'
  },
  'unauthenticated': {
    status: 401,
    message: 'No autenticado',
    code: 'unauthenticated'
  }
};

/**
 * Default error response for unhandled Firebase errors
 */
export const DEFAULT_ERROR_RESPONSE: ErrorResponse = {
  status: 500,
  message: 'Error del servidor',
  code: 'server/unknown-error'
};

/**
 * Process Firebase error and return appropriate error response
 * @param error Firebase error or any error
 * @param defaultMessage Custom default message if not defined in the error map
 * @returns Error response with status code and message
 */
export function handleFirebaseError(error: unknown, defaultMessage?: string): ErrorResponse {
  // Firebase-specific error handling
  if (error instanceof FirebaseError) {
    const errorCode = error.code as FirebaseErrorCode;
    return FIREBASE_ERROR_MAP[errorCode] || {
      status: 400,
      message: defaultMessage || error.message,
      code: errorCode
    };
  }
  
  // Generic error with code property
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const errorWithCode = error as { code: string; message?: string };
    const errorCode = errorWithCode.code as FirebaseErrorCode;
    
    if (errorCode in FIREBASE_ERROR_MAP) {
      return FIREBASE_ERROR_MAP[errorCode];
    }
    
    return {
      status: 400,
      message: errorWithCode.message || defaultMessage || 'Error desconocido',
      code: errorCode
    };
  }
  
  // For other types of errors
  const errorMessage = error instanceof Error ? error.message : String(error);
  return {
    status: 500,
    message: defaultMessage || errorMessage || 'Error desconocido',
    code: 'server/unknown-error'
  };
}

/**
 * Helper to log error details to console
 * @param context The context/function where the error occurred
 * @param error The error object
 */
export function logFirebaseError(context: string, error: unknown): void {
  if (error instanceof FirebaseError) {
    console.error(`[${context}] Firebase Error - Code: ${error.code}, Message: ${error.message}`);
  } else if (error instanceof Error) {
    console.error(`[${context}] Error: ${error.message}`);
    if (error.stack) {
      console.error(`Stack: ${error.stack}`);
    }
  } else {
    console.error(`[${context}] Unknown error:`, error);
  }
}

/**
 * Create a standard error response for API responses
 * @param error The error from Firebase or any other source
 * @param defaultMessage Default message to show if none is provided in the error
 * @returns A standardized response object for API error responses
 */
export function createErrorResponse(error: unknown, defaultMessage?: string) {
  const { status, message, code } = handleFirebaseError(error, defaultMessage);
  
  return {
    success: false,
    message,
    errorCode: code,
    status: status as 400 | 401 | 403 | 404 | 409 | 429 | 500 | 503 | 504
  };
} 