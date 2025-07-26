// // lib/firebase.js
// import { initializeApp, getApps, getApp } from "firebase/app"
// import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth"
// import { getFirestore } from "firebase/firestore"

// const firebaseConfig = {
//   apiKey: "AIzaSyBttVkjVTbgsIhMC_gEmevgmY3X_86itfI",
//   authDomain: "kiithub.in",
//   projectId: "kiithub-1018",
//   storageBucket: "kiithub-1018.firebasestorage.app",
//   messagingSenderId: "560339256269",
//   appId: "1:560339256269:web:dcf89ac3b7d9e553fdfa84",
// }

// // Initialize Firebase app only once
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// // Get Auth and Firestore instances
// const auth = getAuth(app)
// const db = getFirestore(app)
// const provider = new GoogleAuthProvider()

// // Set persistence for auth (should be done once)
// // This is typically handled in the main app entry point, but ensuring it here for robustness
// if (typeof window !== "undefined") {
//   setPersistence(auth, browserLocalPersistence).catch((error) => {
//     console.error("Error setting Firebase persistence:", error)
//   })
// }

// provider.addScope("email")
// provider.addScope("profile")

// export { app, auth, db, provider }




// Firebase configuration
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBttVkjVTbgsIhMC_gEmevgmY3X_86itfI",
  authDomain: "kiithub.in",
  projectId: "kiithub-1018",
  storageBucket: "kiithub-1018.firebasestorage.app",
  messagingSenderId: "560339256269",
  appId: "1:560339256269:web:dcf89ac3b7d9e553fdfa84",
}


// Initialize Firebase
let app = null
let auth = null
let provider = null
let storage = null

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  provider = new GoogleAuthProvider()
  storage = getStorage(app)
  
  console.log('Firebase initialized successfully')
} catch (error) {
  console.error('Firebase initialization error:', error)
}

export { auth, provider, storage }