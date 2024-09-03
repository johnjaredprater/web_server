// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// It's okay to put the apiKey here - it's just an identifier, and doesn't allow access by itself: https://stackoverflow.com/a/37484053
const firebaseConfig = {
  apiKey: "AIzaSyBvSLS9ElWgS2f_Fe7P05e4L27poTH8h00",
  authDomain: "auth.johnprater.me",
  projectId: "gym-tracking-1e554",
  storageBucket: "gym-tracking-1e554.appspot.com",
  messagingSenderId: "339777410456",
  appId: "1:339777410456:web:9f2e37d419de6f070507ed",
  measurementId: "G-ST7WHZQG9D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();
