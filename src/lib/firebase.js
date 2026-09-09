import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: 'AIzaSyCUnsddGBcU-_ncIPcht3KfHPuvgl8cPEo',
  authDomain: 'reskindev-769d3.firebaseapp.com',
  projectId: 'reskindev-769d3',
  storageBucket: 'reskindev-769d3.firebasestorage.app',
  messagingSenderId: '652374646493',
  appId: '1:652374646493:web:b0e18a1b379587f4c9c534',
  measurementId: 'G-MQN9XM0SZB',
};

// Initialize Firebase only if it hasn't been initialized already (important for Next.js SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
