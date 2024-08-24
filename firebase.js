// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYwM2nsa5s_1jIgBe7_uQh9LjgBWherL0",
  authDomain: "jpnv-expense-tracker.firebaseapp.com",
  projectId: "jpnv-expense-tracker",
  storageBucket: "jpnv-expense-tracker.appspot.com",
  messagingSenderId: "1025515209417",
  appId: "1:1025515209417:web:77242a6a5ecde0051f8318"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export {firestore}