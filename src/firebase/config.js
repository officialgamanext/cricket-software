import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTga90zcVUOYwAIbuUcMu9ScrcfNq61oE",
  authDomain: "cricket-software.firebaseapp.com",
  projectId: "cricket-software",
  storageBucket: "cricket-software.firebasestorage.app",
  messagingSenderId: "821117433696",
  appId: "1:821117433696:web:098c2715a259f7dbe95005",
  measurementId: "G-6Q41N72DLV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
