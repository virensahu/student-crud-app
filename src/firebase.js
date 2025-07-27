import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: "AIzaSyCPeY0BJ6hMoR2dpriwMraJjDNKnMQMAFo",
//     authDomain: "student-crud-app-15e29.firebaseapp.com",
//     projectId: "student-crud-app-15e29",
//     storageBucket: "student-crud-app-15e29.firebasestorage.app",
//     messagingSenderId: "1037577682756",
//     appId: "1:1037577682756:web:2dcd607dd4a18327b9a111",
//     measurementId: "G-CKH6Z9JMEE"
// };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("Firebase Config:", firebaseConfig);


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
