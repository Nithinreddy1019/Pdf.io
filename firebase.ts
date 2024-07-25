import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCrkEz8e6tgRXMIqQaT7z3NiRF1aT5Q5_s",
    authDomain: "pdf-io-5b20d.firebaseapp.com",
    projectId: "pdf-io-5b20d",
    storageBucket: "pdf-io-5b20d.appspot.com",
    messagingSenderId: "844580337698",
    appId: "1:844580337698:web:4b6c7bdbe5c1e5ed92727b"
};

//initialized firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

//get the firebase storage(database)
const db = getFirestore(app);

const storage = getStorage(app);


export { db, storage };