import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const isTestEnvironment = typeof process !== 'undefined' && (
	process.env.NODE_ENV === 'test' ||
	process.env.VITEST === 'true' ||
	process.env.TEST === 'true' ||
	(globalThis as any).__vitest__ !== undefined
);

// Configuración de Firebase, utilizando variables de entorno
const firebaseConfig = {
	apiKey: Bun.env.FIREBASE_API_KEY,
	authDomain: Bun.env.FIREBASE_AUTH_DOMAIN,
	projectId: Bun.env.FIREBASE_PROJECT_ID,
	storageBucket: Bun.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: Bun.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: Bun.env.FIREBASE_APP_ID,
	measurementId: Bun.env.FIREBASE_MEASUREMENT_ID, 
};

// Inicialización de Firebase (skip in test environment)
let app: any;
let auth: any;
let db: any;

if (isTestEnvironment) {
	// En entorno de prueba, crear objetos simulados que no requieran Firebase real
	app = {};
	auth = {};
	// Crear un mock más completo para el objeto db que funcione con las funciones de Firestore
	db = {
		app: {},
		_delegate: {},
		type: 'firestore'
	};
} else {
	// En entorno de producción, inicializar Firebase normalmente
	app = initializeApp(firebaseConfig);
	auth = getAuth(app);
	db = getFirestore(app);
}

export { auth, db };

// Función para validar la configuración de Firebase
export function validateFirebaseConfig() {
	// Saltar validación en entorno de prueba
	if (isTestEnvironment) {
		console.log(`[COMPANY_SVC] Firebase config: MOCKED (test environment)`);
		return;
	}
	
	// Valida que todas las variables estén presentes
	for (const [key, value] of Object.entries(firebaseConfig)) {
		if (!value) {
			throw new Error(`Missing Firebase var: ${key}`);
		}
	}
	console.log(`[COMPANY_SVC] Firebase config: OK`);
}

// Ejecutar validación al inicializar (solo si no estamos en un entorno de prueba)
if (!isTestEnvironment) {
	validateFirebaseConfig();
}
