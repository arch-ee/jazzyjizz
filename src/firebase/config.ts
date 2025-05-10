
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  // You need to replace these with your actual Firebase config values
  apiKey: "AIzaSyDv1GHZ9ZWnZsfdA9ansaiFq5XZLQ_Y-CI",
  authDomain: "jazzyjizz-products.firebaseapp.com",
  databaseURL: "https://jazzyjizz-products-default-rtdb.firebaseio.com",
  projectId: "jazzyjizz-products",
  storageBucket: "jazzyjizz-products.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
