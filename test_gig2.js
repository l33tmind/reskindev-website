import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyCUnsddGBcU-_ncIPcht3KfHPuvgl8cPEo',
  authDomain: 'reskindev-769d3.firebaseapp.com',
  projectId: 'reskindev-769d3',
  storageBucket: 'reskindev-769d3.firebasestorage.app',
  messagingSenderId: '652374646493',
  appId: '1:652374646493:web:b0e18a1b379587f4c9c534',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const ref = doc(db, "services", "1789247179446");
  const snap = await getDoc(ref);
  if (snap.exists()) {
    console.log(JSON.stringify(snap.data(), null, 2));
  } else {
    console.log("Not found");
  }
}
check().catch(console.error).finally(() => process.exit(0));
