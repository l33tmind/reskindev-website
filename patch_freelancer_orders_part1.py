import re

with open("src/app/freelancer/orders/page.js", "r") as f:
    content = f.read()

# 1. Update filter logic to include requirements, revision, cancelled, etc.
filter_search = r'if \(activeTab === \'active\'\) return o\.status === \'pending\' \|\| o\.status === \'processing\';'
filter_replace = """if (activeTab === 'active') return ['pending', 'requirements', 'processing', 'revision', 'cancel_requested_by_buyer', 'cancel_requested_by_freelancer', 'disputed'].includes(o.status);"""
content = re.sub(filter_search, filter_replace, content)

# 2. Add Timer Function
timer_code = """
  // Format Countdown Timer
  const getCountdown = (createdAt, deliveryDays) => {
    if (!createdAt || !deliveryDays) return "N/A";
    const startTime = createdAt.toDate ? createdAt.toDate().getTime() : new Date(createdAt).getTime();
    const deadline = startTime + (deliveryDays * 24 * 60 * 60 * 1000);
    const now = new Date().getTime();
    const diff = deadline - now;
    if (diff <= 0) return "Late Delivery";
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${d}d ${h}h ${m}m remaining`;
  };

  const handleAction = async (orderId, action) => {
    let newStatus = "";
    if (action === "cancel") newStatus = "cancel_requested_by_freelancer";
    if (action === "admin") newStatus = "disputed";
    if (action === "accept_cancel") newStatus = "cancelled";
    if (action === "decline") {
      const o = orders.find(x => x.id === orderId);
      newStatus = (o && o.requirementsSubmittedAt) ? "processing" : "requirements";
    }
    if (!newStatus) return;
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (e) {
      console.error(e);
    }
  };
"""

state_search = r'  const \[loading, setLoading\] = useState\(true\);'
content = content.replace(state_search, state_search + timer_code)


with open("src/app/freelancer/orders/page.js", "w") as f:
    f.write(content)
