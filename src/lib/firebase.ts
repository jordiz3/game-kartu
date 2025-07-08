import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase
let app;
if (!getApps().length) {
    try {
        app = initializeApp(firebaseConfig);
    } catch (e) {
        console.error("Firebase initialization error", e);
    }
} else {
    app = getApp();
}


const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
