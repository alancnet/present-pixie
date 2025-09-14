import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

// Read config from Vite env (define in .env.local)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
}

const app: FirebaseApp = initializeApp(firebaseConfig)
const auth: Auth = getAuth(app)
const db: Firestore = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

export { app, auth, db, googleProvider }
