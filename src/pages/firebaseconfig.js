// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyAtafuH0UtFJpRfa0S3lrR7P0rYgkKDSeQ",
    authDomain: "smartapp-9f287.firebaseapp.com",
    projectId: "smartapp-9f287",
    storageBucket: "smartapp-9f287.firebasestorage.app",
    messagingSenderId: "63450486420",
    appId: "1:63450486420:web:0eb9cf0b41974c5d08c681",
    measurementId: "G-QKDYFC0S91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
