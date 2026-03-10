// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCE3JirApZTExmTuBVD3cevX656-tRtG0E",
    authDomain: "sshe71.firebaseapp.com",
    projectId: "sshe71",
    storageBucket: "sshe71.firebasestorage.app",
    messagingSenderId: "822417241435",
    appId: "1:822417241435:web:8055c1560dadd4789c567e",
    measurementId: "G-Z8TH7Z64RD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth and Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;