import { initializeApp } from "firebase/app";
import { 
 getAuth 
} from "firebase/auth";

import {
 getFirestore
} from "firebase/firestore";

import {
 getStorage
} from "firebase/storage";


const firebaseConfig = {

  apiKey: "AIzaSyB5BUQMS2pNwH9uRXjofg6x2sXQVYxwUGE",

  authDomain: "vuelos-593df.firebaseapp.com",

  projectId: "vuelos-593df",

  storageBucket: "vuelos-593df.firebasestorage.app",

  messagingSenderId: "142965528184",

  appId: "1:142965528184:web:aaac962f70010a03ba3f8d",
  
  measurementId: "G-JZV4FV2Y3R"

};


const app =
initializeApp(firebaseConfig);


export const auth =
getAuth(app);


export const db =
getFirestore(app);


export const storage =
getStorage(app);