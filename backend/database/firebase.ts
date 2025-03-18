import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: Bun.env.FIREBASE_API_KEY,
    authDomain: Bun.env.FIREBASE_AUTH_DOMAIN,
    projectId: Bun.env.FIREBASE_PROJECT_ID,
    storageBucket: Bun.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Bun.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: Bun.env.FIREBASE_APP_ID,
    measurementId: Bun.env.FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };