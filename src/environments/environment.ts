// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBmEQJ9I2SVsm6vb1_KWnT-v-06dkmg8vg",
  authDomain: "assignment-5-872a5.firebaseapp.com",
  projectId: "assignment-5-872a5",
  storageBucket: "assignment-5-872a5.firebasestorage.app",
  messagingSenderId: "966487683010",
  appId: "1:966487683010:web:1667f28c663977f332705b",
  measurementId: "G-XW27B8LLQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// 🔐 Auth + 🗄 Firestore exports
export const auth = getAuth(app);
export const db = getFirestore(app);