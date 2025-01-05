// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFPP7zMiOET3MTVobQkZIfPUuCQlZ7BwA",
  authDomain: "projektzamobilne-d32b6.firebaseapp.com",
  projectId: "projektzamobilne-d32b6",
  storageBucket: "projektzamobilne-d32b6.firebasestorage.app",
  messagingSenderId: "888778214295",
  appId: "1:888778214295:web:9042eca19b7494ed93d2d2",
  measurementId: "G-G0VKRMVN0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export {auth, firestore};
