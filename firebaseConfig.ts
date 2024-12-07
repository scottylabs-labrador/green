
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRKQZSIjkaJrt7Xp8VSypbfuxZNcZrXQ4",
  authDomain: "green-2c431.firebaseapp.com",
  databaseURL: "https://green-2c431-default-rtdb.firebaseio.com",
  projectId: "green-2c431",
  storageBucket: "green-2c431.firebasestorage.app",
  messagingSenderId: "191187275888",
  appId: "1:191187275888:web:4e4572e4c1ff05c366e4b5",
  measurementId: "G-G489MCXEB9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);