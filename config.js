// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA5fOFAIE5tQh8da60OjHco1yasXIlz8n8",
    authDomain: "campfire-chats.firebaseapp.com",
    projectId: "campfire-chats",
    storageBucket: "campfire-chats.appspot.com",
    messagingSenderId: "439322705606",
    appId: "1:439322705606:web:8137096c8827ad312fe1c7",
    measurementId: "G-VEYX6JV5TX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);