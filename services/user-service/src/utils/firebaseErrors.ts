import { FirebaseError } from 'firebase/app';

export interface ErrorResponse {
  status: number;
  message: string;
  code: string;
}

/* Aquí busqué y definí los tipos de códigos de error de Firebase con base en la documentación oficial
*  https://firebase.google.com/docs/auth/admin/errors
 */

export type FirebaseAuthErrorCode =
  | 'auth/claims-too-large'
  | 'auth/email-already-exists'
  | 'auth/id-token-expired'
  | 'auth/id-token-revoked'
  | 'auth/insufficient-permission'
  | 'auth/internal-error'
  | 'auth/invalid-argument'
  | 'auth/invalid-claims'
  | 'auth/invalid-continue-uri'
  | 'auth/invalid-creation-time'
  | 'auth/invalid-credential'
  | 'auth/invalid-custom-token'
  | 'auth/invalid-disabled-field'
  | 'auth/invalid-display-name'
  | 'auth/invalid-dynamic-link-domain'
  | 'auth/invalid-email'
  | 'auth/invalid-email-verified'
  | 'auth/invalid-hash-algorithm'
  | 'auth/invalid-hash-block-size'
  | 'auth/invalid-hash-derived-key-length'
  | 'auth/invalid-hash-key'
  | 'auth/invalid-hash-memory-cost'
  | 'auth/invalid-hash-parallelization'
  | 'auth/invalid-hash-rounds'
  | 'auth/invalid-hash-salt-separator'
  | 'auth/invalid-id-token'
  | 'auth/invalid-last-sign-in-time'
  | 'auth/invalid-page-token'
  | 'auth/invalid-password'
  | 'auth/invalid-password-hash'
  | 'auth/invalid-password-salt'
  | 'auth/invalid-phone-number'
  | 'auth/invalid-photo-url'
  | 'auth/invalid-provider-id'
  | 'auth/invalid-session-cookie-duration'
  | 'auth/invalid-uid'
  | 'auth/invalid-user-import'
  | 'auth/maximum-user-count-exceeded'
  | 'auth/missing-hash-algorithm'
  | 'auth/missing-uid'
  | 'auth/operation-not-allowed'
  | 'auth/phone-number-already-exists'
  | 'auth/project-not-found'
  | 'auth/reserved-claims'
  | 'auth/session-cookie-expired'
  | 'auth/session-cookie-revoked'
  | 'auth/uid-already-exists'
  | 'auth/password-does-not-meet-requirements'
  | 'auth/email-already-in-use'
  | 'auth/invalid-role'; // Añadido nuevo tipo de error para roles inválidos

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
 * Mapeo de errores de Firebase a respuestas de error
 */
