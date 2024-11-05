// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC-bKOCwuxwOlp9bfniYrjSksxyV4qOOXA",
    authDomain: "dumitru487whw3db.firebaseapp.com",
    projectId: "dumitru487whw3db",
    storageBucket: "dumitru487whw3db.firebasestorage.app",
    messagingSenderId: "62727017507",
    appId: "1:62727017507:web:542b68384ef30224c90d96",
    measurementId: "G-R2RFF2S2HJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const storage = getStorage(app);