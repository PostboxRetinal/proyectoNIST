// existing code from backend/src/utils/firebaseValidator.ts
export function validateFirebaseConfig(): boolean {
	const requiredEnvVars = [
		'FIREBASE_API_KEY',
		'FIREBASE_AUTH_DOMAIN',
		'FIREBASE_PROJECT_ID',
		'FIREBASE_STORAGE_BUCKET',
		'FIREBASE_MESSAGING_SENDER_ID',
		'FIREBASE_APP_ID',
        'FIREBASE_MEASUREMENT_ID'
	];
	const missingVars = requiredEnvVars.filter((varName) => !Bun.env[varName]);
	if (missingVars.length > 0) {
		console.error(`Variables de entorno de Firebase faltantes:`);
		missingVars.forEach((varName) => console.error(`- ${varName}`));
		return false;
	}
	const apiKey = Bun.env.FIREBASE_API_KEY;
	if (!apiKey || apiKey.length < 30) {
		console.error('FIREBASE_API_KEY parece no ser válido (muy corta)');
		return false;
	}
	return true;
}
