// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics , isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmHM4TnoxlOZny9BylHHtw4oRjN8WQ1-c",
  authDomain: "nexus-39979.firebaseapp.com",
  projectId: "nexus-39979",
  storageBucket: "nexus-39979.appspot.com",
  messagingSenderId: "308423492569",
  appId: "1:308423492569:web:7ee924b7ac49273fe54fc8",
  measurementId: "G-3R6TB905MH"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
// const analytics = getAnalytics(app);

export { db, storage, app };
export default firebaseConfig;
