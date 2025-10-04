// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhULjv6XubWcH0xMpajKaOgxGM2MiBqK0",
  authDomain: "piesdatabase.firebaseapp.com",
  projectId: "piesdatabase",
  storageBucket: "piesdatabase.firebasestorage.app",
  messagingSenderId: "907034785220",
  appId: "1:907034785220:web:f98cf07572fafcaa06a091",
  measurementId: "G-4ZBRKKTJLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);