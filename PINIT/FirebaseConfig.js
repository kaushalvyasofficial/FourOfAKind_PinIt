// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics , isSupported as isAnalyticsSupported } from "firebase/analytics";
import {getStorage} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMn6Y2h5dJir_L0YfO3xnpdzwE9mYjEus",
  authDomain: "nexus-e61fe.firebaseapp.com",
  projectId: "nexus-e61fe",
  storageBucket: "nexus-e61fe.appspot.com",
  messagingSenderId: "902330450116",
  appId: "1:902330450116:web:bd50c169baf73fefe54991",
  measurementId: "G-ZK3TM66EBG"
};

// Initialize Firebase


const app = initializeApp(firebaseConfig);
// if(isAnalyticsSupported()) {
//   const analytics = getAnalytics(app);
// }
const db = getStorage(app);
const storage = getStorage(app);
// const analytics = getAnalytics(app);

export {db, storage,app};
export default firebaseConfig;