// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBttVkjVTbgsIhMC_gEmevgmY3X_86itfI",
  authDomain: "kiithub.in",
  projectId: "kiithub-1018",
  storageBucket: "kiithub-1018.firebasestorage.app",
  messagingSenderId: "560339256269",
  appId: "1:560339256269:web:dcf89ac3b7d9e553fdfa84",
}

// Initialize Firebase app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Get Auth and Firestore instances
const auth = getAuth(app)
const db = getFirestore(app)
const provider = new GoogleAuthProvider()

// Set persistence for auth (should be done once)
// This is typically handled in the main app entry point, but ensuring it here for robustness
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting Firebase persistence:", error)
  })
}

provider.addScope("email")
provider.addScope("profile")

export { app, auth, db, provider }



// lib/firebase.js

// import { initializeApp, getApps, getApp } from 'firebase/app'
// import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// import { getStorage } from 'firebase/storage'
// import { getFirestore } from 'firebase/firestore'  // ✅ Firestore added

// const firebaseConfig = {
//   apiKey: "AIzaSyBttVkjVTbgsIhMC_gEmevgmY3X_86itfI",
//   authDomain: "kiithub.in",
//   projectId: "kiithub-1018",
//   storageBucket: "kiithub-1018.firebasestorage.app",
//   messagingSenderId: "560339256269",
//   appId: "1:560339256269:web:dcf89ac3b7d9e553fdfa84",
// }

// // ✅ Prevent reinitialization in Next.js
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// // ✅ Initialize services
// const auth = getAuth(app)
// const provider = new GoogleAuthProvider()
// const storage = getStorage(app)
// const db = getFirestore(app)  // ✅ Firestore initialized

// // ✅ Export all needed services
// export { app, auth, provider, storage, db }
