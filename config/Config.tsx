import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyCM4Waw1zJplo0VbsIQlQXOUdVZZTlK8lI",
    authDomain: "finalnucleo.firebaseapp.com",
    databaseURL: "https://finalnucleo-default-rtdb.firebaseio.com",
    projectId: "finalnucleo",
    storageBucket: "finalnucleo.firebasestorage.app",
    messagingSenderId: "435537655718",
    appId: "1:435537655718:web:52425a7e6766b8f9698167"
  };


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app)