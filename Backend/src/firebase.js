// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBUTv6eUCq-FpIIBQrl3AyUsmXjD_QfE2g",
  authDomain: "synk-4f88a.firebaseapp.com",
  databaseURL: "https://synk-4f88a-default-rtdb.firebaseio.com",
  projectId: "synk-4f88a",
  storageBucket: "synk-4f88a.appspot.com",
  messagingSenderId: "803190369",
  appId: "1:803190369:web:510e997f822f8b4d90dc20",
  measurementId: "G-PLJ5JH1S4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const firebaseRealtimeDatabase = getDatabase(app)
const firebaseStorage = getStorage(app);

export {app, auth, firebaseRealtimeDatabase, firebaseStorage}