export const FIREBASE_ERROR_MAP: Record<FirebaseErrorCode, ErrorResponse> = {
  // Errores de autenticación
  'auth/claims-too-large': {
    status: 400,
    message: 'Las claims personalizadas exceden el tamaño máximo permitido',
    code: 'auth/claims-too-large'
  },
  'auth/email-already-exists': {
    status: 409,
    message: 'El correo electrónico ya existe',
    code: 'auth/email-already-exists'
  },
  'auth/id-token-expired': {
    status: 401,
    message: 'El ID token ha expirado',
    code: 'auth/id-token-expired'
  },
  'auth/id-token-revoked': {
    status: 401,
    message: 'El ID token ha sido revocado',
    code: 'auth/id-token-revoked'
  },
  'auth/insufficient-permission': {
    status: 403,
    message: 'Permisos insuficientes para realizar la operación',
    code: 'auth/insufficient-permission'
  },
  'auth/internal-error': {
    status: 500,
    message: 'Error interno de Firebase. Intente nuevamente más tarde',
    code: 'auth/internal-error'
  },
  'auth/invalid-argument': {
    status: 400,
    message: 'Argumento inválido proporcionado a un método de autenticación',
    code: 'auth/invalid-argument'
  },
  'auth/invalid-claims': {
    status: 400,
    message: 'Las claims proporcionadas no son válidas',
    code: 'auth/invalid-claims'
  },
  'auth/invalid-continue-uri': {
    status: 400,
    message: 'La URI de continuación no es válida',
    code: 'auth/invalid-continue-uri'
  },
  'auth/invalid-creation-time': {
    status: 400,
    message: 'El tiempo de creación no es válido',
    code: 'auth/invalid-creation-time'
  },
  'auth/invalid-credential': {
    status: 400,
    message: 'La credencial proporcionada no es válida',
    code: 'auth/invalid-credential'
  },
  'auth/invalid-custom-token': {
    status: 400,
    message: 'El token personalizado no es válido',
    code: 'auth/invalid-custom-token'
  },
  'auth/invalid-disabled-field': {
    status: 400,
    message: 'El campo disabled no es válido',
    code: 'auth/invalid-disabled-field'
  },
  'auth/invalid-display-name': {
    status: 400,
    message: 'El displayName no es válido',
    code: 'auth/invalid-display-name'
  },
  'auth/invalid-dynamic-link-domain': {
    status: 400,
    message: 'El dominio de Dynamic Link no es válido',
    code: 'auth/invalid-dynamic-link-domain'
  },
  'auth/invalid-email': {
    status: 400,
    message: 'El correo electrónico no es válido',
    code: 'auth/invalid-email'
  },
  'auth/invalid-email-verified': {
    status: 400,
    message: 'El campo emailVerified no es válido',
    code: 'auth/invalid-email-verified'
  },
  'auth/invalid-hash-algorithm': {
    status: 400,
    message: 'El algoritmo de hash no es válido',
    code: 'auth/invalid-hash-algorithm'
  },
  'auth/invalid-hash-block-size': {
    status: 400,
    message: 'El tamaño de bloque de hash no es válido',
    code: 'auth/invalid-hash-block-size'
  },
  'auth/invalid-hash-derived-key-length': {
    status: 400,
    message: 'La longitud de la clave derivada de hash no es válida',
    code: 'auth/invalid-hash-derived-key-length'
  },
  'auth/invalid-hash-key': {
    status: 400,
    message: 'La clave de hash no es válida',
    code: 'auth/invalid-hash-key'
  },
  'auth/invalid-hash-memory-cost': {
    status: 400,
    message: 'El costo de memoria de hash no es válido',
    code: 'auth/invalid-hash-memory-cost'
  },
  'auth/invalid-hash-parallelization': {
    status: 400,
    message: 'El parámetro de paralelización de hash no es válido',
    code: 'auth/invalid-hash-parallelization'
  },
  'auth/invalid-hash-rounds': {
    status: 400,
    message: 'El número de rondas de hash no es válido',
    code: 'auth/invalid-hash-rounds'
  },
  'auth/invalid-hash-salt-separator': {
    status: 400,
    message: 'El separador de sal de hash no es válido',
    code: 'auth/invalid-hash-salt-separator'
  },
  'auth/invalid-id-token': {
    status: 400,
    message: 'El ID token no es válido',
    code: 'auth/invalid-id-token'
  },
  'auth/invalid-last-sign-in-time': {
    status: 400,
    message: 'El tiempo de último inicio de sesión no es válido',
    code: 'auth/invalid-last-sign-in-time'
  },
  'auth/invalid-page-token': {
    status: 400,
    message: 'El page token no es válido',
    code: 'auth/invalid-page-token'
  },
  'auth/invalid-password': {
    status: 400,
    message: 'La contraseña proporcionada no es válida',
    code: 'auth/invalid-password'
  },
  'auth/invalid-password-hash': {
    status: 400,
    message: 'El hash de la contraseña no es válido',
    code: 'auth/invalid-password-hash'
  },
  'auth/invalid-password-salt': {
    status: 400,
    message: 'La sal de la contraseña no es válida',
    code: 'auth/invalid-password-salt'
  },
  'auth/password-does-not-meet-requirements': {
    status: 400,
    message: 'La contraseña no cumple con los requisitos de seguridad, debe contener un carácter en minúsculas, un carácter numérico y un carácter no alfanumérico',
    code: 'auth/password-does-not-meet-requirements'
  },
  'auth/invalid-phone-number': {
    status: 400,
    message: 'El número de teléfono proporcionado no es válido',
    code: 'auth/invalid-phone-number'
  },
  'auth/invalid-photo-url': {
    status: 400,
    message: 'La URL de la foto no es válida',
    code: 'auth/invalid-photo-url'
  },
  'auth/invalid-provider-id': {
    status: 400,
    message: 'El provider ID no es válido',
    code: 'auth/invalid-provider-id'
  },
  'auth/invalid-session-cookie-duration': {
    status: 400,
    message: 'La duración de la cookie de sesión no es válida',
    code: 'auth/invalid-session-cookie-duration'
  },
  'auth/invalid-uid': {
    status: 400,
    message: 'El UID proporcionado no es válido',
    code: 'auth/invalid-uid'
  },
  'auth/invalid-user-import': {
    status: 400,
    message: 'El usuario importado no es válido',
    code: 'auth/invalid-user-import'
  },
  'auth/maximum-user-count-exceeded': {
    status: 400,
    message: 'Se ha excedido el número máximo de usuarios permitidos para la importación',
    code: 'auth/maximum-user-count-exceeded'
  },
  'auth/missing-hash-algorithm': {
    status: 400,
    message: 'Falta el algoritmo de hash',
    code: 'auth/missing-hash-algorithm'
  },
  'auth/missing-uid': {
    status: 400,
    message: 'Falta el UID',
    code: 'auth/missing-uid'
  },
  'auth/operation-not-allowed': {
    status: 403,
    message: 'Operación no permitida',
    code: 'auth/operation-not-allowed'
  },
  'auth/phone-number-already-exists': {
    status: 409,
    message: 'El número de teléfono ya existe',
    code: 'auth/phone-number-already-exists'
  },
  'auth/project-not-found': {
    status: 404,
    message: 'Proyecto de Firebase no encontrado',
    code: 'auth/project-not-found'
  },
  'auth/reserved-claims': {
    status: 400,
    message: 'Se intentó establecer una claim reservada',
    code: 'auth/reserved-claims'
  },
  'auth/session-cookie-expired': {
    status: 401,
    message: 'La cookie de sesión ha expirado',
    code: 'auth/session-cookie-expired'
  },
  'auth/session-cookie-revoked': {
    status: 401,
    message: 'La cookie de sesión ha sido revocada',
    code: 'auth/session-cookie-revoked'
  },
  'auth/uid-already-exists': {
    status: 409,
    message: 'El UID ya existe',
    code: 'auth/uid-already-exists'
  },
  'auth/email-already-in-use': {
    status: 409,
    message: 'Este e-mail ya se encuentra en uso. Intententa con otro',
    code: 'auth/email-already-in-use'
  },
  'auth/invalid-role': {
    status: 400,
    message: 'El rol proporcionado no es válido. Debe ser uno de los siguientes: admin, gestor, auditor',
    code: 'auth/invalid-role'
  },

  // Errores de Firestore
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
 * Respuesta de error por defecto
 */
export const DEFAULT_ERROR_RESPONSE: ErrorResponse = {
  status: 500,
  message: 'Error del servidor',
  code: 'server/unknown-error'
};

/**
 * Respuesta de error por defecto
 * @param error Error de Firebase o cualquier error
 * @param defaultMessage Mensaje por defecto personalizado si no está definido en el mapa de errores
 * @returns Respuesta de error con código de estado y mensaje
 */
export function handleFirebaseError(error: unknown, defaultMessage?: string): ErrorResponse {
  if (error instanceof FirebaseError) {
    const errorCode = error.code as FirebaseErrorCode;
    return FIREBASE_ERROR_MAP[errorCode] || {
      status: 400,
      message: defaultMessage || error.message,
      code: errorCode
    };
  }
  
  // Error genérico de Firebase
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
  
  // Para otros tipos de error
  const errorMessage = error instanceof Error ? error.message : String(error);
  return {
    status: 500,
    message: defaultMessage || errorMessage || 'Error desconocido',
    code: 'server/unknown-error'
  };
}

/**
 * Ayudante para registrar detalles del error en la consola
 * @param context El contexto/función donde ocurrió el error
 * @param error El objeto de error
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
 * Crea una respuesta de error estándar para respuestas de API
 * @param error El error de Firebase o cualquier otra fuente
 * @param defaultMessage Mensaje por defecto a mostrar si no se proporciona en el error
 * @returns Un objeto de respuesta estandarizado para respuestas de error de API
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