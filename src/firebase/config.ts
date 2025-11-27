import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// 1. Notice we import the NEW tools here:
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// Your Actual Config
const firebaseConfig = {
  apiKey: "AIzaSyCTIGFyRJ1o94SpTmhMuo_Sox1YVH5u65Y",
  authDomain: "cbse-paper-gen.firebaseapp.com",
  projectId: "cbse-paper-gen",
  storageBucket: "cbse-paper-gen.firebasestorage.app",
  messagingSenderId: "95167620216",
  appId: "1:95167620216:web:c177e986ba6cbc15b8f98d"
};


// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// 2. Initialize Firestore with Offline Persistence (The New Way)
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };

