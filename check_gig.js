const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, limit, query } = require('firebase/firestore');

const firebaseConfig = {
  projectId: "onlineplatform-7104b",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const q = query(collection(db, 'services'), limit(1));
  const snap = await getDocs(q);
  snap.forEach(doc => console.log(JSON.stringify(doc.data(), null, 2)));
}
run();
