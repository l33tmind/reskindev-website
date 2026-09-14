import re

with open("src/app/freelancer/page.js", "r") as f:
    content = f.read()

# Replace fetchStats logic to include fetching the platformFee
old_fetchStats = """    async function fetchStats() {
      try {
        const gigsQ = query(collection(db, "services"), where("authorId", "==", user.uid));
        const gigsSnap = await getDocs(gigsQ);
        const gigsCount = gigsSnap.size;

        const ordersQ = query(collection(db, "orders"), where("freelancerId", "==", user.uid));
        const ordersSnap = await getDocs(ordersQ);
        let completed = 0;
        let earnings = 0;
        ordersSnap.forEach(doc => {
          const data = doc.data();
          if (data.status === "completed") {
            completed++;
            earnings += data.price || 0;
          }
        });

        setStats({ gigs: gigsCount, orders: completed, earnings });
      } catch (err) {
        console.error(err);
      }
    }"""

new_fetchStats = """    async function fetchStats() {
      try {
        // Fetch Platform Fee first
        const { doc, getDoc } = require("firebase/firestore");
        const settingsSnap = await getDoc(doc(db, "settings", "global"));
        const platformFeePercentage = settingsSnap.exists() ? (Number(settingsSnap.data().platformFee) || 10) : 10;

        const gigsQ = query(collection(db, "services"), where("authorId", "==", user.uid));
        const gigsSnap = await getDocs(gigsQ);
        const gigsCount = gigsSnap.size;

        const ordersQ = query(collection(db, "orders"), where("freelancerId", "==", user.uid));
        const ordersSnap = await getDocs(ordersQ);
        let completed = 0;
        let earnings = 0;
        
        ordersSnap.forEach(d => {
          const data = d.data();
          if (data.status === "completed") {
            completed++;
            const price = parseFloat(data.price) || 0;
            // Calculate what freelancer keeps: e.g. 100 - (100 * 10 / 100) = 90
            const freelancerShare = price - (price * (platformFeePercentage / 100));
            earnings += freelancerShare;
          }
        });

        setStats({ gigs: gigsCount, orders: completed, earnings: earnings.toFixed(2) });
      } catch (err) {
        console.error(err);
      }
    }"""

content = content.replace(old_fetchStats, new_fetchStats)

with open("src/app/freelancer/page.js", "w") as f:
    f.write(content)

