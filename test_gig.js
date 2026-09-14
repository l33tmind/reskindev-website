import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "reskindev-769d3",
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
check().catch(console.error);
