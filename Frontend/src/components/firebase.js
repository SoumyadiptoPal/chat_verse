import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseApp=initializeApp({
    apiKey: "AIzaSyC2oYVk-gtTBlubgDcb0offNecPJa7fwGw",
  authDomain: "instagram-clone-87209.firebaseapp.com",
  projectId: "instagram-clone-87209",
  storageBucket: "instagram-clone-87209.appspot.com",
  messagingSenderId: "784129359994",
  appId: "1:784129359994:web:cabc454c979d4d30187bc3",
  measurementId: "G-1T00TM0CHZ"
});

const storage = getStorage(firebaseApp);

export {storage};