// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClr34Kl8XDRSHoEbvsddSw48hwcfFOsv8",
  authDomain: "dam-chatgpt.firebaseapp.com",
  projectId: "dam-chatgpt",
  storageBucket: "dam-chatgpt.firebasestorage.app",
  messagingSenderId: "825521224887",
  appId: "1:825521224887:web:c7d1f3bcbc5670bacb2132",
  measurementId: "G-SLJ1JKZTBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export { auth };
