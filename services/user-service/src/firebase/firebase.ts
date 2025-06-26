// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Check if we're in a test environment
const isTestEnvironment = typeof process !== 'undefined' && (
	process.env.NODE_ENV === 'test' ||
	process.env.VITEST === 'true' ||
	process.env.TEST === 'true' ||
	(globalThis as any).__vitest__ !== undefined
);

// Configuración de Firebase, utilizando variables de entorno
const firebaseConfig = {
  apiKey: isTestEnvironment ? 'test-api-key' : Bun.env.FIREBASE_API_KEY,
  authDomain: isTestEnvironment ? 'test-project.firebaseapp.com' : Bun.env.FIREBASE_AUTH_DOMAIN,
  projectId: isTestEnvironment ? 'test-project' : Bun.env.FIREBASE_PROJECT_ID,
  storageBucket: isTestEnvironment ? 'test-project.appspot.com' : Bun.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: isTestEnvironment ? '123456789' : Bun.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: isTestEnvironment ? '1:123456789:web:abcdef123456' : Bun.env.FIREBASE_APP_ID,
  measurementId: isTestEnvironment ? 'G-ABCDEF123456' : Bun.env.FIREBASE_MEASUREMENT_ID,
};

// Inicialización de Firebase (skip in test environment)
let app: any;
let auth: any;
let db: any;

if (isTestEnvironment) {
	// In test environment, create mock objects that don't require real Firebase
	app = { name: '[DEFAULT]', options: firebaseConfig };
	auth = { app, currentUser: null };
	// Create a more complete mock for the db object that will work with Firestore functions
	db = {
		app,
		_delegate: { app },
		type: 'firestore',
		// Add these properties to make it compatible with Firestore functions
		_databaseId: { projectId: 'test-project', database: '(default)' },
		_settings: {}
	};
} else {
	// In production environment, initialize Firebase normally
	app = initializeApp(firebaseConfig);
	auth = getAuth(app);
	db = getFirestore(app);
}

export { auth, db };

// Función para validar la configuración de Firebase
export function validateFirebaseConfig() {
  // Skip validation in test environment
  if (isTestEnvironment) {
    console.log(`[USER_SVC] Firebase config: MOCKED (test environment)`);
    return;
  }
  
  // Valida que todas las variables estén presentes
  for (const [key, value] of Object.entries(firebaseConfig)) {
    if (!value) {
      throw new Error(`Missing Firebase var: ${key}`);
    }
  }
  console.log(`[USER_SVC] Firebase config: OK`);
}

// Ejecutar validación al inicializar (only if not in test environment)
if (!isTestEnvironment) {
  validateFirebaseConfig();
}
